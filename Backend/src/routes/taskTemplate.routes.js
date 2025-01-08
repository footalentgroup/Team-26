const express = require('express')

// permitir comunicarnos con el frontend
const router = express.Router()
const TaskTemplate = require('../controllers/taskTemplate.controller')

const { validateToken } = require('../middlewares/validateToken')

/**
 * @swagger
 * tags:
 *   name: TaskTemplates
 *   description: Task Template management
 */


// Register a new taskTemplate
/**
 * @swagger
 * /tasktemplate:
 *   post:
 *     summary: Register a new taskTemplate
 *     tags: [TaskTemplates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 ServiceType:
 *                   type: string
 *                   example: installation
 *                 taskTemplateDescription:
 *                   type: string
 *                   example: Planificación y Solicitud del Equipo
 *                 taskTemplateSuggestedEvidence:
 *                   type: string
 *                   example: Revisión de la solicitud del cliente
 *               example: { "serviceType": "installation", "taskTemplateDescription": "Planificación y Solicitud del Equipo", "taskTemplateSuggestedEvidence": "1. Revisión de la solicitud del cliente: - Confirmar los detalles de la solicitud (tipo de cámara, ubicación de instalación, características requeridas). - Determinar si se necesitan accesorios adicionales (cables, conectores, adaptadores, etc.).; 2. Solicitud al inventario: - Verificar la disponibilidad del equipo y accesorios necesarios en el inventario. - Registrar la solicitud del equipo en el sistema de control de inventario. - Recoger el equipo y verificar que esté en buen estado y completo.; 3. Preparación de herramientas y materiales: - Asegurarse de contar con las herramientas necesarias (taladro, destornilladores, tester, etc.). - Incluir materiales de instalación como soportes, tornillos y cinta aislante." } 
 *     responses:
 *       201:
 *         description: TaskTemplate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {   "ok": true,   "message": "Plantilla de tarea creado exitosamente",   "data": {     "serviceType": "correcaminos2@acme.com",     "taskTemplateCompanyName": "PRODUCTOS ACME",     "taskTemplateContactPerson": "Correcaminos",     "taskTemplatePhone": "5491123456789",     "taskTemplateSuggestedEvidence": "Calle Falsa 123",     "taskTemplateGeoLocation": {       "type": "Point",       "coordinates": [         -58.3816,         -34.6037       ]     },     "_id": "676d598951cf5bd85dd77d9a",     "createdAt": "2024-12-26T13:26:33.478Z",     "updatedAt": "2024-12-26T13:26:33.478Z",     "__v": 0   }}
 *       400:
 *         description: "Error: Bad Request"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "El serviceType del plantilla de tarea ya existe", "data": { "errorResponse": { "index": 0, "code": 11000, "errmessage": "E11000 duplicate key error collection: appgestion_dev.taskTemplates index: serviceType_1 dup key: { serviceType: \"installation\" }", "keyPattern": { "serviceType": 1 }, "keyValue": { "serviceType": "installation" } }, "index": 0, "code": 11000, "keyPattern": { "serviceType": 1 }, "keyValue": { "serviceType": "installation" } } }
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

router.post('/tasktemplate', validateToken, TaskTemplate.createTaskTemplate);

//modificar plantilla de tarea por el id
/**
//  * @swagger
//  * /tasktemplate/{id}:
//  *   patch:
//  *     summary: Update a taskTemplate by ID
//  *     tags: [TaskTemplates]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The taskTemplate ID
//  *         example: 676d3380ed95db8fa95d006d
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             example: { "taskTemplateSuggestedEvidence": "Other in, Othertown, USA" }
//  *     responses:
//  *       200:
//  *         description: TaskTemplate updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *             type: object
//  *             example: { "ok": true, "message": "plantilla de tarea actualizado", "taskTemplate": { "taskTemplateGeoLocation": { "type": "Point", "coordinates": [ -58.3816, -34.6037 ] }, "_id": "676d3380ed95db8fa95d006d", "serviceType": "installation", "taskTemplateCompanyName": "PRODUCTOS ACME", "taskTemplateContactPerson": "Correcaminos", "taskTemplatePhone": "5491123456789", "taskTemplateSuggestedEvidence": "Other in, Othertown, USA", "createdAt": "2024-12-26T10:44:16.967Z", "updatedAt": "2024-12-27T11:08:37.693Z", "__v": 0 } }
//  *       400:
//  *         description: TaskTemplate not found or no modifications detected
//  *         content:
//  *          application/json:
//  *            schema:
//  *             type: object
//  *             example: { "ok": false, "message": "No fue posible modificar plantilla de tarea, no se detectó modificaciones" }
//  *       500:
//  *         description: Error updating taskTemplate
//  *         content:
//  *          application/json:
//  *            schema:
//  *             type: object
//  *             example: { "ok": false, "message": "No fue posible modificar plantilla de tarea, por favor contactar a soporte", "data": { "stringValue": "\"id\"", "valueType": "string", "kind": "ObjectId", "value": "id", "path": "_id", "reason": {}, "name": "CastError", "message": "Cast to ObjectId failed for value \"id\" (type string) at path \"_id\" for model \"TaskTemplate\"" } }
//  */

