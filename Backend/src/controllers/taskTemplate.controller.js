const jwt = require('jsonwebtoken')
const TaskTemplate = require("../models/TaskTemplate");
const AuditLogController = require('../controllers/auditLog.controller'); // Audit controller

// Get all taskTemplate records
const getAllTaskTemplates = async (req, res) => {
    try {
        const taskTemplates = await TaskTemplate.find()
        if (!taskTemplates || taskTemplates.length === 0) return res.status(404).json({ ok: false, message: 'No se encontraron plantillas de Tarea' });
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'REAd', null, { actionDetails: 'get all taskTemplates' });

        return res.status(200).json({
            ok: true,
            message: 'Plantilla de Tareas encontradas',
            data: taskTemplates
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al recuperar plantillas de Tarea',
            data: error
        })
    }
}

// Create a taskTemplate
const createTaskTemplate = async (req, res) => {
    try {
        const nuevoTaskTemplate = new TaskTemplate(req.body);
        await nuevoTaskTemplate.save();
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'CREATE', nuevoTaskTemplate._id, { newdRecord: nuevoTaskTemplate.toObject() });

        return res.status(201).json({ ok: true, message: 'Plantilla de Tarea creado con éxito', data: nuevoTaskTemplate });
    } catch (error) {
            res.status(500).json({
                ok: false,
                message: 'Error al crear plantilla de tarea',
                data: error
            });
    }
}

// Update a taskTemplate by id
const updateTaskTemplateById = async (req, res) => {
    const { id } = req.params;
    const { taskTemplateDescription, taskTemplateSuggestedEvidence} = req.body;
    let hasChanges = false;
    const changes = {};
    try {
        const updateDataById = {};
        if (taskTemplateDescription) updateDataById.taskTemplateDescription = taskTemplateDescription;
        if (taskTemplateSuggestedEvidence) updateDataById.taskTemplateSuggestedEvidence = taskTemplateSuggestedEvidence;
        const originalData = await TaskTemplate.findById(id).lean();
        if (!originalData)
            return res.status(400).json({
                ok: false,
                message: 'No se encontró ningún plantilla de tarea con el id proporcionado'
            })
        if (originalData) {
            // Identify changes
            for (let key in updateDataById) {
                if (originalData[key] !== updateDataById[key]) {
                    hasChanges = true;
                    changes[key] = { old: originalData[key], new: updateDataById[key] };
                }
            }
        }
        if (!hasChanges)
            return res.status(400).json({
                ok: false,
                message: 'No se detectaron cambios, no se puede actualizar la plantilla de tarea'
            })
        const taskTemplate = await TaskTemplate.findByIdAndUpdate(id, updateDataById)
        if (!taskTemplate)
            return res.status(400).json({
                ok: false,
                message: 'No se puede actualizar la plantilla de tarea, no encontrada o no se detectaron cambios'
            })
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'UPDATE', taskTemplate._id, { updateRecord: changes });

        return res.status(200).json({
            ok: true,
            message: 'Plantilla de Tarea actualizada',
            data: taskTemplate
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No se puede actualizar la plantilla de tarea, por favor contacte al soporte',
            data: error
        })
    }
}

// Get taskTemplate by Id
const getTaskTemplateById = async (req, res) => {
    const id = req.params.id
    try {
        const taskTemplate = await TaskTemplate.findById(id)
        if (!taskTemplate) return res.status(404).json({
            ok: false,
            message: `No se encontró plantilla de tarea para ${id}`
        })
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'REAd', id, { actionDetails: 'Retrieved taskTemplate by id' });

        return res.status(200).json({
            ok: true,
            message: 'Plantilla de Tarea encontrada',
            data: taskTemplate
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No se puede encontrar la plantilla de tarea, por favor contacte al soporte',
            data: error
        })
    }
}

