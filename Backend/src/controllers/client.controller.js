const jwt = require('jsonwebtoken')
const Client = require("../models/Client");
const WorkOrder = require("../models/WorkOrder");
const AuditLogController = require('../controllers/auditLog.controller'); // Audit controller

const escapeRegex = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex characters
};

// Get all client records
const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find()
        if (!clients || clients.length === 0) return res.status(404).json({ ok: false, message: 'No se encontraron clientes' });
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'READ', null, { actionDetails: 'get all clients' });

        return res.status(200).json({
            ok: true,
            message: 'Clientes encontrados',
            data: clients
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al recuperar clientes',
            data: error
        })
    }
}

// Create a client
const createClient = async (req, res) => {
    try {
        const nuevoClient = new Client(req.body);
        await nuevoClient.save();
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'CREATE', nuevoClient._id, { newdRecord: nuevoClient.toObject() });

        return res.status(201).json({ ok: true, message: 'Cliente creado con éxito', data: nuevoClient });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                ok: false,
                message: 'El correo electrónico del cliente ya existe',
                data: error
            });
        } else {
            res.status(500).json({
                ok: false,
                message: 'Error al crear cliente',
                data: error
            });
        }
    }
}

// Update a client by id
const updateClientById = async (req, res) => {
    const { id } = req.params;
    const { clientCompanyName, clientContactPerson, clientEmail, clientPhone, clientAddress } = req.body;
    let hasChanges = false;
    const changes = {};
    try {
        const updateDataById = {};
        if (clientCompanyName) updateDataById.clientCompanyName = clientCompanyName;
        if (clientContactPerson) updateDataById.clientContactPerson = clientContactPerson;
        if (clientEmail) updateDataById.clientEmail = clientEmail;
        if (clientPhone) updateDataById.clientPhone = clientPhone;
        if (clientAddress) updateDataById.clientAddress = clientAddress;
        const originalData = await Client.findById(id);
        if (!originalData)
            return res.status(400).json({
                ok: false,
                message: 'No se encontró ningún cliente con el id proporcionado'
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
                message: 'No se detectaron cambios, no se puede actualizar el cliente'
            })
        const client = await Client.findByIdAndUpdate(id, updateDataById)
        if (!client)
            return res.status(400).json({
                ok: false,
                message: 'No se puede actualizar el cliente, no encontrado o no se detectaron cambios'
            })
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'UPDATE', client._id, { updateRecord: changes });

        const clientUpdated = await Client.findById(id);
        
        return res.status(200).json({
            ok: true,
            message: 'Cliente actualizado',
            data: clientUpdated
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No se puede actualizar el cliente, por favor contacte al soporte',
            data: error
        })
    }
}

// Get client by Id
const getClientById = async (req, res) => {
    const id = req.params.id
    try {
        const client = await Client.findById(id)
        if (!client) return res.status(404).json({
            ok: false,
            message: `No se encontró cliente para ${id}`
        })
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'READ', id, { actionDetails: 'Retrieved client by id' });

        return res.status(200).json({
            ok: true,
            message: 'Cliente encontrado',
            data: client
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No se puede encontrar el cliente, por favor contacte al soporte',
            data: error
        })
    }
}

// Get client by Email
const getClientByEmail = async (req, res) => {
    const clientEmail = req.query.clientEmail
    try {
        const client = await Client.findOne({
            "clientEmail": { $regex: new RegExp('^' + clientEmail + '$', 'i') }
        })
        if (!client) return res.status(404).json({
            ok: false,
            message: `No se encontró cliente para ${clientEmail}`
        })
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'READ', client._id, { actionDetails: `get client by email: ${clientEmail}` });

        return res.status(200).json({
            ok: true,
            message: 'Cliente encontrado',
            data: client
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No se puede encontrar el cliente, por favor contacte al soporte'
        })
    }
}

const searchClients = async (req, res) => {
    try {
        const querySearch = escapeRegex(req.query.search).trim();

        if (!querySearch) {
            return res.status(400).json({ ok: false, message: 'Se requiere una consulta de búsqueda.' });
        }

        const searchRegex = new RegExp(querySearch, 'i'); // 'i' makes it case-insensitive

        const results = await Client.aggregate([
            {
                $addFields: {
                    geoLocationString: {
                        $concat: [
                            { $toString: { $arrayElemAt: ['$clientGeoLocation.coordinates', 0] } },
                            ',',
                            { $toString: { $arrayElemAt: ['$clientGeoLocation.coordinates', 1] } }
                        ],
                    },
                },
            },
            {
                $match: {
                    $or: [
                        { clientEmail: searchRegex },
                        { clientCompanyName: searchRegex },
                        { clientContactPerson: searchRegex },
                        { clientAddress: searchRegex },
                        { clientPhone: searchRegex },
                        { geoLocationString: searchRegex },
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
            return res.status(404).json({ ok: false, message: 'No se encontraron clientes.' });
        }
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'READ', null, { actionDetails: `get Clients through global search: ${querySearch}` });

        return res.status(200).json({
            ok: true, message: 'Clientes encontrados',
            data: results
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Error del servidor', data: error });
    }
};

// Delete a client by id
const deleteClientById = async (req, res) => {
    const { id } = req.params;
    try {
        // Check if the client has any associated work orders
        const hasWorkOrders = await WorkOrder.exists({ clientId: id });
        if (hasWorkOrders) {
            return res.status(400).json({
            ok: false,
            message: 'No se puede eliminar el cliente, tiene órdenes de trabajo asociadas'
            });
        }

        const client = await Client.findByIdAndDelete(id);
        if (!client)
            return res.status(400).json({
                ok: false,
                message: 'No se puede eliminar el cliente, no encontrado'
            })
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'DELETE', id, { deletedRecord: client.toObject() });
        return res.status(200).json({
            ok: true,
            message: 'Cliente eliminado',
            data: client
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No se puede eliminar el cliente, por favor contacte al soporte',
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
        auditLogModel: 'Client',                                    // Affected model, e.g., "User"
        auditLogDocumentId: documentId,                             // ID of the affected document (can be null)
        auditLogChanges: changes                                    // Changes made or additional information (not mandatory)
    }
    await AuditLogController.createAuditLog(auditLogData);
};

const searchClientsByCompanyName = async (req, res) => {
    const { clientCompanyName } = req.query;
    if (!clientCompanyName) {
        return res.status(400).json({ ok: false, message: 'Se requiere el nombre de la empresa para la búsqueda.' });
    }

    try {
        const searchPattern = new RegExp('.*' + escapeRegex(clientCompanyName) + '.*', 'i'); // Match any substring case-insensitive
        const clients = await Client.find({ clientCompanyName: { $regex: searchPattern } });

        if (clients.length === 0) {
            return res.status(404).json({ ok: false, message: 'No se encontraron clientes con el nombre de la empresa proporcionado.' });
        }

        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'READ', null, { actionDetails: `search clients by company name: ${clientCompanyName}` });

        return res.status(200).json({
            ok: true,
            message: 'Clientes encontrados',
            data: clients
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, message: 'Error del servidor', data: error });
    }
};

module.exports = {
    createClient,
    updateClientById,
    deleteClientById,
    getAllClients,
    getClientById,
    getClientByEmail,
    searchClients,
    searchClientsByCompanyName
}
