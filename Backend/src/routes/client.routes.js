const express = require('express')

// permitir comunicarnos con el frontend
const router = express.Router()
const Client = require('../controllers/client.controller')

const { validateToken } = require('../middlewares/validateToken')

// Register a new client
/**
 * @swagger
 * /client:
 *   post:
 *     summary: Register a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 clientEmail:
 *                   type: string
 *                   example: correcaminos@acme.com
 *                 clientCompanyName:
 *                   type: string
 *                   example: Productos ACME
 *                 clientContactPerson:
 *                   type: string
 *                   example: Correcaminos
 *                 clientPhone:
 *                   type: string
 *                   example: +5491123456789
 *                 clientAddress:
 *                   type: string
 *                   example: Calle Falsa 123
 *                 clientGeoLocation:
 *                   type: object
 *                   properties:
 *                    type:
 *                      type: string
 *                      example: Point
 *                    coordinates:
 *                      type: array
 *                      items:
 *                        type: number
 *                      example: [-58.3816, -34.6037]
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {   "ok": true,   "message": "Cliente creado exitosamente",   "data": {     "clientEmail": "correcaminos2@acme.com",     "clientCompanyName": "PRODUCTOS ACME",     "clientContactPerson": "Correcaminos",     "clientPhone": "5491123456789",     "clientAddress": "Calle Falsa 123",     "clientGeoLocation": {       "type": "Point",       "coordinates": [         -58.3816,         -34.6037       ]     },     "_id": "676d598951cf5bd85dd77d9a",     "createdAt": "2024-12-26T13:26:33.478Z",     "updatedAt": "2024-12-26T13:26:33.478Z",     "__v": 0   }}
 *       400:
 *         description: "Error: Bad Request"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "El email del cliente ya existe", "data": { "errorResponse": { "index": 0, "code": 11000, "errmessage": "E11000 duplicate key error collection: appgestion_dev.clients index: clientEmail_1 dup key: { clientEmail: \"correcaminos@acme.com\" }", "keyPattern": { "clientEmail": 1 }, "keyValue": { "clientEmail": "correcaminos@acme.com" } }, "index": 0, "code": 11000, "keyPattern": { "clientEmail": 1 }, "keyValue": { "clientEmail": "correcaminos@acme.com" } } }
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

router.post('/client', validateToken, Client.createClient);

//modificar cliente por el id
/**
 * @swagger
 * /client/{id}:
 *   patch:
 *     summary: Update a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client ID
 *         example: 676d3380ed95db8fa95d006d
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             tyoe: object
 *             example: { "clientAddress": "Other in, Othertown, USA" }
 *     responses:
 *       200:
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *             tyoe: object
 *             example: { "ok": true, "message": "cliente actualizado", "client": { "clientGeoLocation": { "type": "Point", "coordinates": [ -58.3816, -34.6037 ] }, "_id": "676d3380ed95db8fa95d006d", "clientEmail": "correcaminos@acme.com", "clientCompanyName": "PRODUCTOS ACME", "clientContactPerson": "Correcaminos", "clientPhone": "5491123456789", "clientAddress": "Other in, Othertown, USA", "createdAt": "2024-12-26T10:44:16.967Z", "updatedAt": "2024-12-27T11:08:37.693Z", "__v": 0 } }
 *       400:
 *         description: Client not found or no modifications detected
 *         content:
 *          application/json:
 *            schema:
 *             type: object
 *             example: { "ok": false, "message": "No fue posible modificar cliente, no se detectó modificaciones" }
 *       500:
 *         description: Error updating client
 *         content:
 *          application/json:
 *            schema:
 *             type: object
 *             example: { "ok": false, "message": "No fue posible modificar cliente, por favor contactar a soporte", "data": { "stringValue": "\"id\"", "valueType": "string", "kind": "ObjectId", "value": "id", "path": "_id", "reason": {}, "name": "CastError", "message": "Cast to ObjectId failed for value \"id\" (type string) at path \"_id\" for model \"Client\"" } }
 */

router.patch('/client/:id', validateToken, Client.updateClientById)

// Buscar cliente por el id
/**
 * @swagger
 * /client/{id}:
 *   get:
 *     summary: Retrieve a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client ID
 *         example: 676d3380ed95db8fa95d006d
 *     responses:
 *       200:
 *         description: Client found
 *         content:
 *           application/json:
 *             schema:
 *             tyoe: object
 *             example: { "ok": true, "message": "Encontrado cliente", "data": { "clientGeoLocation": { "type": "Point", "coordinates": [ -58.3816, -34.6037 ] }, "_id": "676d3380ed95db8fa95d006d", "clientEmail": "correcaminos@acme.com", "clientCompanyName": "PRODUCTOS ACME", "clientContactPerson": "Correcaminos", "clientPhone": "5491123456789", "clientAddress": "Other in, Othertown, USA", "createdAt": "2024-12-26T10:44:16.967Z", "updatedAt": "2024-12-27T11:17:20.364Z", "__v": 0 } }
 *       404:
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *             tyoe: object
 *             example: { "ok": false, "message": "No fue encontrado cliente para 676d3380ed95db8fa95d005d"}
 *       500:
 *         description: Error retrieving client
 *         content:
 *           application/json:
 *             schema:
 *             tyoe: object
 *             example: { "ok": false, "message": "No fue encontrado cliente, por favor contactar a soporte", "data": { "stringValue": "\"{ix}\"", "valueType": "string", "kind": "ObjectId", "value": "{ix}", "path": "_id", "reason": {}, "name": "CastError", "message": "Cast to ObjectId failed for value \"{ix}\" (type string) at path \"_id\" for model \"Client\"" } }
 */