// Get taskTemplate by ServiceType
const getTaskTemplateByServiceType = async (req, res) => {
    const serviceType = req.query.serviceType
    try {
        const taskTemplate = await TaskTemplate.find({
            "serviceType": serviceType
        })
        if (!taskTemplate) return res.status(404).json({
            ok: false,
            message: `No se encontró plantilla de tarea para ${serviceType}`
        })
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'REAd', null, { actionDetails: `get taskTemplate by serviceType: ${serviceType}` });
        const taskTemplateData = taskTemplate.reduce((acc, template) => {
            const existingServiceType = acc.find(item => item.serviceType === template.serviceType);
            const taskData = {
            id: template._id,
            taskTemplateOrdering: template.taskTemplateOrdering,
            taskTemplateDescription: template.taskTemplateDescription,
            taskTemplateSuggestedEvidence: template.taskTemplateSuggestedEvidence
            };
            if (existingServiceType) {
            existingServiceType.task.push(taskData);
            } else {
            acc.push({
                serviceType: template.serviceType,
                task: [taskData]
            });
            }
            return acc;
        }, []);

        return res.status(200).json({
            ok: true,
            message: 'Plantilla de Tarea encontrada',
            data: taskTemplateData
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No se puede encontrar la plantilla de tarea, por favor contacte al soporte'
        })
    }
}

const searchTaskTemplates = async (req, res) => {
    try {
        const querySearch = escapeRegex(req.query.search).trim();

        if (!querySearch) {
            return res.status(400).json({ ok: false, message: 'Se requiere una consulta de búsqueda.' });
        }

        const searchRegex = new RegExp(querySearch, 'i'); // 'i' makes it case-insensitive

        const results = await TaskTemplate.aggregate([
            {
                $addFields: {
                    geoLocationString: {
                        $concat: [
                            { $toString: { $arrayElemAt: ['$taskTemplateGeoLocation.coordinates', 0] } },
                            ',',
                            { $toString: { $arrayElemAt: ['$taskTemplateGeoLocation.coordinates', 1] } }
                        ],
                    },
                },
            },
            {
                $match: {
                    $or: [
                        { serviceType: searchRegex },
                        { taskTemplateDescription: searchRegex },
                        { taskTemplateSuggestedEvidence: searchRegex }
                    ],
                },
            },
            {
                $project: {
                    geoLocationString: 0, // Exclude this temporary field from the output
                },
            },
        ]);
        if (results.length === 0) {
            return res.status(404).json({ ok: false, message: 'No se encontraron plantillas de Tarea.' });
        }
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'REAd', null, { actionDetails: `get TaskTemplates through global search: ${querySearch}` });

        return res.status(200).json({
            ok: true, message: 'Plantilla de Tareas encontradas',
            data: results
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error del servidor', data: error });
    }
};

// Delete a taskTemplate by id
const deleteTaskTemplateById = async (req, res) => {
    const { id } = req.params;
    try {
        const taskTemplate = await TaskTemplate.findByIdAndDelete(id)
        if (!taskTemplate)
            return res.status(400).json({
                ok: false,
                message: 'No se puede eliminar la plantilla de tarea, no encontrada'
            })
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'DELETE', id, { deletedRecord: taskTemplate.toObject() });
        return res.status(200).json({
            ok: true,
            message: 'Plantilla de Tarea eliminada',
            data: taskTemplate
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No se puede eliminar la plantilla de tarea, por favor contacte al soporte',
            data: error
        })
    }
}

const registerAuditLog = async (req, action, documentId, changes) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret);
    const auditLogData = {
        auditLogUser: decoded.userData || 'anonymous why?',         // User who performed the action (can be null)
        auditLogAction: action,                                     // Action performed e.g., "CREATE", "UPDATE", "DELETE"
        auditLogModel: 'TaskTemplate',                                    // Affected model, e.g., "User"
        auditLogDocumentId: documentId,                             // ID of the affected document (can be null)
        auditLogChanges: changes                                    // Changes made or additional information (not mandatory)
    }
    await AuditLogController.createAuditLog(auditLogData);
};


module.exports = {
    createTaskTemplate,
    updateTaskTemplateById,
    deleteTaskTemplateById,
    getAllTaskTemplates,
    getTaskTemplateById,
    getTaskTemplateByServiceType,
    searchTaskTemplates
}
