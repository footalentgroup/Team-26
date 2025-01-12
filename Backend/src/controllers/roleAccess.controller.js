const RoleAccess = require('./models/RoleAccess');
const User = require('./models/User');


// Buscar todos los registros para roleAccess
const getAllRoleAccess = async (req, res) => {
    try {
        const roleAccess = await RoleAccess.find()
        return res.status(200).json({
            ok: true,
            message: 'roles encontrados',
            roleAccess: roleAccess
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener roles'
        })
    }
}



const createRoleAccess = async (req, res) => {
    try {
        const { role, access } = req.body;
        const nuevoRole = new RoleAccess({ role, access });
        await nuevoRole.save();
        res.status(201).json({ message: 'Role created successfully', data: nuevoRole });
    } catch (error) {
        res.status(500).json({ message: 'Error creating role', error: error.message });
    }
};

exports.updateRoleAccessById = async (req, res) => {
    try {
        const { id, access, isActive } = req.body;
        const updatedRole = await RoleAccess.findByIdAndUpdate(
            id,
            { access, isActive },
            { new: true }
        );

        if (!updatedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.status(200).json({ message: 'Role updated successfully', data: updatedRole });
    } catch (error) {
        res.status(500).json({ message: 'Error updating role', error: error.message });
    }
};

const deleteRoleAccessById = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el rol existe
        const role = await RoleAccess.findById(id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        // Verificar si el rol tiene usuarios relacionados
        const relatedUsers = await User.find({ UserRole: id });

        if (relatedUsers.length > 0) {
            // Si tiene usuarios relacionados, inactivar el rol
            if (!role.isActive) {
                return res.status(200).json({
                    message: 'Role already inactive. No updates required.',
                });
            }

            role.isActive = false;
            await role.save();

            return res.status(200).json({
                message: 'Role could not be deleted because it has related users. Role has been deactivated instead.',
                relatedUsers: relatedUsers.length
            });
        }

        // Si no tiene usuarios relacionados, eliminar el rol
        await RoleAccess.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting role', error: error.message });
    }
};

// Buscar registro por Id
const getRoleAccessById = async (req, res) => {
    const id = req.params.id
    try {
        const roleAccess = await RoleAccess.findById({ _id: id })
        if (!roleAccess) return res.status(404).json({
            ok: false,
            message: `No fue encontrado Rol para ${id}`
        })
        return res.status(200).json({
            ok: true,
            message: 'Encontrado Rol',
            client: client
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'No fue encontrado rol, por favor contactar a soporte'
        })
    }
}

module.exports = {
    getAllRoleAccess,
    createRoleAccess,
    updateRoleAccessById,
    deleteRoleAccessById,
    getRoleAccessById
    // searchRoles
}