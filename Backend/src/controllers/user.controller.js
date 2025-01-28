const { ObjectId } = require('mongodb');
const User = require('../models/User');
const WorkOrder = require('../models/WorkOrder');
const jwt = require('jsonwebtoken');
const mail = require('./mail.controller'); 
const bcrypt = require('bcrypt');
const { generateToken } = require('../middlewares/jwtGenerate');
const AuditLogController = require('../controllers/auditLog.controller'); 
const temporalID = new ObjectId(); 

const auditLogData = {
    auditLogUser: temporalID        
    , auditLogAction: 'CREATE'      
    , auditLogModel: 'User'         
    , auditLogDocumentId: null      
    , auditLogChanges: null         
}

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

        let user = await User.findOne({ userEmail: nuevoUser.userEmail });
        if (user) {
            return res.status(404).json({
                ok: false,
                message: 'Ya existe registro con este email'
            });
        }
        const findUserFullName = `${nuevoUser.userName} ${nuevoUser.userLastName}`;

        user = await User.findOne({ userFullName: findUserFullName });
        if (user) {
            return res.status(404).json({
                ok: false,
                message: 'Ya existe registro con este nombre y apellido'
            });
        }
        const confirmationToken = jwt.sign(
            { userEmail },
            process.env.SECRET_KEY, 
            { expiresIn: `${process.env.CONFIRMATION_EXPIRATION}h` }
        );
        if(nuevoUser.userPassword !== null){
            let hashedPassword = await bcrypt.hash(nuevoUser.userPassword, 10);;
            nuevoUser.userPassword = hashedPassword;
        } 

        nuevoUser.userConfirmationToken = confirmationToken;
        nuevoUser.userConfirmationTokenExpires = new Date(Date.now() + process.env.CONFIRMATION_EXPIRATION * 3600000); 

        await nuevoUser.save();
        await registerAuditLog(req, 'CREATE', nuevoUser._id, { newdRecord: nuevoUser.toObject() });

        const confirmationLink = `${process.env.CLIENT_URL}/cuentaactiv?token=${confirmationToken}`; 
        const emailData = {
            to: userEmail,
            subject: `Bienvenido ${nuevoUser.userFullName} a gestiON`,
            text: `Por favor confirma tu registro haciendo clic en el enlace:
              "${confirmationLink}"
              Este enlace expirará en ${process.env.CONFIRMATION_EXPIRATION} hora(s)`,
            html: `
            <p>Hola ${nuevoUser.userName},</p>
            <p>Tu contraseña temporal es: <strong>${nuevoUser.userPassword}</strong></p>
            <p>Por favor confirma tu registro haciendo clic en el enlace de abajo:</p>
            <a href="${confirmationLink}">Confirmar Cuenta</a>
            <p>Este enlace expirará en ${process.env.CONFIRMATION_EXPIRATION} hora.</p>`
        }
        const reqMail = { token : token, functionalitySendMail: 'userCreate', documentId: nuevoUser._id, emailData : emailData };
        const result = await mail.sendEmail(reqMail);
        if (!result.success) {
            const userDelete = await User.findOne({ userEmail: userEmail });
            if (userDelete) {
                await User.findByIdAndDelete(userDelete._id)
                await registerAuditLog(req, 'DELETE', userDelete._id, { deleteRecord: userDelete.toObject() });
            }
            return res.status(201).json({ ok: false, message: 'Usuario No fue creado. No fue posible enviar correo.' });
        } else {
            return res.status(201).json({ ok: true, message: 'Usuario creado exitosamente. Por favor, revisa tu correo para confirmar tu cuenta.' });
        }
    } catch (error) {
        
        return res.status(500).json({
            ok: false,
            error: `Error interno del servidor ${error.code} ${error.message}`
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ userEmail: email });

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'User no registrado'
            });
        }

        if (!user.userIsActive) {
            await registerAuditLog(req, 'LOGIN', user._id, { actionDetails: 'Intento fallido, Usuario bloqueado' });

            return res.status(403).json({
                ok: false,
                message: 'Usuario bloqueado. Por favor, contacte al administrador.'
            });
        }

        const isPasswordValid = await bcrypt.compareSync(password, user.userPassword);

        if (!isPasswordValid) {
            user.failedAttempts += 1;

            await registerAuditLog(req, 'LOGIN', user._id, { actionDetails: 'Intento fallido, Clave incorrecta' });

            user.userLoginAttempts.push({
                status: 'failed',
                cause: 'Credenciales inválidas',
            });

            if (user.failedAttempts >= 3) {
                await registerAuditLog(req, 'LOGIN', user._id, { actionDetails: 'Tercer Intento fallido, procede a inactivar' });
                user.userIsActive = false;
            }

            await user.save();

            return res.status(401).json({
                ok: false,
                message: 'Credenciales inválidas'
            });
        }

        user.failedAttempts = 0;

        const token = await generateToken(user._id, user.userEmail, user.userRole);

        user.userLoginAttempts.push({
            status: 'success',
            token,
        });

        user.userLoginToken = token;

        await user.save();
        auditLogData.auditLogChanges = { newRecord: user.toObject() } 
        await registerAuditLog(req, 'LOGIN', user._id, { actionDetails: 'Registrar token sesiòn, login exitoso' });


        return res.status(200).json({
            ok: true,
            message: `${user.userName}, Bienvenida app gestiON`,
            token: token,
            userId: user._id,
            userName: user.userName,
            userRole: user.userRole
        });

    } catch (error) {
        
        res.status(500).json({
            ok: false,
            message: 'Ocurrió un error durante el inicio de sesión'
        });
    }
};

