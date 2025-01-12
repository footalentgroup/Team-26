const transporter = require('../config/mail');
const AuditLogController = require('../controllers/auditLog.controller'); // Controlador de auditoría

// Lógica para enviar correos, send mail by functionality
const sendEmail = async (req, functionalitySendMail, documentId, emailData) => {
    try {
        const info = await transporter.sendMail(emailData);
        // Registrar en audit_logs
        const changes = { success: true, messageId: documentId, email: emailData, res: info }
        await registerAuditLog(req, functionalitySendMail, documentId, changes);
        console.log('Correo enviado:', info.messageId);
        return { success: true, message: `Correo enviado: ${info.messageId}` };
    } catch (error) {
        // Manejo del error sin relanzarlo
        if (error.responseCode === 550) {
            // Registrar en audit_logs
            const changes = { success: false, message: 'El correo no es válido.' }
            await registerAuditLog(req, functionalitySendMail, documentId, changes);
            console.error('El correo no existe o no es válido:', error.message);
            return { success: false, message: 'El correo no es válido.' };
        } else {
            // Registrar en audit_logs
            const changes = { success: false, message: `Error al enviar el correo. Código: ${error.responseCode}` };
            await registerAuditLog(req, functionalitySendMail, documentId, changes);
            console.error('Error al enviar el correo:', error.message);
            return { success: false, message: `Error al enviar el correo. Código: ${error.responseCode}` };
        }
    }
};

const registerAuditLog = async (req, functionalitySendMail, documentId, changes) => {
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
        auditLogAction: 'SENDEMAIL',                                 // Action performed e.g., "CREATE", "UPDATE", "DELETE"
        auditLogModel: functionalitySendMail,                   // Affected model, e.g., "User"
        auditLogDocumentId: documentId,                         // ID of the affected document (can be null)
        auditLogChanges: changes                                // Changes made or additional information (not mandatory)
    }
    await AuditLogController.createAuditLog(auditLogData);
};


module.exports = {
    sendEmail
};