router.get('/client/:id', validateToken, Client.getClientById)

// Buscar cliente por el email
/**
 * @swagger
 * /clientbyemail:
 *   get:
 *     summary: Retrieve a client by email
 *     tags: [Clients]
 *     parameters:
 *       - in: query
 *         name: clientEmail
 *         schema:
 *           type: string
 *         required: true
 *         description: The client email
 *         example: correcaminos@acme.com
 *     responses:
 *       200:
 *         description: Client found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": true, "message": "Encontrado cliente", "data": { "clientGeoLocation": { "type": "Point", "coordinates": [ -58.3816, -34.6037 ] }, "_id": "676d3380ed95db8fa95d006d", "clientEmail": "correcaminos@acme.com", "clientCompanyName": "PRODUCTOS ACME", "clientContactPerson": "Correcaminos", "clientPhone": "5491123456789", "clientAddress": "Other in, Othertown, USA", "createdAt": "2024-12-26T10:44:16.967Z", "updatedAt": "2024-12-27T11:17:20.364Z", "__v": 0 } }
 *       404:
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "No fue encontrado cliente para correcaminos@acme.com.co"}
 *       500:
 *         description: Error retrieving client
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "No fue encontrado cliente, por favor contactar a soporte", "data": { "stringValue": "\"byemail\"", "valueType": "string", "kind": "ObjectId", "value": "byemail", "path": "_id", "reason": {}, "name": "CastError", "message": "Cast to ObjectId failed for value \"byemail\" (type string) at path \"_id\" for model \"Client\"" } }
 */

router.get('/clientbyemail', validateToken, Client.getClientByEmail)

// Buscar cliente por un texto en general
/**
 * @swagger
 * /clientsearch:
 *   get:
 *     summary: Search clients
 *     tags: [Clients]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *         example: in
 *     responses:
 *       200:
 *         description: Clients found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": true, "message": "Clientes encontrados", "data": [ { "_id": "676d3380ed95db8fa95d006d", "clientEmail": "correcaminos@acme.com", "clientCompanyName": "PRODUCTOS ACME", "clientContactPerson": "Correcaminos", "clientPhone": "5491123456789", "clientAddress": "Other in, Othertown, USA", "clientGeoLocation": { "type": "Point", "coordinates": [ -58.3816, -34.6037 ] }, "createdAt": "2024-12-26T10:44:16.967Z", "updatedAt": "2024-12-27T11:17:20.364Z", "__v": 0 }, { "_id": "676d598951cf5bd85dd77d9a", "clientEmail": "correcaminos2@acme.com", "clientCompanyName": "PRODUCTOS ACME", "clientContactPerson": "Correcaminos", "clientPhone": "5491123456789", "clientAddress": "Calle Falsa 123", "clientGeoLocation": { "type": "Point", "coordinates": [ -58.3816, -34.6037 ] }, "createdAt": "2024-12-26T13:26:33.478Z", "updatedAt": "2024-12-26T13:26:33.478Z", "__v": 0 } ] }
 *       404:
 *         description: No clients found
 *         content:
 *           application/json:
 *             schema:
 *             tyoe: object
 *             example: {"ok": false, "message": "No se encontraron clientes."}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *             tyoe: object
 *             example: { "ok": false, "message": "No fue encontrado cliente, por favor contactar a soporte", "data": { "stringValue": "\"search\"", "valueType": "string", "kind": "ObjectId", "value": "search", "path": "_id", "reason": {}, "name": "CastError", "message": "Cast to ObjectId failed for value \"search\" (type string) at path \"_id\" for model \"Client\"" } }
 */

router.get('/clientsearch',  validateToken, Client.searchClients)

//Borrar cliente por el id
/**
 * @swagger
 * /client/{id}:
 *   delete:
 *     summary: Delete a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client ID
 *         example: 676d3380ed95db8fa95d006d
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *             tyoe: object
 *             example: {}
 *       500:
 *         description: Error deleting client
 *         content:
 *           application/json:
 *             schema:
 *             tyoe: object
 *             example: {}
 */

router.delete('/client/:id', validateToken, Client.deleteClientById)

// traer todos los client
/**
 * @swagger
 * /client:
 *   get:
 *     summary: Retrieve a list of clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: A list of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Clients retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       clientEmail:
 *                         type: string
 *                         example: correcaminos@acme.com
 *                       clientCompanyName:
 *                         type: string
 *                         example: Productos ACME
 *                       clientContactPerson:
 *                         type: string
 *                         example: Correcaminos
 *                       clientPhone:
 *                         type: string
 *                         example: +5491123456789
 *                       clientAddress:
 *                         type: string
 *                         example: Calle Falsa 123
 *                       clientGeoLocation:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: Point
 *                           coordinates:
 *                             type: array
 *                             items:
 *                               type: number
 *                             example: [-58.3816, -34.6037]
 *       404:
 *         description: No data exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No se encontraron clientes 
 *       500:
 *         description: Error retrieving clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error al obtener clientes 
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: There is an error in the catch(error)
*/

router.get('/client', validateToken, Client.getAllClients);

module.exports = router

