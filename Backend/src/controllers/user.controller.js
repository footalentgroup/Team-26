const { ObjectId } = require('mongodb');
const User = require('../models/User');
const WorkOrder = require('../models/WorkOrder');
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
        const token = req.header('Authorization')?.split(' ')[1];
        const secret = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secret);
        const userDataToken = await User.findById(decoded.userData);

        if (userDataToken.userRole !== 'administrator') {
            return res.status(401).json({
                ok: false,
                message: 'No tienes permisos para crear usuarios'
            });
        }

        // Crear usuario
        const nuevoUser = new User(req.body);

        if (!nuevoUser.userName) {
            return res.status(400).json({
                ok: false,
                message: 'Se requiere nombre'
            });
        }
        if (!nuevoUser.userLastName) {
            return res.status(400).json({
                ok: false,
                message: 'Se requiere apellido'
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

        // En caso de que no se proporcione un rol, asignará el rol por defecto: technician
        // En caso de que se proporcione un rol, verificar que sea válido        
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
        const findUserFullName = `${nuevoUser.userName} ${nuevoUser.userLastName}`;

        // Buscar al usuario por name
<<<<<<< HEAD
        user = await User.findOne({ username: nuevoUser.userName });
=======
        user = await User.findOne({ userFullName: findUserFullName });
>>>>>>> develop
        if (user) {
            return res.status(404).json({
                ok: false,
                message: 'Ya existe registro con este nombre y apellido'
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
<<<<<<< HEAD
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
=======
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'CREATE', nuevoUser._id, { newdRecord: nuevoUser.toObject() });
>>>>>>> develop

        // Enviar correo de confirmación
        const confirmationLink = `http://${process.env.BASE_URL}/api/userconfirm?token=${confirmationToken}`; // Enlace de confirmación
        const emailData = {
            to: userEmail,
            subject: `Bienvenido ${nuevoUser.userFullName} a gestiON`,
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
<<<<<<< HEAD
=======
                // Register in audit_logs (req, action, documentId, changes) 
                await registerAuditLog(req, 'DELETE', userDelete._id, { deleteRecord: userDelete.toObject() });
>>>>>>> develop
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

        // Verificar si el usuario está inactivo
        if (!user.userIsActive) {
            // Register in audit_logs (req, action, documentId, changes) 
            await registerAuditLog(req, 'LOGIN', user._id, { actionDetails: 'Intento fallido, Usuario bloqueado' });

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

            // Register in audit_logs (req, action, documentId, changes) 
            await registerAuditLog(req, 'LOGIN', user._id, { actionDetails: 'Intento fallido, Clave incorrecta' });

            // Registrar el intento fallido
            user.userLoginAttempts.push({
                status: 'failed',
                cause: 'Credenciales inválidas',
            });

            // Bloquear al usuario si supera el límite de intentos
            if (user.failedAttempts >= 3) {
                // Register in audit_logs (req, action, documentId, changes) 
                await registerAuditLog(req, 'LOGIN', user._id, { actionDetails: 'Tercer Intento fallido, procede a inactivar' });
                user.userIsActive = false;
            }

            // Registrar en audit_logs
            await user.save();

            return res.status(401).json({
                ok: false,
                message: 'Credenciales inválidas'
            });
        }

        // Si la contraseña es válida, reiniciar los intentos fallidos
        user.failedAttempts = 0;

        // Registrar el intento exitoso
        const token = await generateToken(user._id, user.userEmail, user.userRole);

        user.userLoginAttempts.push({
            status: 'success',
            token,
        });

        // Registrar el token de la Sesiòn
        user.userLoginToken = token;

        await user.save();
        auditLogData.auditLogChanges = { newRecord: user.toObject() } // Detalles del nuevo registro
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'LOGIN', user._id, { actionDetails: 'Registrar token sesiòn, login exitoso' });


        return res.status(200).json({
            ok: true,
<<<<<<< HEAD
            message: `${user.userEmail}, Bienvendia app gestiON`,
=======
            message: `${user.userName}, Bienvenida app gestiON`,
>>>>>>> develop
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
<<<<<<< HEAD
        auditLogData.auditLogUser = user._id;
        auditLogData.auditLogAction = 'UPDATE';
        auditLogData.auditLogDocumentId = user._id;
        auditLogData.auditLogChanges = { actionDetails: 'Cierre de sesión' };
        // await AuditLogController.createAuditLog(auditLogData);
=======

        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'LOGOUT', user._id, { actionDetails: 'Cierre de sesión, anular token de sesión' });
>>>>>>> develop

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
            return res.status(404).json({ hasAdministrator: false });
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
    const { userName, userLastName, userEmail, userPassword } = req.body;

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
            userLastName,
            userEmail,
            userPassword: hashedPassword,
            userRole: 'administrator',
        });

        await newUser.save();

        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'CREATE', newUser._id, { newRecord: newUser.toObject() });
        // Enviar correo de confirmación
        const confirmationLink = `${process.env.BASE_URL}/api/userconfirm?token=${confirmationToken}`; // Enlace de confirmación
        const emailData = {
            to: userEmail,
            subject: `Bienvenido ${userLastName} a gestiON`,
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
                // Register in audit_logs (req, action, documentId, changes) 
                await registerAuditLog(req, 'DELETE', userDelete._id, { deleteRecord: userDelete.toObject() });
            }
            return res.status(201).json({ ok: false, message: 'Administrador No fue creado. No fue posible enviar correo.' });
        } else {
            return res.status(201).json({ ok: true, message: 'Administrador registrado exitosamente. Por favor, revisa tu correo para confirmar tu cuenta.' });
        }

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
<<<<<<< HEAD
=======
    console.log('token ', token);
>>>>>>> develop
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

<<<<<<< HEAD
            auditLogData.auditLogUser = req.user.id;
            auditLogData.auditLogAction = 'UPDATE'
            auditLogData.auditLogDocumentId = user._id
            auditLogData.auditLogChanges = { newRecord: user.toObject() }
            await AuditLogController.createAuditLog(auditLogData);
=======
            // Register in audit_logs (req, action, documentId, changes) 
            await registerAuditLog(req, 'confirmUser', user._id, { actionDetails: 'Token expirado, inactivar usuario' });
>>>>>>> develop

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

        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'confirmUser', user._id, { actionDetails: 'Confirmación exitosa, Activa Usuario' });

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
<<<<<<< HEAD
        const user = await User.findById(id)
=======
        const token = req.header('Authorization')?.split(' ')[1];
        const secret = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secret);
        const userDataToken = await User.findById(decoded.userData);

        const user = await User.findById(id)

        if (userDataToken.userRole === 'technician' && userDataToken._id !== id) {
            return res.status(401).json({
                ok: false,
                message: 'No tienes permisos para consultar otros usuarios'
            });
        }

        if (userDataToken.userRole === 'supervisor' && userDataToken._id !== id && user.userRole !== 'technician') {
            return res.status(401).json({
                ok: false,
                message: 'Solo tienes permisos para consultar técnicos'
            });
        }

