const express = require('express')

// permitir comunicarnos con el frontend
const router = express.Router()
const User = require('../controllers/user.controller')

const { validateToken } = require('../middlewares/validateToken')

//traer todos los registros user
// router.get('/user',  validateToken, User.getAllUsers)

//nuevo usuario
// router.post('/user',  validateToken, User.createUser)

//modificar usuario por el id
// router.patch('/user/:id',   validateToken, User.updateUserById)

//Borrar usuario por el id
// router.delete('/user/:id',  validateToken, User.deleteUserById)
 
//Buscar usuario por el email
// router.get('/userbyemail',  validateToken, User.getUserByEmail)

// //Buscar usuario por un texto en general
//  router.get('/usersearch',  validateToken, User.searchUsers)

// Login
/**
 * @swagger
 * /userlogin:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *             example: { "email": "appgestion_qa@apoyarte.com", "password": "appgestion_qa" }
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": true, "message": "appgestion_qa@apoyarte.com, Bienvendia app gestiON", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6IjY3NmZjZmVlYzkyYzQwN2FlZDJhNmRjMyIsImlhdCI6MTczNTU5NzQzMCwiZXhwIjoxNzM1NjExODMwfQ.cgQ18nvqPC_JePu8Lw0Ti_LZq_5FQRJexXHFmjqf1tA", "userId": "676fcfeec92c407aed2a6dc3", "userName": "APPGESTION_QA", "userRole": "administrator" }
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "Invalid email or password" }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "Internal server error" }
 */

router.post('/userlogin', User.loginUser);

// Close Session
/**
 * @swagger
 * /userclosesession/{id}:
 *   patch:
 *     summary: Close a user session
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *         example: 676fcfeec92c407aed2a6dc3
 *     responses:
 *       200:
 *         description: User session closed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": true, "message": "User session closed successfully" }
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "User not found" }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "Internal server error" }
 */

router.patch('/userclosesession/:id', validateToken, User.closeUserSession);

// Create user administrator
router.post('/userregisteradmin', User.registerAdmin);

// Revisar que existan usuarios U
router.get('/usercheckadmin', User.hasAdministrator);

// Revisar que existan usuarios U
router.post('/user', User.createUser);

// Revisar que existan usuarios U
router.patch('/userconfirm', User.confirmUser);

// Buscar usuario por el id
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *         example: 676fcfeec92c407aed2a6dc3
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *             tyoe: object
 *             example: { "ok": true, "message": "Encontrado usuario", "data": { "_id": "676fcfeec92c407aed2a6dc3", "userName": "APPGESTION_QA", "userEmail": "appgestion_qa@apoyarte.com", "userPassword": "$2b$10$9/SlQ9pIxP8UKCWVws222ef.9UUyl8l/y7ls1RRgeBwXZO8OOeI7y", "userIsActive": true, "userRole": "administrator", "userFailedAttempts": 0, "userLoginAttempts": [ { "status": "success", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6IjY3NmZjZmVlYzkyYzQwN2FlZDJhNmRjMyIsImlhdCI6MTczNTM4MTA4NywiZXhwIjoxNzM1Mzk1NDg3fQ.3jKg_HNDC05iZmhY83pdHokYtiQAngY9PjIPyyxl8qM", "_id": "676fd05fc92c407aed2a6dc8", "timestamp": "2024-12-28T10:18:07.569Z" }, { "status": "success", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6IjY3NmZjZmVlYzkyYzQwN2FlZDJhNmRjMyIsImlhdCI6MTczNTQwMDg2MywiZXhwIjoxNzM1NDE1MjYzfQ.3x-Y7bOw3InTHEUDB9NObT-2prZMOeEfm2yLrM2hxYg", "_id": "67701d9fb9101471c7c6ff8a", "timestamp": "2024-12-28T15:47:43.062Z" }, { "status": "success", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6IjY3NmZjZmVlYzkyYzQwN2FlZDJhNmRjMyIsImlhdCI6MTczNTU1Nzc3NSwiZXhwIjoxNzM1NTcyMTc1fQ.a1KMNl3I18gRbaZHB1Rob16A2Eyh3QtNopnPz7a5f1g", "_id": "6772828f329c897337bb39de", "timestamp": "2024-12-30T11:22:55.699Z" }, { "status": "failed", "cause": "Credenciales inválidas", "_id": "677297b9a18ab80b8b1d1df2", "timestamp": "2024-12-30T12:53:13.820Z" }, { "status": "success", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6IjY3NmZjZmVlYzkyYzQwN2FlZDJhNmRjMyIsImlhdCI6MTczNTU2MzIwOCwiZXhwIjoxNzM1NTc3NjA4fQ.vEM3CVIh7uzoOGpSIkrj0MEPTFvLz5XJKGunK5J3oYg", "_id": "677297c8a18ab80b8b1d1df9", "timestamp": "2024-12-30T12:53:28.165Z" }, { "status": "success", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6IjY3NmZjZmVlYzkyYzQwN2FlZDJhNmRjMyIsImlhdCI6MTczNTU2NTczNCwiZXhwIjoxNzM1NTgwMTM0fQ.W8opOiF86e1Z2rXewmk5UkFTppdt9gDkaPgDr-6QdPo", "_id": "6772a1a64c4afb5ddee31653", "timestamp": "2024-12-30T13:35:34.225Z" }, { "status": "success", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6IjY3NmZjZmVlYzkyYzQwN2FlZDJhNmRjMyIsImlhdCI6MTczNTU2NjI3OCwiZXhwIjoxNzM1NTgwNjc4fQ.cN6NuJJ7xhohc1qm9WgkIsRVzzUY9r5qXCYlfwWziqU", "_id": "6772a3c6489a9d1673378fa0", "timestamp": "2024-12-30T13:44:38.502Z" } ], "createdAt": "2024-12-28T10:16:14.964Z", "updatedAt": "2024-12-30T13:44:38.505Z", "__v": 7, "userLoginToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6IjY3NmZjZmVlYzkyYzQwN2FlZDJhNmRjMyIsImlhdCI6MTczNTU2NjI3OCwiZXhwIjoxNzM1NTgwNjc4fQ.cN6NuJJ7xhohc1qm9WgkIsRVzzUY9r5qXCYlfwWziqU" } }
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *             tyoe: object
 *             example: { "ok": false, "message": "No fue encontrado usuario para 676d3380ed95db8fa95d005d"}
 *       500:
 *         description: Error retrieving user
 *         content:
 *           application/json:
 *             schema:
 *             tyoe: object
 *             example: { "ok": false, "message": "No fue encontrado usuario, por favor contactar a soporte", "data": { "stringValue": "\"{ix}\"", "valueType": "string", "kind": "ObjectId", "value": "{ix}", "path": "_id", "reason": {}, "name": "CastError", "message": "Cast to ObjectId failed for value \"{ix}\" (type string) at path \"_id\" for model \"User\"" } }
 */

router.get('/user/:id', validateToken, User.getUserById)

module.exports = router

// router.get('/usertestemail/:id', User.testEmail);
