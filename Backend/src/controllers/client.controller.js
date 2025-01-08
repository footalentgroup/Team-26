const jwt = require('jsonwebtoken')
const Client = require("../models/Client");
const AuditLogController = require('../controllers/auditLog.controller'); // Audit controller

const escapeRegex = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex characters
};

<<<<<<< HEAD
const auditLogData = {
    auditLogUser: null          // Usuario que realizó la acción (puede ser nulo)
    , auditLogAction: null      // Acción realizada e.g., "CREATE", "UPDATE", "DELETE"
    , auditLogModel: 'Client'        // Modelo afectado, e.g., "User"
    , auditLogDocumentId: null          // ID del documento afectado (puede ser nulo)
    , auditLogChanges: null          // Cambios realizados o información adicional (no obligatorio)
}


// Buscar todos los registros para clients
=======
// Get all client records
>>>>>>> develop
const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find()
        if (!clients || clients.length === 0) return res.status(404).json({ ok: false, message: 'No se encontraron clientes' });
<<<<<<< HEAD
        // Registrar en audit_logs
        auditLogData.auditLogUser = req.user.id;
        auditLogData.auditLogAction = 'READ';
        auditLogData.auditLogChanges = { actionDetails: 'Retrieved all clients' };
        await AuditLogController.createAuditLog(
            auditLogData
        );

        return res.status(200).json({
            ok: true,
            message: 'clientes encontrados',
=======
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'READ', null, { actionDetails: 'get all clients' });

        return res.status(200).json({
            ok: true,
            message: 'Clientes encontrados',
>>>>>>> develop
            data: clients
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
<<<<<<< HEAD
            message: 'Error al obtener clientes',
=======
            message: 'Error al recuperar clientes',
>>>>>>> develop
            data: error
        })
    }
}

