const express = require('express')

// permitir comunicarnos con el frontend
const router = express.Router()
const User = require('../controllers/user.controller')

const { validateToken } = require('../middlewares/validateToken')

// get all user records
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": true, "message": "Usuarios encontrados", "data": [ { "_id": "676fcfeec92c407aed2a6dc3", "userName": "APPGESTION_QA", "userEmail": "appgestion_qa@apoyarte.com", "userRole": "administrator", "userIsActive": true}]}
 *       404:
 *         description: No data exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {"ok":false, "message": "Usuarios no encontrados"}
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "Error interno del servidor" }
 *     security:
 *       - BearerAuth: []
 */

router.get('/user', validateToken, User.getAllUsers)

// get all technician records
/**
 * @swagger
 * /usertechnician:
 *   get:
 *     summary: Retrieve all technician
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users technician
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": true, "message": "Usuarios encontrados", "data": []}
 *       404:
 *         description: No data exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {"ok":false, "message": "Técnicos no encontrados"}
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "Error interno del servidor" }
 *     security:
 *       - BearerAuth: []
 */
router.get('/usertechnician', validateToken, User.getAllTechnician)


// get all supervisor records
/**
 * @swagger
 * /usersupervisor:
 *   get:
 *     summary: Retrieve all supervisor
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users supervisor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": true, "message": "Supervisores encontrados", "data": []}
 *       404:
 *         description: No data exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {"ok":false, "message": "Supervisores no encontrados"}
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "Error interno del servidor" }
 *     security:
 *       - BearerAuth: []
 */
router.get('/usersupervisor', validateToken, User.getAllSupervisor)

// create new user
/**
 * @swagger
 * /user:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               example: {}
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {   "ok": true,   "message": "Usuario creado exitosamente",   "data": { }}
 *       400:
 *         description: "Error: Bad Request"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "Error al obtener datos", "data":{ ... } } 
 *     security:
 *       - BearerAuth: []
 */
router.post('/user', validateToken, User.createUser)

// update user by id
/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *         example: 676fcfeec92c407aed2a6dc3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { "userAddress": "Other in, Othertown, USA" }
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             example: { "ok": true, "message": "usuario actualizado", "user": { } }
 *       400:
 *         description: User not found or no modifications detected
 *         content:
 *          application/json:
 *            schema:
 *             type: object
 *             example: { "ok": false, "message": "No fue posible modificar usuario, no se detectó modificaciones" }
 *       500:
 *         description: Error updating user
 *         content:
 *          application/json:
 *            schema:
 *             type: object
 *             example: { "ok": false, "message": "No fue posible modificar usuario, por favor contactar a soporte", "data": { "stringValue": "\"id\"", "valueType": "string", "kind": "ObjectId", "value": "id", "path": "_id", "reason": {}, "name": "CastError", "message": "Cast to ObjectId failed for value \"id\" (type string) at path \"_id\" for model \"User\"" } }
 */
router.patch('/user/:id', validateToken, User.updateUserById)

// delete user by id
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by ID
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
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             example: {}
 *       400:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             example: {}
 *       500:
 *         description: Error deleting user
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             example: {}
 */

router.delete('/user/:id', validateToken, User.deleteUserById)
 

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

// Revisar que exista usuario administrador
router.get('/usercheckadmin', User.hasAdministrator);


// Revisar que confirmen usuario
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