const closeUserSession = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        user.userLoginToken = null;

        await user.save();

 

        return res.status(200).json({
            ok: true,
            message: 'Sesión cerrada exitosamente'
        });
    } catch (error) {
        
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
        
        return res.status(500).json({
            ok: false,
            message: 'Error al verificar administradores'
        });
    }
};

const registerAdmin = async (req, res) => {
    const { userName, userLastName, userEmail, userPassword } = req.body;

    try {
        const adminExists = await User.exists({ userRole: 'administrator' });
        if (adminExists) {
            return res.status(403).json({
                ok: false,
                message: 'Ya existe un administrador.'
            });
        }

        const hashedPassword = await bcrypt.hash(userPassword, 10);
        const newUser = new User({
            userName,
            userLastName,
            userEmail,
            userPassword: hashedPassword,
            userRole: 'administrator',
        });

        await newUser.save();

        await registerAuditLog(req, 'CREATE', newUser._id, { newRecord: newUser.toObject() });
        const confirmationLink = `${process.env.BASE_URL  || 'http://localhost:4200'}/cuentaactivconfirm?token=${confirmationToken}`; 
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
        const reqMail = { token : token, functionalitySendMail: 'userRegisterAdmin', documentId: nuevoUser._id, emailData : emailData };
        const result = await mail.sendEmail(reqMail);
        if (!result.success) {
            const userDelete = await User.findOne({ userEmail: userEmail });
            if (userDelete) {
                await User.findByIdAndDelete(userDelete._id)
                await registerAuditLog(req, 'DELETE', userDelete._id, { deleteRecord: userDelete.toObject() });
            }
            return res.status(201).json({ ok: false, message: 'Administrador No fue creado. No fue posible enviar correo.' });
        } else {
            return res.status(201).json({ ok: true, message: 'Administrador registrado exitosamente. Por favor, revisa tu correo para confirmar tu cuenta.' });
        }

    } catch (error) {
        
        res.status(500).json({
            ok: false,
            message: 'Error al registrar administrador'
        });
    }
};

const confirmUser = async (req, res) => {
    const token = req.query.token.trim();
    const userEmailConfirm = req.query.email.trim();
    const userPasswordConfirm = req.query.password.trim();
    if (!token) {
        return res.status(400).json({
            ok: false,
            error: 'Token no proporcionado'
        });
    }
    if(!userEmailConfirm){
        return res.status(400).json({
            ok: false,
            error: 'Email no proporcionado'
        });
    }
    if(!userPasswordConfirm){
        return res.status(400).json({
            ok: false,
            error: 'Password no proporcionado'
        });
    }
    try {

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(userEmailConfirm !== decoded.userEmail)return res.status(400).json({
            ok: false,
            error: 'Token no registrado para este usuario.'
        });
        const user = await User.findOne({
            userEmail: decoded.userEmail,
            userConfirmationToken: token,
        });

        if (!user) return res.status(400).json({
            ok: false,
            error: 'Token inválido o expirado.'
        });

        if (new Date() > user.userConfirmationTokenExpires) {
            user.userIsActive = false;
            user.userConfirmationToken = null;
            user.userConfirmationTokenExpires = null;
            await user.save();

            await registerAuditLog(req, 'confirmUser', user._id, { actionDetails: 'Token expirado, inactivar usuario' });

            return res.status(400).json({
                ok: false,
                error: 'Token expirado. Contacte al administrador.'
            });
        }


        const hashedPassword = await bcrypt.hash(userPasswordConfirm, 10);
        user.userPassword = hashedPassword;

        user.userIsActive = true;
        user.userConfirmationToken = null;
        user.userConfirmationTokenExpires = null;
        await user.save();

        await registerAuditLog(req, 'confirmUser', user._id, { actionDetails: 'Confirmación exitosa, Activa Usuario' });

        return res.status(200).json({
            ok: true,
            message: 'Cuenta confirmada exitosamente.'
        });
    } catch (error) {
        
        return res.status(500).json({
            ok: false,

            error: 'Error interno del servidor.'+ error.message
        });
    }
};

