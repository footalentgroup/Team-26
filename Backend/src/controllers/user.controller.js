const { ObjectId } = require('mongodb');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mail = require('./mail.controller'); // Para enviar correos electrónicos
const bcrypt = require('bcrypt');
const { generateToken } = require('../middlewares/jwtGenerate');
const AuditLogController = require('../controllers/auditLog.controller'); // Controlador de auditoría
const temporalID = new ObjectId(); // ID o nombre del usuario

const auditLogData = {
    //En espera de accciones en el frontend para capturar usuario logeado
    auditLogUser: temporalID // ID o nombre del usuario
    , auditLogAction: 'CREATE'      // Acción realizada e.g., "CREATE", "UPDATE", "DELETE"
    , auditLogModel: 'User'        // Modelo afectado, e.g., "User"
    , auditLogDocumentId: null          // ID del documento afectado (puede ser nulo)
    , auditLogChanges: null          // Cambios realizados o información adicional (no obligatorio)
}

// Crear usuario
const createUser = async (req, res) => {
    try {

        // Crear usuario
        const nuevoUser = new User(req.body);

        if (!nuevoUser.userName) {
            return res.status(400).json({
                ok: false,
                message: 'Se requiere nombre'
            });
        }
        if (!nuevoUser.userEmail) {
            return res.status(400).json({
                ok: false,
                message: 'Se requiere email'
            });
        }
        if (!nuevoUser.userPassword) {
            return res.status(400).json({
                ok: false,
                message: 'Se requiere password'
            });
        }
        if (nuevoUser.userRole) {
            const validRoles = ['supervisor', 'technician'];

            if (!validRoles.includes(nuevoUser.userRole)) {
                return res.status(400).json({
                    ok: false,
                    error: 'El rol debe ser supervisor o técnico'
                });
            }
        }

        const userEmail = nuevoUser.userEmail;

        // Buscar al usuario por email
        let user = await User.findOne({ userEmail: nuevoUser.userEmail });
        if (user) {
            return res.status(404).json({
                ok: false,
                message: 'Ya existe registro con este email'
            });
        }

        // Buscar al usuario por name
        user = await User.findOne({ username: nuevoUser.userName });
        if (user) {
            return res.status(404).json({
                ok: false,
                message: 'Ya existe registro con este nombre'
            });
        }
        // Generar un token de confirmación con expiración de CONFIRMATION_EXPIRATION hora
        const confirmationToken = jwt.sign(
            { userEmail },
            process.env.SECRET_KEY, // Usa una clave secreta de tu entorno
            { expiresIn: `${process.env.CONFIRMATION_EXPIRATION}h` }
        );
        //Encrioptar la contraseña
        const hashedPassword = await bcrypt.hash(nuevoUser.userPassword, 10);;
        nuevoUser.userPassword = hashedPassword;
        nuevoUser.userConfirmationToken = confirmationToken;
        nuevoUser.userConfirmationTokenExpires = new Date(Date.now() + process.env.CONFIRMATION_EXPIRATION * 3600000); // hora en milisegundos

        await nuevoUser.save();
        // Registrar en audit_logs
        // En espera de accciones en el frontend para capturar usuario logeado
        auditLogData.auditLogUser = req.user.id;
        if (!auditLogData.auditLogUser) {
            auditLogData.auditLogUser = 'not req.user.id in createUser ' // Usuario autenticado
        }
        auditLogData.auditLogAction = 'CREATE'
        auditLogData.auditLogDocumentId = nuevoUser._id
        auditLogData.auditLogChanges = { newRecord: nuevoUser.toObject() }
        await AuditLogController.createAuditLog(
            auditLogData
        );

        // Enviar correo de confirmación
        const confirmationLink = `http://${process.env.CLIENT_URL}${process.env.PORT}/api/userconfirm?token=${confirmationToken}`; // Enlace de confirmación
        const emailData = {
            to: userEmail,
            subject: 'Bienvenido a gestiON',
            text: `Por favor confirma tu registro haciendo clic en el enlace:
              "${confirmationLink}"
              Este enlace expirará en ${process.env.CONFIRMATION_EXPIRATION} hora(s)`,
            html: `<p>Por favor confirma tu registro haciendo clic en el enlace de abajo:</p>
              <a href="${confirmationLink}">Confirmar Cuenta</a>
              <p>Este enlace expirará en ${process.env.CONFIRMATION_EXPIRATION} hora.</p>`
        }
        // Reutilizar la función de envío de correos
        const result = await mail.sendEmail(emailData);
        console.log('result sendMail', result);
        if (!result.success) {
            const userDelete = await User.findOne({ userEmail: userEmail });
            if (userDelete) {
                await User.findByIdAndDelete(userDelete._id)
            }
            return res.status(201).json({ ok: false, message: 'Usuario No fue creado. No fue posible enviar correo.' });
        } else {
            return res.status(201).json({ ok: true, message: 'Usuario creado exitosamente. Por favor, revisa tu correo para confirmar tu cuenta.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            error: 'Error interno del servidor'
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario por email
        const user = await User.findOne({ userEmail: email });

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'User not found'
            });
        }
        // Registrar en audit_logs
        //En espera de accciones en el frontend para capturar usuario logeado
        // auditLogData.auditLogUser = req.user.id;
        // if (!auditLogData.auditLogUser) {
        //     auditLogData.auditLogUser = 'req.user.id' // Usuario autenticado
        // }
        auditLogData.auditLogAction = 'UPDATE'
        auditLogData.auditLogDocumentId = user._id

        // Verificar si el usuario está inactivo
        if (!user.userIsActive) {
            auditLogData.auditLogChanges = { actionDetails: 'Intento fallido, Usuario bloqueado' }
            return res.status(403).json({
                ok: false,
                message: 'Usuario bloqueado. Por favor, contacte al administrador.'
            });
        }

        // Comparar la contraseña
        const isPasswordValid = await bcrypt.compareSync(password, user.userPassword);

        if (!isPasswordValid) {
            // Incrementar intentos fallidos
            user.failedAttempts += 1;
            auditLogData.auditLogChanges = { actionDetails: 'Intento fallido, Clave incorrecta' }

            // Registrar el intento fallido
            user.userLoginAttempts.push({
                status: 'failed',
                cause: 'Credenciales inválidas',
            });

            // Bloquear al usuario si supera el límite de intentos
            if (user.failedAttempts >= 3) {
                auditLogData.auditLogChanges = { actionDetails: 'Tercer Intento fallido, procede a bloquear' }
                user.userIsActive = false;
            }

            // Registrar en audit_logs
            await user.save();
            // await AuditLogController.createAuditLog(auditLogData);

            return res.status(401).json({
                ok: false,
                message: 'Credenciales inválidas'
            });
        }

        // Si la contraseña es válida, reiniciar los intentos fallidos
        user.failedAttempts = 0;

        // Registrar el intento exitoso
        const token = await generateToken(user._id, user.userEmail, user.userRole)

        user.userLoginAttempts.push({
            status: 'success',
            token,
        });

        // Registrar el token de la Sesiòn
        user.userLoginToken = token;

        await user.save();
        auditLogData.auditLogChanges = { newRecord: user.toObject() } // Detalles del nuevo registro
        // await AuditLogController.createAuditLog(auditLogData);

        return res.status(200).json({
            ok: true,
            message: `${user.userEmail}, Bienvendia app gestiON`,
            token: token,
            userId: user._id,
            userName: user.userName,
            userRole: user.userRole
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrió un error durante el inicio de sesión'
        });
    }
};

