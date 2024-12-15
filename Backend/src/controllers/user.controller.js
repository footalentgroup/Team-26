const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mail = require('../controllers/mail.controller'); // Para enviar correos electrónicos
const bcrypt = require('bcrypt');


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
                return res.status(400).json({ error: 'El rol debe ser supervisor o técnico' });
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

        // Buscar al usuario por email
        user = await User.findOne({ username: nuevoUser.userName });
        if (user) {
            return res.status(404).json({
                ok: false,
                message: 'Ya existe registro con este nombre'
            });
        }
        // Generar un token de confirmación con expiración de 1 hora
        const confirmationToken = jwt.sign(
            { userEmail },
            process.env.SECRET_KEY, // Usa una clave secreta de tu entorno
            { expiresIn: `${process.env.CONFIRMATION_EXPIRATION}h` }
        );
        nuevoUser.userConfirmationToken = confirmationToken;
        nuevoUser.userConfirmationTokenExpires = new Date(Date.now() + process.env.CONFIRMATION_EXPIRATION * 3600000); // hora en milisegundos

        await nuevoUser.save();
        // Enviar correo de confirmación
        const confirmationLink = `http://${process.env.CLIENT_URL}${process.env.PORT}/api/userconfirm?${confirmationToken}`; // Enlace de confirmación

        const emailData = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Bienvenido a gestiON',
            html: `<p>Por favor confirma tu registro haciendo clic en el enlace de abajo:</p>
              <a href="${confirmationLink}">Confirmar Cuenta</a>
              <p>Este enlace expirará en ${process.env.CONFIRMATION_EXPIRATION} hora.</p>`
        }
        // Reutilizar la función de envío de correos
        await mail.send(emailData.from, emailData.to, emailData.subject, emailData.html);
        return res.status(201).json({ message: 'Usuario creado exitosamente. Por favor, revisa tu correo para confirmar tu cuenta.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
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
            return res.status(403).json({
                ok: false,
                message: 'Usuario bloqueado. Por favor, contacte al administrador.'
            });
        }

        // Comparar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.userPassword);

        if (!isPasswordValid) {
            // Incrementar intentos fallidos
            user.failedAttempts += 1;

            // Registrar el intento fallido
            user.userLoginAttempts.push({
                status: 'failed',
                cause: 'Credenciales inválidas',
            });

            // Bloquear al usuario si supera el límite de intentos
            if (user.failedAttempts >= 3) {
                user.userIsActive = false;
            }

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
            status: 'éxito',
            token,
        });

        await user.save();

        return res.status(200).json({
            ok: true,
            msg: `${user.email}, Bienvendioa app gestiON`,
            token: token,
            userId: user._id,
            userName: user.userName,
            userRole: user.userRole
        })
;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrió un error durante el inicio de sesión'
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
    try {
        const { token } = req.params;

        // Verificar el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({
            userEmail: decoded.userEmail,
            confirmationToken: token,
        });

        if (!user) return res.status(400).json({ error: 'Token inválido o expirado.' });

        // Verificar si el token está expirado
        if (new Date() > user.confirmationTokenExpires) {
            user.userIsActive = false;
            user.confirmationToken = null;
            user.confirmationTokenExpires = null;
            await user.save();
            return res.status(400).json({ error: 'Token expirado. Contacte al administrador.' });
        }

        // Activar el usuario
        user.userIsActive = true;
        user.confirmationToken = null;
        user.confirmationTokenExpires = null;
        await user.save();

        return res.status(200).json({ message: 'Cuenta confirmada exitosamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

module.exports = {
    createUser
    , loginUser
    , hasAdministrator
    , registerAdmin
    , confirmUser
    //   , getAuditLogByUser
};