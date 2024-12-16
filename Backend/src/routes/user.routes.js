const express = require('express')

// permitir comunicarnos con el frontend
const router = express.Router()
const User = require('../controllers/user.controller')

const { validateToken } = require('../middlewares/validateToken')

// //traer todos los registros user
// router.get('/user', /* validateToken,*/ User.getAllUsers)

// //nuevo usere
// router.post('/user', /* validateToken,*/ User.createUser)

// //modificar usere por el id
// router.patch('/user/:id',  /* validateToken,*/ User.updateUserById)

// //Borrar usere por el id
// router.delete('/user/:id', /* validateToken,*/ User.deleteUserById)

// //Buscar usere por el id
// router.get('/user/:id', /* validateToken,*/ User.getUserById)

// //Buscar usere por el email
// router.get('/userbyemail', /* validateToken,*/ User.getUserByEmail)

// //Buscar usere por un texto en general
// router.get('/usersearch',  /* validateToken,*/ User.searchUsers)

// Login
router.post('/userlogin', User.loginUser);

// Create user administrator
router.post('/userregisteradmin', User.registerAdmin);

// Revisar que existan usuarios U
router.get('/usercheckadmin', User.hasAdministrator);

// Revisar que existan usuarios U
router.post('/user', User.createUser);

// Revisar que existan usuarios U
router.patch('/userconfirm', User.confirmUser);

// router.get('/usertestemail/:id', User.testEmail);

module.exports = router