const closeUserSession = async (req, res) => {
    const { id } = req.params;
    try {
        // Buscar al usuario por ID
        const user = await User.findById(id);
        console.log(`userId: ${id}, user: ${user}`)

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        // Asignar null al token de sesión
        user.userLoginToken = null;

        await user.save();
        auditLogData.auditLogUser = user._id;
        auditLogData.auditLogAction = 'UPDATE';
        auditLogData.auditLogDocumentId = user._id;
        auditLogData.auditLogChanges = { actionDetails: 'Cierre de sesión' };
        // await AuditLogController.createAuditLog(auditLogData);

        return res.status(200).json({
            ok: true,
            message: 'Sesión cerrada exitosamente'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Error interno del servidor'
        });
    }
};

const hasAdministrator = async (req, res) => {
    try {
        const adminCount = await User.countDocuments({ userRole: 'administrator' });
        if (adminCount === 0) {
            return res.status(200).json({ hasAdministrator: false });
        }
        return res.status(200).json({ hasAdministrator: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al verificar administradores'
        });
    }
};

const registerAdmin = async (req, res) => {
    const { userName, userEmail, userPassword } = req.body;

    try {
        // Verificar si ya existe al menos un administrador
        const adminExists = await User.exists({ userRole: 'administrator' });
        if (adminExists) {
            return res.status(403).json({
                ok: false,
                message: 'Ya existe un administrador.'
            });
        }

        // Crear nuevo usuario administrador
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        const newUser = new User({
            userName,
            userEmail,
            userPassword: hashedPassword,
            userRole: 'administrator',
        });

        await newUser.save();
        auditLogData.auditLogAction = 'CREATE'
        auditLogData.auditLogDocumentId = newUser._id
        auditLogData.auditLogChanges = { newRecord: newUser.toObject() }
        // await AuditLogController.createAuditLog(auditLogData);

        res.status(201).json({
            ok: true,
            message: 'Administrador registrado exitosamente',
            data: newUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Error al registrar administrador'
        });
    }
};

