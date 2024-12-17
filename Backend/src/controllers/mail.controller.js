const transporter = require('../config/mail');

// Lógica para enviar correos
const send = async (from, to, subject, html ) => {
    try {
        const info = await transporter.sendMail({
            from, // Cambiar según tu remitente
            to,
            subject,
            html
        });

        console.log('Correo enviado:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error al enviar correo de verificación:', error);
        throw error;
    }
}
    ;
module.exports = {
    send
};
