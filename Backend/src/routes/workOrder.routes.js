const express = require('express');
const workOrderController = require('../controllers/workOrder.controller');

const { validateToken } = require('../middlewares/validateToken')

const router = express.Router()


/**
 * @swagger
 * tags:
 *   name: WorkOrders
 *   description: Work order management
 */


// /**
//  * @swagger
//  * /workorder:
//  *   get:
//  *     summary: Retrieve a list of work orders
//  *     tags: [WorkOrders]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: A list of work orders
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/WorkOrder'
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Internal server error
//  */

router.get('/workorder', validateToken, workOrderController.getAllWorkOrders);

router.get('/workorder/:id', validateToken, workOrderController.getWorkOrderById);

/**
 * @swagger
 * /workorder:
 *   post:
 *     summary: Create a new work order
 *     tags: [WorkOrders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               example: { "workOrderSupervisor": "677d39bd712d5130b0187547", "clientId": "6773ecfe838a42945c65e06c", "workOrderDescription": "Instalacion de camaras en la entrada principal","serviceType": "Installation", "workOrderScheduledDate": "2025-01-08T10:00:00.000+00:00", "workOrderAssignedTechnician": "67600fc9e58d94d390d3e2f2" } 
 *     responses:
 *       201:
 *         description: Work order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": true, "message": "Work order created successfully", "data": { "workOrderSupervisor": "677d39bd712d5130b0187547", "clientId": "6773ecfe838a42945c65e06c", "workOrderDescription": "Instalacion de camaras en la entrada principal", "serviceType": "Installation", "workOrderStatus": "Assigned", "workOrderScheduledDate": "2025-01-08T10:00:00.000Z", "workOrderEstimatedDuration": 1, "workOrderAssignedTechnician": "67600fc9e58d94d390d3e2f2", "workOrderLocation": { "type": "Point", "coordinates": [ -58.3816, -34.6037 ] }, "_id": "677d54712bf6ad93286557e8", "createdAt": "2025-01-07T16:21:05.158Z", "updatedAt": "2025-01-07T16:21:05.158Z", "workOrderClientContactPerson": "Correcaminos", "workOrderclientEmail": "correcaminos@acme.com", "workOrderAddress": "Calle Falsa 123", "workOrderNumber": "0001-2025", "__v": 0 } }
 *       400:
 *         description: Bad request
  *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {"ok": false,"message": "The assigned technician has overlapping work orders."}
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *     security:
 *       - BearerAuth: []
 */
router.post('/workorder', validateToken, workOrderController.createWorkOrder);

router.put('/workorder/:id', validateToken, workOrderController.updateWorkOrder);

router.delete('/workorder/:id', validateToken, workOrderController.deleteWorkOrder);

router.get('/workorderbyclient/:id', validateToken, workOrderController.getAllWorkOrdersByClient);

// getAllWorkOrdersByTechnician,
router.get('/workorderreport/:id', validateToken, workOrderController.getReportWorkOrder);


/**
 * @swagger
 * /workorderupdatestatus/{id}:
 *   patch:
 *     summary: Update the status of a work order
 *     tags: [WorkOrders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The work order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               example: { "workOrderReasonRejection": "Falta evidencia de trabajo Nro. 2" }
 *     responses:
 *       200:
 *         description: Work order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { "ok": true, "message": "Work order status updated successfully" }
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Work order not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - BearerAuth: []
 */
router.patch('/workorderupdatestatus/:id', validateToken, workOrderController.updateWorkOrderStatus);

/**
 * @swagger
 * /workordersreject:
 *   get:
 *     summary: Retrieve a list of work orders with rejection
 *     tags: [WorkOrders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of work orders with rejection
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               example: [] 
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/workordersreject', validateToken, workOrderController.getAllWorkOrdersWithRejection);

/**
 * @swagger
 * /workorderstoapprove:
 *   get:
 *     summary: Retrieve a list of work orders pending approval
 *     tags: [WorkOrders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of work orders pending approval
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               example: []
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/workorderstoapprove', validateToken, workOrderController.getAllWorkOrdersPendingToApprove);

module.exports = router;