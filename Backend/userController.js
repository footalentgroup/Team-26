// const User = require('../models/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');

// // Buscar todos los registros para users
// const getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find()
//         return res.status(200).json({
//             ok: true,
//             message: 'usuarios encontrados',
//             data: users
//         })
//     } catch (error) {
//         return res.status(500).json({
//             ok: false,
//             message: 'Error al obtener usuarios, por favor contactar a soporte'
//         })
//     }
// }
// // Create user with random password and send email
// const createUser = async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({ 
//         ok: false,
//         message: 'Se requiere email y nombre' });
//     }

//     const password = crypto.randomBytes(8).toString('hex');
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword });
//     await user.save();

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Bienvenido a gestiON',
//       text: `Hola ${name},\n\nTu cuenta ha sido creada exitosamente. Aquí está tu contraseña temporal: ${password}\n\nPor favor, inicia sesión y cambia tu contraseña.\n\nLink de inicio de sesión: ${process.env.LOGIN_URL}\n\nSaludos,\nEl equipo de Footalent`
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(201).json({ 
//       ok: true,
//       message: 'Usuario creado exitosamente y correo enviado' });
//   } catch (err) {
//     res.status(500).json({ 
//       ok: false,
//       message: 'No fue posible crear usuario, por favor contactar a soporte', error: err.message });
//   }
// }

// // Update user by id
// const updateUserById = async (req, res) => {
//     const { id } = req.params;
//     const { companyName, contactPerson, email, phone, address } = req.body
//     try {
//         const updateDataById = {};
//         if (companyName) updateDataById.companyName = companyName;
//         if (contactPerson) updateDataById.contactPerson = contactPerson;
//         if (email) updateDataById.email = email;
//         if (phone) updateDataById.phone = phone;
//         if (address) updateDataById.address = address;
//         const user = await User.findByIdAndUpdate(id, updateDataById)
//         if (!user) return res.status(400).json({
//             ok: false,
//             message: 'No fue posible modificar usere, no fue encontrado o no se detecto modificaciones'
//         })
//         const updateuser = await User.findById(id)
//         return res.status(200).json({
//             ok: true,
//             message: 'usere actualizado',
//             user: updateuser
//         })
//     }
//     catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             ok: false,
//             message: 'No fue posible modificar user, por favor contactar a soporte'
//         })
//     }
// }

// // Login user
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         ok: false,
//         message: 'Email no registrado como usuario' });
//     }

//     if (!user.isActive) {
//       await recordLoginAttempt(user, 'failed', 'Usuario inactivo');
//       return res.status(403).json({
//         ok: false,
//         message: `${user.email} se registra inactivo, por favor contactar a soporte` });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       await recordLoginAttempt(user, 'failed', 'Contraseña incorrecta');
//       return res.status(401).json({ 
//         ok: false,
//         message: 'Contraseña incorrecta, corrija e intente nuevamente' });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
//     await recordLoginAttempt(user, 'success', null, token);

//     res.status(200).json({  
//       ok: false,
//       message: 'Inicio de sesión exitoso', token });
//   } catch (err) {
//     res.status(500).json({ message: 'No fue posible realizar login, por favor contactar a soporte', error: err.message });
//   }
// };

// // Record login attempt
// const recordLoginAttempt = async (user, status, cause = null, token = null) => {
//   user.loginAttempts.push({ status, cause, token });
//   await user.save();
// };

// module.exports = {
//   getAllUsers,
//   createUser,
//   updateUserById,
//   deleteUserById,
//   getUserById,
//   getUserByEmail,
//   searchUsers,
//   loginUser
//   }