// Create a client
const createClient = async (req, res) => {
    try {
        const nuevoClient = new Client(req.body);
        await nuevoClient.save();
<<<<<<< HEAD
        // Registrar en audit_logs
        auditLogData.auditLogUser = req.user.id;
        auditLogData.auditLogChanges = { actionDetails: 'Retrieved all clients' };
        await AuditLogController.createAuditLog(
            auditLogData
        );
        return res.status(201).json({ ok: true, message: 'Cliente creado exitosamente', data: nuevoClient });
=======
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'CREATE', nuevoClient._id, { newdRecord: nuevoClient.toObject() });

        return res.status(201).json({ ok: true, message: 'Cliente creado con éxito', data: nuevoClient });
>>>>>>> develop
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                ok: false,
<<<<<<< HEAD
                message: 'El email del cliente ya existe',
=======
                message: 'El correo electrónico del cliente ya existe',
>>>>>>> develop
                data: error
            });
        } else {
            res.status(500).json({
                ok: false,
<<<<<<< HEAD
                message: 'Error al crear el cliente',
=======
                message: 'Error al crear cliente',
>>>>>>> develop
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
    try {
        const updateDataById = {};
        if (clientCompanyName) updateDataById.clientCompanyName = clientCompanyName;
        if (clientContactPerson) updateDataById.clientContactPerson = clientContactPerson;
        if (clientEmail) updateDataById.clientEmail = clientEmail;
        if (clientPhone) updateDataById.clientPhone = clientPhone;
        if (clientAddress) updateDataById.clientAddress = clientAddress;
        const originalData = await Client.findById(id).lean();
        if (!originalData)
<<<<<<< HEAD
            return res.status(400).json({
                ok: false,
                message: 'No se registra cliente con el id proporcionado'
            })
        if (originalData) {
            // Identificar cambios
            const changes = {};
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
                message: 'No fue posible modificar cliente, no se detectó modificaciones'
            })
        const client = await Client.findByIdAndUpdate(id, updateDataById)
        if (!client)

=======
>>>>>>> develop
            return res.status(400).json({
                ok: false,
                message: 'No se encontró ningún cliente con el id proporcionado'
            })
<<<<<<< HEAD
        // const updateclient = await Client.findById(id)

        // // Registrar en audit_logs
        auditLogData.auditLogUser = req.user.id;
        auditLogData.auditLogDocumentId = client._id            // ID del documento afectado (puede ser nulo)
        auditLogData.auditLogChanges = changes                  // Cambios realizados o información adicional (no obligatorio)
            await AuditLogController.createAuditLog(
            auditLogData
        );

        return res.status(200).json({
            ok: true,
            message: 'cliente actualizado',
            data: client
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No fue posible modificar cliente, por favor contactar a soporte',
            data: error
        })
    }
}

// Buscar registro por Id
const getClientById = async (req, res) => {
    const id = req.params.id
    try {
        const client = await Client.findById(id)
        if (!client) return res.status(404).json({
            ok: false,
            message: `No fue encontrado cliente para ${id}`
        })
        // Registrar en audit_logs
        auditLogData.auditLogUser = req.user.id;
        auditLogData.auditLogAction = 'READ';
        auditLogData.auditLogChanges = { actionDetails: 'Retrieved client by id' };
        await AuditLogController.createAuditLog(
            auditLogData
        );

        return res.status(200).json({
            ok: true,
            message: 'Encontrado cliente',
            data: client
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No fue encontrado cliente, por favor contactar a soporte',
            data: error
        })
    }
}

// Buscar registro por Id
const getClientByEmail = async (req, res) => {
    const clientEmail = req.query.clientEmail
    try {
        const client = await Client.findOne({
            "clientEmail": { $regex: new RegExp('^' + clientEmail + '$', 'i') }
        })
        if (!client) return res.status(404).json({
            ok: false,
            message: `No fue encontrado cliente para ${clientEmail}`
        })
        // Registrar en audit_logs
        auditLogData.auditLogUser = req.user.id;
        auditLogData.auditLogAction = 'READ';
        auditLogData.auditLogChanges = { actionDetails: 'Retrieved client clientEmail id' } // Detalles adicionales
        await AuditLogController.createAuditLog(
            auditLogData
        );

        return res.status(200).json({
            ok: true,
            message: 'Encontrado cliente',
            data: client
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No fue encontrado cliente, por favor contactar a soporte'
        })
    }
}

const searchClients = async (req, res) => {

    try {
        const querySearch = escapeRegex(req.query.search).trim();

        if (!querySearch) {
            return res.status(400).json({ ok: false, message: 'Search query is required.' });
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
        // Registrar en audit_logs
        // Registrar en audit_logs
        auditLogData.auditLogUser = req.user.id;
        auditLogData.auditLogAction = 'READ';
        auditLogData.auditLogChanges = { actionDetails: `Clientes recuperados mediante búsqueda global: ${querySearch}` } // Detalles adicionales
        await AuditLogController.createAuditLog(
            auditLogData
        );
        return res.status(200).json({
            ok: true, message: 'Clientes encontrados',
            data: results
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Server error', data: error });
    }
};

// eliminar una client por el id
const deleteClientById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await Client.findByIdAndDelete(id)
        if (!client)

=======
        if (originalData) {
            // Identify changes
            const changes = {};
            for (let key in updateDataById) {
                if (originalData[key] !== updateDataById[key]) {
                    hasChanges = true;
                    changes[key] = { old: originalData[key], new: updateDataById[key] };
                }
            }
        }
        if (!hasChanges)
>>>>>>> develop
            return res.status(400).json({
                ok: false,
                message: 'No se detectaron cambios, no se puede actualizar el cliente'
            })
<<<<<<< HEAD
        // Registrar en audit_logs
        // Registrar en audit_logs
        auditLogData.auditLogUser = req.user.id;
        auditLogData.auditLogAction = 'DELETE';
        auditLogData.auditLogDocumentId = id            // ID del documento
        auditLogData.auditLogChanges = { deletedRecord: client.toObject() } // Detalles del documento eliminado
        await AuditLogController.createAuditLog(
            auditLogData
        );
        return res.status(200).json({
            ok: true,
            message: 'cliente eliminado',
=======
        const client = await Client.findByIdAndUpdate(id, updateDataById)
        if (!client)
            return res.status(400).json({
                ok: false,
                message: 'No se puede actualizar el cliente, no encontrado o no se detectaron cambios'
            })
        // Register in audit_logs (req, action, documentId, changes) 
        await registerAuditLog(req, 'UPDATE', client._id, { updateRecord: changes });

        return res.status(200).json({
            ok: true,
            message: 'Cliente actualizado',
>>>>>>> develop
            data: client
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
<<<<<<< HEAD
            message: 'No fue posible eliminar cliente, por favor contactar a soporte',
=======
            message: 'No se puede actualizar el cliente, por favor contacte al soporte',
>>>>>>> develop
            data: error
        })
    }
}

<<<<<<< HEAD
=======
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
        const client = await Client.findByIdAndDelete(id)
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

>>>>>>> develop
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