const confirmUser = async (req, res) => {
    const token = req.query.token.trim();
    if (!token) {
        return res.status(400).json({
            ok: false,
            error: 'Token no proporcionado'
        });
    }
    try {

        // Verificar el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        console.log('decoded token ', decoded);
        const user = await User.findOne({
            userEmail: decoded.userEmail,
            userConfirmationToken: token,
        });

        if (!user) return res.status(400).json({
            ok: false,

            error: 'Token inválido o expirado.'
        });

        // Verificar si el token está expirado
        if (new Date() > user.userConfirmationTokenExpires) {
            user.userIsActive = false;
            user.userConfirmationToken = null;
            user.userConfirmationTokenExpires = null;
            await user.save();

            auditLogData.auditLogUser = req.user.id;
            auditLogData.auditLogAction = 'UPDATE'
            auditLogData.auditLogDocumentId = user._id
            auditLogData.auditLogChanges = { newRecord: user.toObject() }
            await AuditLogController.createAuditLog(auditLogData);

            return res.status(400).json({
                ok: false,
                error: 'Token expirado. Contacte al administrador.'
            });
        }

        // Activar el usuario
        user.userIsActive = true;
        user.userConfirmationToken = null;
        user.userConfirmationTokenExpires = null;
        await user.save();

        auditLogData.auditLogAction = 'UPDATE'
        auditLogData.auditLogDocumentId = user._id
        auditLogData.auditLogChanges = { newRecord: user.toObject() }
        // await AuditLogController.createAuditLog(auditLogData);

        return res.status(200).json({
            ok: true,
            message: 'Cuenta confirmada exitosamente.'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,

            error: 'Error interno del servidor.'
        });
    }
};

// Buscar registro por Id
const getUserById = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id)
        if (!user) return res.status(404).json({
            ok: false,
            message: `No fue encontrado usuario para ${id}`
        })
        // Registrar en audit_logs
        await AuditLogController.createAuditLog(
            'req.user.id', // Usuario autenticado
            'READ', // Acción
            'User', // Modelo afectado
            null, // No aplica a un documento específico
            { actionDetails: 'Retrieved user by id' } // Detalles adicionales
        );

        return res.status(200).json({
            ok: true,
            message: 'Encontrado usuario',
            data: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No fue encontrado usuario, por favor contactar a soporte',
            data: error
        })
    }
}


module.exports = {
    createUser
    , loginUser
    , hasAdministrator
    , registerAdmin
    , confirmUser
    , closeUserSession
    , getUserById
    //   , getAuditLogByUser
    // , testEmail
};

// const testEmail = async (req, res) => {
//     try {
//         const emailTo = req.params.id;
//         if (!emailTo) {
//             return res.status(400).json({ error: `Falta el email de destino. ${req.params.id}` });
//         }
//         const textMessage = 'Hola, este es un mensaje de prueba. Por favor, ignora este mensaje.';
//         const emailData = {
//             to: `${emailTo} <${emailTo}>`,
//             subject: 'Testing app gestiON - Team26 Noche 2024 - FootalentGroup',
//             text: textMessage,
//             html: `<p>${textMessage}</p>`
//         }
//         // Reutilizar la función de envío de correos
//         const info = await mail.sendEmail(emailData, result);
//         return res.status(200).json({ message: 'Email enviado', data: info });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Error interno del servidor.' });
//     }
// }