const getUserById = async (req, res) => {
    const id = req.params.id
    try {
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

        if (!user) return res.status(404).json({
            ok: false,
            message: `No fue encontrado usuario para ${id}`
        })
        await registerAuditLog(req, 'READ', user._id, { actionDetails: 'Get user by id' });

        return res.status(200).json({
            ok: true,
            message: 'Encontrado usuario',
            data: user
        })
    } catch (error) {
        
        return res.status(500).json({
            ok: false,
            message: 'No fue encontrado usuario, por favor contactar a soporte',
            data: error
        })
    }
}

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
        auditLogUser: auditLogUser,                             
        auditLogAction: action,                                 
        auditLogModel: 'User',                                  
        auditLogDocumentId: documentId,                         
        auditLogChanges: changes                                
    }
    await AuditLogController.createAuditLog(auditLogData);
};

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
            if (userName) updateDataById.userName = userName.trim().toUpperCase();
            if (userLastName) updateDataById.userLastName = userLastName.trim().toUpperCase();
            if (userEmail && userDataToken.userRole === 'administrator') updateDataById.userEmail = userEmail;
            if (userRole && userDataToken.userRole === 'administrator' && userRole !== 'administrator' && userDataToken._id !== originalData._id) updateDataById.userRole = userRole;
            if (userIsActive && userDataToken.userRole === 'administrator' && userDataToken._id !== originalData._id) updateDataById.userIsActive = userIsActive;
            if (userPassword) {
                const hashedPassword = await bcrypt.hash(userPassword, 10);
                updateDataById.userPassword = hashedPassword
};
            for (let key in updateDataById) {
                if (originalData[key] !== updateDataById[key]) {
                    hasChanges = true;
                    if (key === 'userPassword') {
                        changes[key] = { old: '********', new: '********' }
                    }
                    else {
                        changes[key] = { old: originalData[key], new: updateDataById[key] }
                    };
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
        await registerAuditLog(req, 'UPDATE', id, { updateRecord: changes });

        return res.status(200).json({
            ok: true,
            message: 'Usuario actualizado',
            data: user
        })
    } catch (error) {
        
        return res.status(500).json({
            ok: false,
            message: 'No se puede actualizar el usuario, por favor contacte al soporte',
            data: error
        })
    }
}

const deleteUserById = async (req, res) => {
    const { id } = req.params;
    if (!req.query.userDeletionCause) {
        return res.status(400).json({
            ok: false,
            message: 'Se requiere causa de eliminación'
        });
    }
    const userDeletionCause = req.query.userDeletionCause.trim();
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    if (!token) {
        return res.status(400).json({
            ok: false,
            error: 'Token no proporcionado'
        });
    }

try {
        const decoded = jwt.verify(token, secret);

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
            userValidate.userIsActive = false;
            userValidate.userDeletionCause = userDeletionCause;
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
            userValidate.userDeletionCause = userDeletionCause;
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
        await registerAuditLog(req, 'DELETE', id, { DeletionCause: userDeletionCause, deletedRecord: user.toObject() });
        return res.status(200).json({
            ok: true,
            message: 'Usuario eliminado',
            data: user
        })
    } catch (error) {
        
        return res.status(500).json({
            ok: false,
            message: 'No se puede eliminar el usuario, por favor contacte al soporte',
            data: error
        })
    }
}

const userByTokenConfirmation = async (req, res) => { 
    const token = req.query.token.trim();
    if (!token) {
        return res.status(400).json({
            ok: false,
            error: 'Token no proporcionado'
        });
    }
    try {

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({
            userEmail: decoded.userEmail,
            userConfirmationToken: token,
        });

        if (!user) return res.status(400).json({
            ok: false,
            error: 'Token inválido o expirado.'
        });

        if (new Date() > user.userConfirmationTokenExpires) {
            user.userIsActive = false;
            user.userConfirmationToken = null;
            user.userConfirmationTokenExpires = null;
            await user.save();

            await registerAuditLog(req, 'userByTokenConfirmation', user._id, { actionDetails: 'Token expirado, inactivar usuario y limpiar token de confirmación' });

            return res.status(400).json({
                ok: false,
                error: 'Token expirado. Contacte al administrador.'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Usuario en espera de confirmación',
            data: user
        });
    } catch (error) {
        
        return res.status(500).json({
            ok: false,

            error: `Error interno del servidor. ${error.code} ${error.message}`
        });
    }
};

module.exports = {
    createUser
    , loginUser
    , hasAdministrator
    , registerAdmin
    , confirmUser
    , closeUserSession
    , getUserById
    , getAllSupervisor
    , getAllTechnician
    , getAllUsers
    , updateUserById
    , deleteUserById
    , userByTokenConfirmation
};

