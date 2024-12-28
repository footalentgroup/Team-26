const Client = require("../models/Client");
const AuditLogController = require('../controllers/auditLog.controller'); // Controlador de auditoría

const escapeRegex = (text) => {

    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapa caracteres especiales de regex
};

// Buscar todos los registros para clients
const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find()
        if (!clients || clients.length === 0) return res.status(404).json({ ok: false, message: 'No se encontraron clientes' });
        // Registrar en audit_logs
        await AuditLogController.createAuditLog(
            'req.user.id', // Usuario autenticado
            'READ', // Acción
            'Client', // Modelo afectado
            null, // No aplica a un documento específico
            { actionDetails: 'Retrieved all clients' } // Detalles adicionales
        );

        return res.status(200).json({
            ok: true,
            message: 'clientes encontrados',
            data: clients
        })
    } catch (error) {

        return res.status(500).json({
            ok: false,
            message: 'Error al obtener clientes',
            data: error
        })
    }
}

// Crear un client
const createClient = async (req, res) => {
    try {
        const nuevoClient = new Client(req.body);
        await nuevoClient.save();
        // Registrar en audit_logs
        await AuditLogController.createAuditLog(
            'req.user.id', // Usuario que realizó la acción
            'CREATE', // Acción
            'Client', // Modelo afectado
            nuevoClient._id, // ID del nuevo documento
            { newRecord: nuevoClient.toObject() } // Detalles del nuevo registro
        );
        res.status(201).json({ ok: true, message: 'Cliente creado exitosamente', data: nuevoClient });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                ok: false,
                message: 'El email del cliente ya existe',
                data: error
            });
        } else {
            res.status(500).json({
                ok: false,
                message: 'Error al crear el cliente',
                data: error
            });
        }
    }
}

// modificar una client por el id
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

            return res.status(400).json({
                ok: false,
                message: 'No fue posible modificar cliente, no fue encontrado o no se detecto modificaciones'
            })
        const updateclient = await Client.findById(id)

        // Registrar en audit_logs
        await AuditLogController.createAuditLog(
            'req.user.id',
            'UPDATE',
            'Client',
            id,
            changes // Detalles de los cambios
        );

        return res.status(200).json({
            ok: true,
            message: 'cliente actualizado',
            client: updateclient
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
        await AuditLogController.createAuditLog(
            'req.user.id', // Usuario autenticado
            'READ', // Acción
            'Client', // Modelo afectado
            null, // No aplica a un documento específico
            { actionDetails: 'Retrieved client by id' } // Detalles adicionales
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
        await AuditLogController.createAuditLog(
            'req.user.id', // Usuario autenticado
            'READ', // Acción
            'Client', // Modelo afectado
            null, // No aplica a un documento específico
            { actionDetails: 'Retrieved client clientEmail id' } // Detalles adicionales
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
        await AuditLogController.createAuditLog(
            'req.user.id', // Usuario autenticado
            'READ', // Acción
            'Client', // Modelo afectado
            null, // No aplica a un documento específico
            { actionDetails: `Clientes recuperados mediante búsqueda global: ${querySearch}` } // Detalles adicionales
        );
        res.status(200).json({
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

            return res.status(400).json({
                ok: false,
                message: 'No fue posible eliminar cliente, no fue encontrado'
            })
        // Registrar en audit_logs
        await AuditLogController.createAuditLog(
            'req.user.id',
            'DELETE',
            'Client',
            id,
            { deletedRecord: client.toObject() } // Detalles del documento eliminado                 
        ); // await AuditLogController.createAuditLog(
        return res.status(200).json({
            ok: true,
            message: 'cliente eliminado',
            data: client
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No fue posible eliminar cliente, por favor contactar a soporte',
            data: error
        })
    }
}

module.exports = {
    createClient,
    updateClientById,
    deleteClientById,
    getAllClients,
    getClientById,
    getClientByEmail,
    searchClients
}