>>>>>>> develop
        if (!user) return res.status(404).json({
            ok: false,
            message: `No fue encontrado usuario para ${id}`
        })
<<<<<<< HEAD
        // Registrar en audit_logs
        await AuditLogController.createAuditLog(
            'req.user.id', // Usuario autenticado
            'READ', // Acción
            'User', // Modelo afectado
            null, // No aplica a un documento específico
            { actionDetails: 'Retrieved user by id' } // Detalles adicionales
        );
=======
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'READ', user._id, { actionDetails: 'Get user by id' });
>>>>>>> develop

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

<<<<<<< HEAD
=======
// Get all supervisor records
const getAllSupervisor = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        const secret = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secret);
        const userDataToken = await User.findById(decoded.userData);

        if (userDataToken.userRole !== 'administrator') {
            return res.status(401).json({
                ok: false,
                message: 'No tienes permisos para consultar otros supervisores'
            });
        }
        const users = await User.find({ userRole: 'supervisor' })
        if (!users || users.length === 0) return res.status(404).json({ ok: false, message: 'No se encontraron supervisores' });
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'REAd', null, { actionDetails: 'get all supervisors' });

        return res.status(200).json({
            ok: true,
            message: 'Supervisores encontrados',
            data: users
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al recuperar supervisores',
            data: error
        })
    }
}