router.patch('/tasktemplate/:id', validateToken, TaskTemplate.updateTaskTemplateById)

// Buscar plantilla de tarea por el id
/**
 * @swagger
 * /tasktemplate/{id}:
 *   get:
 *     summary: Retrieve a taskTemplate by ID
 *     tags: [TaskTemplates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The taskTemplate ID
 *         example: 676d3380ed95db8fa95d006d
 *     responses:
 *       200:
 *         description: TaskTemplate found
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             example: { "ok": true, "message": "Encontrado plantilla de tarea", "data": { "taskTemplateGeoLocation": { "type": "Point", "coordinates": [ -58.3816, -34.6037 ] }, "_id": "676d3380ed95db8fa95d006d", "serviceType": "installation", "taskTemplateCompanyName": "PRODUCTOS ACME", "taskTemplateContactPerson": "Correcaminos", "taskTemplatePhone": "5491123456789", "taskTemplateSuggestedEvidence": "Other in, Othertown, USA", "createdAt": "2024-12-26T10:44:16.967Z", "updatedAt": "2024-12-27T11:17:20.364Z", "__v": 0 } }
 *       404:
 *         description: TaskTemplate not found
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             example: { "ok": false, "message": "No fue encontrado plantilla de tarea para 676d3380ed95db8fa95d005d"}
 *       500:
 *         description: Error retrieving taskTemplate
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             example: { "ok": false, "message": "No fue encontrado plantilla de tarea, por favor contactar a soporte", "data": { "stringValue": "\"{ix}\"", "valueType": "string", "kind": "ObjectId", "value": "{ix}", "path": "_id", "reason": {}, "name": "CastError", "message": "Cast to ObjectId failed for value \"{ix}\" (type string) at path \"_id\" for model \"TaskTemplate\"" } }
 */

router.get('/tasktemplate/:id', validateToken, TaskTemplate.getTaskTemplateById)

// Buscar plantilla de tarea por el serviceType
/**
 * @swagger
 * /tasktemplatebyservicetype:
 *   get:
 *     summary: Retrieve a taskTemplate by serviceType
 *     tags: [TaskTemplates]
 *     parameters:
 *       - in: query
 *         name: serviceType
 *         schema:
 *           type: string
 *         required: true
 *         description: The taskTemplate serviceType
 *         example: installation
 *     responses:
 *       200:
 *         description: TaskTemplate found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": true, "message": "Encontrado plantilla de tarea", "data": { "taskTemplateGeoLocation": { "type": "Point", "coordinates": [ -58.3816, -34.6037 ] }, "_id": "676d3380ed95db8fa95d006d", "serviceType": "installation", "taskTemplateCompanyName": "PRODUCTOS ACME", "taskTemplateContactPerson": "Correcaminos", "taskTemplatePhone": "5491123456789", "taskTemplateSuggestedEvidence": "Other in, Othertown, USA", "createdAt": "2024-12-26T10:44:16.967Z", "updatedAt": "2024-12-27T11:17:20.364Z", "__v": 0 } }
 *       404:
 *         description: TaskTemplate not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "No fue encontrado plantilla de tarea para installation.co"}
 *       500:
 *         description: Error retrieving taskTemplate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": false, "message": "No fue encontrado plantilla de tarea, por favor contactar a soporte", "data": { "stringValue": "\"byserviceType\"", "valueType": "string", "kind": "ObjectId", "value": "byserviceType", "path": "_id", "reason": {}, "name": "CastError", "message": "Cast to ObjectId failed for value \"byserviceType\" (type string) at path \"_id\" for model \"TaskTemplate\"" } }
 */

