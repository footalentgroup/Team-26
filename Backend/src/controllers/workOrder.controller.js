const WorkOrder = require('../models/WorkOrder');
const WorkOrderTask = require('../models/WorkOrderTask');
const TaskEvidence = require('../models/TaskEvidence');
const User = require('../models/User');
const mail = require('./mail.controller'); // Para enviar correos electrónicos
const AuditLogController = require('../controllers/auditLog.controller'); // Controlador de auditoría
const jwt = require('jsonwebtoken');

// Get all work orders
const getAllWorkOrders = async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret);
    const userDataToken = await User.findById(decoded.userData);
    const validRoles = ['supervisor', 'technician'];
    if (!validRoles.includes(userDataToken.userRole)) {
        return res.status(400).json({
            ok: false,
            error: 'El rol debe ser supervisor o técnico'
        });
    }

    try {
        if (userDataToken.userRole === 'supervisor') {
            const workOrders = await WorkOrder.find({ workOrderSupervisor: userDataToken._id });
            return res.status(200).json(
                { ok: true, message: 'Ordenes de trabajo encontradas', data: workOrders }
            );
        }
        if (userDataToken.userRole === 'technician') {
            const workOrders = await WorkOrder.find({ workOrderAssignedTechnician: userDataToken._id });
            return res.status(200).json(
                { ok: true, message: 'Ordenes de trabajo encontradas', data: workOrders }
            );
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single work order by ID
const getWorkOrderById = async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret);
    const userDataToken = await User.findById(decoded.userData);
    const validRoles = ['supervisor', 'technician'];
    if (!validRoles.includes(userDataToken.userRole)) {
        return res.status(400).json({
            ok: false,
            error: 'El rol debe ser supervisor o técnico'
        });
    }
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
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret);
    const userDataToken = await User.findById(decoded.userData);
    const validRoles = ['supervisor'];
    if (!validRoles.includes(userDataToken.userRole)) {
        return res.status(400).json({
            ok: false,
            error: 'El rol debe ser supervisor'
        });
    }
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
            const reqMail = { token : token, functionalitySendMail: 'createWorkOrder', documentId: newWorkOrder._id, emailData : emailData };
            const result = await mail.sendEmail(reqMail);
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
        const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(req.params.id, req.body);
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
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret);
    const userDataToken = await User.findById(decoded.userData);
    const validRoles = ['supervisor'];
    if (!validRoles.includes(userDataToken.userRole)) {
        return res.status(400).json({
            ok: false,
            error: 'El rol debe ser supervisor'
        });
    }
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
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret);
    const userDataToken = await User.findById(decoded.userData);
    const validRoles = ['supervisor'];
    if (!validRoles.includes(userDataToken.userRole)) {
        return res.status(400).json({
            ok: false,
            error: 'El rol debe ser supervisor'
        });
    }
    try {
        const workOrders = await WorkOrder.find({ clientId: req.params.clientId });
        res.status(200).json(workOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all work orders by technician ID
const getAllWorkOrdersByTechnician = async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret);
    const userDataToken = await User.findById(decoded.userData);
    const validRoles = ['supervisor', 'technician'];
    if (!validRoles.includes(userDataToken.userRole)) {
        return res.status(400).json({
            ok: false,
            error: 'El rol debe ser supervisor o técnico'
        });
    }
    if (userDataToken.userRole === 'technician' && userDataToken._id !== req.params.technicianId) {
        return res.status(400).json({
            ok: false,
            error: 'El técnico no tiene asignada esta orden de trabajo'
        });
    }
    try {
        const workOrders = await WorkOrder.find({ workOrderAssignedTechnician: req.params.technicianId });
        res.status(200).json(workOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get work order with tasks and task evidences
const getReportWorkOrder = async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret);
    const userDataToken = await User.findById(decoded.userData);
    const validRoles = ['supervisor', 'technician'];
    if (!validRoles.includes(userDataToken.userRole)) {
        return res.status(400).json({
            ok: false,
            error: 'El rol debe ser supervisor o técnico'
        });
    }
    try {
        const workOrder = await WorkOrder.findById(req.params.id);
        if (!workOrder) {
            return res.status(404).json({ message: 'WorkOrder not found' });
        }
        if (userDataToken.userRole === 'technician' && userDataToken._id !== workOrder.workOrderAssignedTechnician) {
            return res.status(400).json({
                ok: false,
                error: 'El técnico no tiene asignada esta orden de trabajo'
            });
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


// Update a workOrder by id
const updateWorkOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { workOrderStatus, workOrderReasonRejection } = req.body;
    let hasChanges = false;
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        const secret = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secret);
        const userDataToken = await User.findById(decoded.userData);
        const validRoles = ['supervisor', 'technician'];
        if (!validRoles.includes(userDataToken.userRole)) {
            return res.status(400).json({
                ok: false,
                error: 'El rol debe ser supervisor o técnico'
            });
        }

        const updateDataById = {};
        const changes = {};
        const originalData = await WorkOrder.findById(id).lean();
        if (!originalData)
            return res.status(400).json({
                ok: false,
                message: 'No se encontró ningún Orden de trabajo con el id proporcionado'
            })
        if (originalData) {
            if (workOrderStatus) {
                if (userDataToken.userRole === 'technician') {
                    if (originalData.workOrderAssignedTechnician !== userDataToken._id)
                        return res.status(400).json({
                            ok: false,
                            error: 'El técnico no tiene asignada esta orden de trabajo'
                        });
                    const validStatus = ['Assigned', 'In Progress', 'Under Review'];
                    if (!validStatus.includes(workOrderStatus)) {
                        return res.status(400).json({
                            ok: false,
                            error: 'El estado debe ser Asignado, En progreso o En revisión'
                        });
                    }
                    updateDataById.workOrderStatus = workOrderStatus;
                    if (originalData.workOrderReasonRejection)
                        updateDataById.workOrderReasonRejection = null;
                }
                if (userDataToken.userRole === 'supervisor') {
                    const validStatus = ['Unassigned', 'Assigned', 'Approved'];
                    if (!validStatus.includes(workOrderStatus)) {
                        return res.status(400).json({
                            ok: false,
                            error: 'El estado debe ser Sin asignar, Asignado o Aprobado'
                        });
                    }
                    updateDataById.workOrderStatus = workOrderStatus;
                }
            }
            if (workOrderReasonRejection && userDataToken.userRole === 'supervisor')
                updateDataById.workOrderReasonRejection = workOrderReasonRejection;
            if (userDataToken.userRole === 'supervisor' && workOrderStatus === 'Approved' && originalData.workOrderReasonRejection) {
                updateDataById.workOrderReasonRejection = null;
                // Identify changes
                for (let key in updateDataById) {
                    if (originalData[key] !== updateDataById[key]) {
                        hasChanges = true;
                        changes[key] = { old: originalData[key], new: updateDataById[key] }
                        console.log('changes', changes);
                    }
                }
            }

            if (!hasChanges)
                return res.status(400).json({
                    ok: false,
                    message: 'No se detectaron cambios, no se puede actualizar el Orden de trabajo'
                })
            const workOrder = await WorkOrder.findByIdAndUpdate(id, updateDataById)
            if (!workOrder)
                return res.status(400).json({
                    ok: false,
                    message: 'No se puede actualizar el Orden de trabajo, no encontrado o no se detectaron cambios'
                })
            // Register in audit_logs (req, action, documentId, changes) 
            await registerAuditLog(req, 'UPDATE', id, { updateRecord: changes });

            return res.status(200).json({
                ok: true,
                message: 'Estado Orden de trabajo actualizado',
                data: workOrder
            })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No se puede actualizar el Orden de trabajo, por favor contacte al soporte',
            data: error
        })
    }
}

