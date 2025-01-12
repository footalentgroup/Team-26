const WorkOrder = require('../models/WorkOrder');
const WorkOrderTask = require('../models/WorkOrderTask');
const TaskEvidence = require('../models/TaskEvidence');
const User = require('../models/User');
const mail = require('./mail.controller'); // Para enviar correos electrónicos
const AuditLogController = require('../controllers/auditLog.controller'); // Controlador de auditoría
const jwt = require('jsonwebtoken');

// Get all work orders
const getAllWorkOrders = async (req, res) => {
    try {
        const workOrders = await WorkOrder.find();
        res.status(200).json(workOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single work order by ID
const getWorkOrderById = async (req, res) => {
    try {
        const workOrder = await WorkOrder.findById(req.params.id);
        if (!workOrder) {
            return res.status(404).json({ message: 'WorkOrder not found' });
        }
        res.status(200).json(workOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new work order
const createWorkOrder = async (req, res) => {
    const workOrder = req.body;
    console.log('createWorkOrder ', req.body, workOrder);
    try {
        if (!workOrder) {
            return res.status(400).json({
                ok: false,
                message: "Se requiere un body con la estructura correcta para crear una orden de trabajo",
                data: workOrder
            });
        }
        // const { workOrderSupervisor, clientId, workOrderDescription, serviceType, workOrderScheduledDate, workOrderAssignedTechnician} = ;
        const newWorkOrder = new WorkOrder(workOrder);
        await newWorkOrder.save();
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'CREATE', newWorkOrder._id, { newdRecord: newWorkOrder.toObject() });
        const AssignedTechnician = await User.findById(newWorkOrder.workOrderAssignedTechnician);
        if (AssignedTechnician) {
            const emailData = {
                to: AssignedTechnician.userEmail,
                subject: `Nueva Orden de Trabajo Asignada: ${newWorkOrder.workOrderNumber}`,
                text: `Por favor gestionar la orden de trabajo asignada ${newWorkOrder.workOrderDescription}; Tipo de servicio: ${newWorkOrder.serviceType}; Fecha programada: ${newWorkOrder.workOrderScheduledDate}; Duración estimada: ${newWorkOrder.workOrderEstimatedDuration} horas; Dirección de la orden de trabajo: ${newWorkOrder.workOrderAddress}; Geolocalizacion: ${newWorkOrder.workOrderLocation}

                Datos del cliente: email ${newWorkOrder.workOrderclientEmail}; persona de contacto ${newWorkOrder.workOrderClientContactPerson}; teléfono de contacto ${newWorkOrder.workOrderClientPhone}`,
                html: `<p>Por favor gestionar la orden de trabajo asignada ${newWorkOrder.workOrderDescription}; Tipo de servicio: ${newWorkOrder.serviceType}; Fecha programada: ${newWorkOrder.workOrderScheduledDate}; Duración estimada: ${newWorkOrder.workOrderEstimatedDuration} horas; Dirección de la orden de trabajo: ${newWorkOrder.workOrderAddress}; Geolocalizacion: ${newWorkOrder.workOrderLocation}</p><br><p>Datos del cliente: email ${newWorkOrder.workOrderclientEmail}; persona de contacto ${newWorkOrder.workOrderClientContactPerson}; teléfono de contacto ${newWorkOrder.workOrderClientPhone}</p>`
            }
            // Reutilizar la función de envío de correos
            const result = await mail.sendEmail(req, 'createWorkOrder', newWorkOrder._id, emailData);
            console.log('result sendMail', result);
            if (!result.success) {
                return res.status(201).json({ ok: true, message: 'Orden de trabajo creada exitosamente. No fue posible enviar correo al tecnico asignado.', data: newWorkOrder });
            } else {

                return res.status(201).json({ ok: true, message: 'Orden de trabajo creada exitosamente y enviado correo al técnico asignado.', data: newWorkOrder });
            }
        }
        return res.status(201).json({ ok: true, message: 'Orden de trabajo creada exitosamente. No fue posible enviar correo al tecnico asignado.', data: newWorkOrder });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: error.message
        });
    }
};

// Update an existing work order
const updateWorkOrder = async (req, res) => {
    try {
        const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedWorkOrder) {
            return res.status(404).json({ message: 'WorkOrder not found' });
        }
        res.status(200).json(updatedWorkOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a work order
const deleteWorkOrder = async (req, res) => {
    try {
        const deletedWorkOrder = await WorkOrder.findByIdAndDelete(req.params.id);
        if (!deletedWorkOrder) {
            return res.status(404).json({ message: 'WorkOrder not found' });
        }
        res.status(200).json({ message: 'WorkOrder deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all work orders by client ID
const getAllWorkOrdersByClient = async (req, res) => {
    try {
        const workOrders = await WorkOrder.find({ clientId: req.params.clientId });
        res.status(200).json(workOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all work orders by technician ID
const getAllWorkOrdersByTechnician = async (req, res) => {
    try {
        const workOrders = await WorkOrder.find({ workOrderAssignedTechnician: req.params.technicianId });
        res.status(200).json(workOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get work order with tasks and task evidences
const getReportWorkOrder = async (req, res) => {
    try {
        const workOrder = await WorkOrder.findById(req.params.id);
        if (!workOrder) {
            return res.status(404).json({ message: 'WorkOrder not found' });
        }

        const tasks = await WorkOrderTask.find({ workOrderId: req.params.id });
        const tasksWithEvidences = await Promise.all(tasks.map(async (task) => {
            const evidences = await TaskEvidence.find({ workOrderTaskId: task._id });
            return { ...task._doc, evidences };
        }));

        res.status(200).json({ ...workOrder._doc, tasks: tasksWithEvidences });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const registerAuditLog = async (req, action, documentId, changes) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    let auditLogUser = 'anonymous';
    if (token) {
        const decoded = jwt.verify(token, secret);
        auditLogUser = decoded.userData
    }
    if (!token && documentId) {
        auditLogUser = documentId
    }
    const auditLogData = {
        auditLogUser: auditLogUser,                             // User who performed the action (can be null)
        auditLogAction: action,                                 // Action performed e.g., "CREATE", "UPDATE", "DELETE"
        auditLogModel: 'WorkOrder',                                  // Affected model, e.g., "User"
        auditLogDocumentId: documentId,                         // ID of the affected document (can be null)
        auditLogChanges: changes                                // Changes made or additional information (not mandatory)
    }
    await AuditLogController.createAuditLog(auditLogData);
};

module.exports = {
    getAllWorkOrders,
    getWorkOrderById,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    getAllWorkOrdersByClient,
    getAllWorkOrdersByTechnician,
    getReportWorkOrder
};


