const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Ejemplo: 'smtp.tudominio.com'
    port: process.env.SMTP_PORT || 465, // Cambia según tu servidor
    secure: process.env.SMTP_SECURE === 'true', // true para SSL (puerto 465), false para STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false // Evita errores con certificados auto-firmados (opcional)
    }
}, {
    from: `"App gestiON! Notificaciones" <${process.env.SMTP_USER}>` // Remitente predeterminado
  });

// Verificar conexión al servidor SMTP
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Error:', error);
    } else {
        console.log('SMTP Configurado y listo para enviar correos.', success);
    }
});

module.exports = transporter;