// Get all technician records
const getAllTechnician = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        const secret = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secret);
        const userDataToken = await User.findById(decoded.userData);

        if (userDataToken.userRole === 'technician') {
            return res.status(401).json({
                ok: false,
                message: 'No tienes permisos para consultar técnicos'
            });
        }
        const users = await User.find({ userRole: 'technician' })
        if (!users || users.length === 0) return res.status(404).json({ ok: false, message: 'No se encontraron técnicos' });
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'REAd', null, { actionDetails: 'get all technicians' });

        return res.status(200).json({
            ok: true,
            message: 'Técnicos encontrados',
            data: users
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al recuperar técnicos',
            data: error
        })
    }
}


const registerAuditLog = async (req, action, documentId, changes) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    let auditLogUser = 'anonymous';
    if (token) {
        const decoded = jwt.verify(token, secret);
        auditLogUser = decoded.userData
    }
    if (!token && documentId) {
        auditLogUser = documentId
    }
    const auditLogData = {
        auditLogUser: auditLogUser,                             // User who performed the action (can be null)
        auditLogAction: action,                                 // Action performed e.g., "CREATE", "UPDATE", "DELETE"
        auditLogModel: 'User',                                  // Affected model, e.g., "User"
        auditLogDocumentId: documentId,                         // ID of the affected document (can be null)
        auditLogChanges: changes                                // Changes made or additional information (not mandatory)
    }
    await AuditLogController.createAuditLog(auditLogData);
};

// Get all user records
const getAllUsers = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        const secret = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secret);
        const userDataToken = await User.findById(decoded.userData);

        if (userDataToken.userRole !== 'administrator') {
            return res.status(401).json({
                ok: false,
                message: 'No tienes permisos para consultar usuarios'
            });
        }
        const users = await User.find()
        if (!users || users.length === 0) return res.status(404).json({ ok: false, message: 'No se encontraron usuarios' });
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'REAd', null, { actionDetails: 'get all users' });

        return res.status(200).json({
            ok: true,
            message: 'Usuarios encontrados',
            data: users
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al recuperar usuarios',
            data: error
        })
    }
}

// Update a user by id
const updateUserById = async (req, res) => {
    const { id } = req.params;
    const { userName, userLastName, userEmail, userRole, userIsActive, userPassword } = req.body;
    let hasChanges = false;
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        const secret = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secret);
        const userDataToken = await User.findById(decoded.userData);

        const updateDataById = {};
        const changes = {};
        const originalData = await User.findById(id).lean();
        if (!originalData)
            return res.status(400).json({
                ok: false,
                message: 'No se encontró ningún usuario con el id proporcionado'
            })
        if (originalData) {
            if (userName) updateDataById.userName = userName.trim().upperCase();
            if (userLastName) updateDataById.userLastName = userLastName.trim().upperCase();
            if (userEmail && userDataToken.userRole === 'administrator') updateDataById.userEmail = userEmail;
            if (userRole && userDataToken.userRole === 'administrator' && userRole !== 'administrator' && userDataToken._id !== originalData._id) updateDataById.userRole = userRole;
            if (userIsActive && userDataToken.userRole === 'administrator' && userDataToken._id !== originalData._id) updateDataById.userIsActive = userIsActive;
            if (userPassword) {
                const hashedPassword = await bcrypt.hash(userPassword, 10);
                updateDataById.userPassword = hashedPassword
            };
            // Identify changes
            for (let key in updateDataById) {
                if (originalData[key] !== updateDataById[key]) {
                    hasChanges = true;
                    if (key === 'userPassword') {
                        changes[key] = { old: '********', new: '********' }
                    }
                    else {
                        changes[key] = { old: originalData[key], new: updateDataById[key] }
                    };
                    console.log('changes', changes);
                }
            }
        }
        if (!hasChanges)
            return res.status(400).json({
                ok: false,
                message: 'No se detectaron cambios, no se puede actualizar el usuario'
            })
        const user = await User.findByIdAndUpdate(id, updateDataById)
        if (!user)
            return res.status(400).json({
                ok: false,
                message: 'No se puede actualizar el usuario, no encontrado o no se detectaron cambios'
            })
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'UPDATE', id, { updateRecord: changes });

        return res.status(200).json({
            ok: true,
            message: 'Usuario actualizado',
            data: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No se puede actualizar el usuario, por favor contacte al soporte',
            data: error
        })
    }
}

