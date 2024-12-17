const Workorder = require('../models/Workorder');

// Get all work orders
const getAllWorkorders = async (req, res) => {
        try {
        const workorders = await Workorder.find();
        res.status(200).json(workorders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single work order by ID
const getWorkorderById = async (req, res) => {
    try {
        const workorder = await Workorder.findById(req.params.id);
        if (!workorder) {
            return res.status(404).json({ message: 'Workorder not found' });
        }
        res.status(200).json(workorder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new work order
const createWorkorder = async (req, res) => {
    const workorder = new Workorder(req.body);
    try {
        const newWorkorder = await workorder.save();
        res.status(201).json(newWorkorder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing work order
const updateWorkorder = async (req, res) => {
    try {
        const updatedWorkorder = await Workorder.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedWorkorder) {
            return res.status(404).json({ message: 'Workorder not found' });
        }
        res.status(200).json(updatedWorkorder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a work order
const deleteWorkorder = async (req, res) => {
    try {
        const deletedWorkorder = await Workorder.findByIdAndDelete(req.params.id);
        if (!deletedWorkorder) {
            return res.status(404).json({ message: 'Workorder not found' });
        }
        res.status(200).json({ message: 'Workorder deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllWorkorders,
    getWorkorderById,
    createWorkorder,
    updateWorkorder,
    deleteWorkorder
};

