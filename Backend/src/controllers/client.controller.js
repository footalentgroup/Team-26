const Client = require("../models/Client");
const AuditLogController = require('../controllers/auditLog.controller'); // Controlador de auditoría

const escapeRegex = (text) => {

    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapa caracteres especiales de regex
};

// Buscar todos los registros para clients
const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find()
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
            clients: clients
        })
    } catch (error) {

        return res.status(500).json({
            ok: false,
            message: 'Error al obtener clientes'
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
        res.status(201).json({ message: 'Client created successfully', data: nuevoClient });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                ok: false,
                message: 'El nombre del cliente ya existe'
            });
        } else {
            res.status(500).json({
                ok: false,
                message: 'Error al crear el cliente', error
            });
        }
    }
}

// modificar una client por el id
const updateClientById = async (req, res) => {
    const { id } = req.params;
    const { companyName, contactPerson, email, phone, address } = req.body
    try {
        const updateDataById = {};
        if (companyName) updateDataById.companyName = companyName;
        if (contactPerson) updateDataById.contactPerson = contactPerson;
        if (email) updateDataById.email = email;
        if (phone) updateDataById.phone = phone;
        if (address) updateDataById.address = address;
        const originalData = await Client.findById(id).lean();
        const client = await Client.findByIdAndUpdate(id, updateDataById)
        if (!client)

            return res.status(400).json({
                ok: false,
                message: 'No fue posible modificar cliente, no fue encontrado o no se detecto modificaciones'
            })
        const updateclient = await Client.findById(id)
        // Identificar cambios
        const changes = {};
        for (let key in updateDataById) {
            if (originalData[key] !== updateDataById[key]) {
                changes[key] = { old: originalData[key], new: updateDataById[key] };
            }
        }

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
            message: 'No fue posible modificar cliente, por favor contactar a soporte'
        })
    }
}

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
            client: client
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No fue posible eliminar cliente, por favor contactar a soporte'
        })
    }
}

// Buscar registro por Id
const getClientById = async (req, res) => {
    const id = req.params.id
    try {
        const client = await Client.findById({ _id: id })
        if (!client) return res.status(404).json({
            ok: false,
            msg: `No fue encontrado cliente para ${id}`
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
            msg: 'Encontrado cliente',
            data: client
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'No fue encontrado cliente, por favor contactar a soporte'
        })
    }
}

// Buscar registro por Id
const getClientByEmail = async (req, res) => {
    const email = req.query.email
    try {
        const client = await Client.findOne({
            "email": { $regex: new RegExp('^' + email + '$', 'i') }
        })
        if (!client) return res.status(404).json({
            ok: false,
            msg: `No fue encontrado cliente para ${email}`
        })
        // Registrar en audit_logs
        await AuditLogController.createAuditLog(
            'req.user.id', // Usuario autenticado
            'READ', // Acción
            'Client', // Modelo afectado
            null, // No aplica a un documento específico
            { actionDetails: 'Retrieved client email id' } // Detalles adicionales
        );
        return res.status(200).json({
            ok: true,
            msg: 'Encontrado cliente',
            data: client
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'No fue encontrado cliente, por favor contactar a soporte'
        })
    }
}

const searchClients = async (req, res) => {

    try {
        const querySearch = escapeRegex(req.query.search).trim();

        if (!querySearch) {
            return res.status(400).json({ message: 'Search query is required.' });
        }

        const searchRegex = new RegExp(querySearch, 'i'); // 'i' makes it case-insensitive

        const results = await Client.aggregate([
            {
                $addFields: {
                    geoLocationString: {
                        $concat: [
                            { $toString: { $arrayElemAt: ['$geoLocation.coordinates', 0] } },
                            ',',
                            { $toString: { $arrayElemAt: ['$geoLocation.coordinates', 1] } }
                        ],
                    },
                },
            },
            {
                $match: {
                    $or: [
                        { email: searchRegex },
                        { companyName: searchRegex },
                        { contactPerson: searchRegex },
                        { address: searchRegex },
                        { phone: searchRegex },
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
            return res.status(404).json({ message: 'No clients found.' });
        }
        // Registrar en audit_logs
        await AuditLogController.createAuditLog(
            'req.user.id', // Usuario autenticado
            'READ', // Acción
            'Client', // Modelo afectado
            null, // No aplica a un documento específico
            { actionDetails: 'Retrieved clients search global' } // Detalles adicionales
        );
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = {
    getAllClients,
    createClient,
    updateClientById,
    deleteClientById,
    getClientById,
    getClientByEmail,
    searchClients
}