// Get all work orders under review with rejection reason for a technician
const getAllWorkOrdersWithRejection = async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret);
    const userDataToken = await User.findById(decoded.userData);
    const validRoles = ['technician'];
    if (!validRoles.includes(userDataToken.userRole)) {
        return res.status(400).json({
            ok: false,
            error: 'El rol debe ser técnico'
        });
    }
    try {
        const workOrders = await WorkOrder.find({
            workOrderAssignedTechnician: userDataToken._id,
            workOrderReasonRejection: { $exists: true, $ne: null }
        });
        res.status(200).json(
            { ok: true, message: 'Reporte de Ordenes de trabajo rechazados', data: workOrders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all pending work orders to be approved by supervisor
const getAllWorkOrdersPendingToApprove = async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret);
    const userDataToken = await User.findById(decoded.userData);
    const validRoles = ['supervisor'];
    if (!validRoles.includes(userDataToken.userRole)) {
        return res.status(400).json({
            ok: false,
            error: 'El rol debe ser supervisor'
        });
    }
    try {
        const workOrders = await WorkOrder.find({
            workOrderSupervisor: userDataToken._id,
            workOrderStatus: 'Under Review',
            workOrderReasonRejection: null
        });
        res.status(200).json(
            { ok: true, message: 'Ordenes de trabajo pendientes de aprobación encontradas', data: workOrders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllWorkOrders,
    getWorkOrderById,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    getAllWorkOrdersByClient,
    getAllWorkOrdersByTechnician,
    getReportWorkOrder,
    updateWorkOrderStatus,
    getAllWorkOrdersWithRejection,
    getAllWorkOrdersPendingToApprove
};
