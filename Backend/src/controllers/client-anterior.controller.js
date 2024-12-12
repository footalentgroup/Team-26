const Client = require('../models/Client');

// Get all clients
const getAllClients = async (req, res) => {
    try {
        console.log(req.query.id)
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one client by ID
const getWorkorderById = async (req, res) => {
    console.log(req.params.id)
    try {
        const id = req.params.id;
        const client = await Client.findById(id);
        res.status(200).json(client);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new client
const createClient = async (req, res) => {
    const client = new Client(req.body);
    try {
        const newClient = await client.save();
        res.status(201).json(newClient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a client by ID
const updateClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a client by ID
const deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({ message: 'Client deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllClients,
    getWorkorderById,
    createClient,
    updateClient,
    deleteClient
};