// Delete a user by id
const deleteUserById = async (req, res) => {
    const { id } = req.params;
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    if (!token) {
        return res.status(400).json({
            ok: false,
            error: 'Token no proporcionado'
        });
    }
    console.log('deleteUserById token ', token);
try {
        const decoded = jwt.verify(token, secret);
        console.log('deleteUserById decoded and id ', decoded, id);

        if (decoded.userData === id) {
            return res.status(401).json({
                ok: false,
                message: 'No tienes permisos para autoeliminarte'
            });
        }
        const userDataToken = await User.findById(decoded.userData);

        if (userDataToken.userRole !== 'administrator') {
            return res.status(401).json({
                ok: false,
                message: 'No tienes permisos para eliminar usuarios'
            });
        }
        const userValidate = await User.findById(id)
        if (!userValidate) {
            return res.status(404).json({
                ok: false,
                message: 'No existe usuario con el id proporcionado'
            });
        }
        if (userDataToken._id === userValidate._id) {
            return res.status(401).json({
                ok: false,
                message: 'No tienes permisos para autoeliminarte'
            });
        }
        const workOrderCount = await WorkOrder.countDocuments({ workOrderSupervisor: userValidate._id });
        if (workOrderCount > 0) {
            // Register in audit_logs (req, action, documentId, changes) 
            userValidate.userIsActive = false;
            await userValidate.save();
            await registerAuditLog(req, 'INACTIVE', userValidate._id, { actionDetails: 'Solicitada eliminación, Inactiva Usuario' });
            return res.status(200).json({
                ok: true,
                message: 'No se puede eliminar el supervisor, tiene órdenes de trabajo registradas. Se aplicó inactivación',
                data: userValidate
            })
        }
        const workOrderAssignedCount = await WorkOrder.countDocuments({ workOrderAssignedTechnician: userValidate._id });
        if (workOrderAssignedCount > 0) {
            userValidate.userIsActive = false;
            await userValidate.save();
            await registerAuditLog(req, 'INACTIVE', userValidate._id, { actionDetails: 'Solicitada eliminación, Inactiva Usuario' });
            return res.status(200).json({
                ok: true,
                message: 'No se puede eliminar el técnico, tiene órdenes de trabajo asignadas. Se aplicó inactivación',
                data: userValidate
            })
        }
        const user = await User.findByIdAndDelete(id)
        if (!user)
            return res.status(400).json({
                ok: false,
                message: 'No se puede eliminar el usuario, no encontrado'
            })
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'DELETE', id, { deletedRecord: user.toObject() });
        return res.status(200).json({
            ok: true,
            message: 'Usuario eliminado',
            data: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No se puede eliminar el usuario, por favor contacte al soporte',
            data: error
        })
    }
}
>>>>>>> develop

module.exports = {
    createUser
    , loginUser
    , hasAdministrator
    , registerAdmin
    , confirmUser
    , closeUserSession
    , getUserById
<<<<<<< HEAD
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
=======
    , getAllSupervisor
    , getAllTechnician
    , getAllUsers
    , updateUserById
    , deleteUserById
};

>>>>>>> develop
