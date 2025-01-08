const { ObjectId } = require('mongodb');
const transporter = require('../config/mail');
const AuditLogController = require('../controllers/auditLog.controller'); // Controlador de auditoría
// const auditLog = require('../models/AuditLog');
const temporalID = new ObjectId(); // ID o nombre del usuario

// Lógica para enviar correos
const sendEmail = async ( emailData ) => {
    try {
        const info = await transporter.sendMail(emailData);
        // Registrar en audit_logs
        // await AuditLogController.createAuditLog(
        //     temporalID._id, // Usuario que realizó la acción
        //     'SENDEMAIL', // Acción
        //     'auditLog', // Modelo afectado
        //     null,
        //     { messageId : 'Global traceability', email : emailData, res : info } // Detalles del nuevo registro
        // );

        console.log('Correo enviado:', info.messageId);
        return { success: true, message: `Correo enviado: ${info.messageId}` };
    } catch (error) {
        // Manejo del error sin relanzarlo
        if (error.responseCode === 550) {
            console.error('El correo no existe o no es válido:', error.message);
            return { success: false, message: 'El correo no es válido.' };
        } else {
            console.error('Error al enviar el correo:', error.message);
            return { success: false, message: `Error al enviar el correo. Código: ${error.responseCode}` };
        }
    }
};

module.exports = {
    sendEmail
};