router.get('/tasktemplatebyservicetype', validateToken, TaskTemplate.getTaskTemplateByServiceType)

// Buscar plantilla de tarea por un texto en general
/**
 * @swagger
 * /tasktemplatesearch:
 *   get:
 *     summary: Search taskTemplates
 *     tags: [TaskTemplates]
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
 *         description: TaskTemplates found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": true, "message": "Plantilla de tareas encontrados", "data": [ { "_id": "676d3380ed95db8fa95d006d", "serviceType": "installation", "taskTemplateCompanyName": "PRODUCTOS ACME", "taskTemplateContactPerson": "Correcaminos", "taskTemplatePhone": "5491123456789", "taskTemplateSuggestedEvidence": "Other in, Othertown, USA", "taskTemplateGeoLocation": { "type": "Point", "coordinates": [ -58.3816, -34.6037 ] }, "createdAt": "2024-12-26T10:44:16.967Z", "updatedAt": "2024-12-27T11:17:20.364Z", "__v": 0 }, { "_id": "676d598951cf5bd85dd77d9a", "serviceType": "correcaminos2@acme.com", "taskTemplateCompanyName": "PRODUCTOS ACME", "taskTemplateContactPerson": "Correcaminos", "taskTemplatePhone": "5491123456789", "taskTemplateSuggestedEvidence": "Calle Falsa 123", "taskTemplateGeoLocation": { "type": "Point", "coordinates": [ -58.3816, -34.6037 ] }, "createdAt": "2024-12-26T13:26:33.478Z", "updatedAt": "2024-12-26T13:26:33.478Z", "__v": 0 } ] }
 *       404:
 *         description: No taskTemplates found
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             example: {"ok": false, "message": "No se encontraron plantillas de tarea."}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             example: { "ok": false, "message": "No fue encontrado plantilla de tarea, por favor contactar a soporte", "data": { "stringValue": "\"search\"", "valueType": "string", "kind": "ObjectId", "value": "search", "path": "_id", "reason": {}, "name": "CastError", "message": "Cast to ObjectId failed for value \"search\" (type string) at path \"_id\" for model \"TaskTemplate\"" } }
 */

router.get('/tasktemplatesearch',  validateToken, TaskTemplate.searchTaskTemplates)

//Borrar plantilla de tarea por el id
/**
 * @swagger
 * /tasktemplate/{id}:
 *   delete:
 *     summary: Delete a taskTemplate by ID
 *     tags: [TaskTemplates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The taskTemplate ID
 *         example: 676d3380ed95db8fa95d006d
 *     responses:
 *       200:
 *         description: TaskTemplate deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             example: {}
 *       400:
 *         description: TaskTemplate not found
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             example: {}
 *       500:
 *         description: Error deleting taskTemplate
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             example: {}
 */

router.delete('/tasktemplate/:id', validateToken, TaskTemplate.deleteTaskTemplateById)

// traer todos los taskTemplate
/**
 * @swagger
 * /tasktemplate:
 *   get:
 *     summary: Retrieve a list of taskTemplates
 *     tags: [TaskTemplates]
 *     responses:
 *       200:
 *         description: A list of taskTemplates
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
 *                   example: TaskTemplates retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       serviceType:
 *                         type: string
 *                         example: installation
 *                       taskTemplateCompanyName:
 *                         type: string
 *                         example: Productos ACME
 *                       taskTemplateContactPerson:
 *                         type: string
 *                         example: Correcaminos
 *                       taskTemplatePhone:
 *                         type: string
 *                         example: +5491123456789
 *                       taskTemplateSuggestedEvidence:
 *                         type: string
 *                         example: Calle Falsa 123
 *                       taskTemplateGeoLocation:
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
 *                   example: No se encontraron plantillas de tarea 
 *       500:
 *         description: Error retrieving taskTemplates
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
 *                   example: Error al obtener plantillas de tarea 
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: There is an error in the catch(error)
*/

router.get('/tasktemplate', validateToken, TaskTemplate.getAllTaskTemplates);

module.exports = router

