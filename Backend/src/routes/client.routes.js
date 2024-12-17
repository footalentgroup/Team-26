const express = require('express')

// permitir comunicarnos con el frontend
const router = express.Router()
const Client = require('../controllers/client.controller')

// const { validateToken } = require('./../middlerwares/validateToken')

//traer todas las client
router.get('/client', /* validateToken,*/ Client.getAllClients)

//nuevo cliente
router.post('/client', /* validateToken,*/ Client.createClient)

//modificar cliente por el id
router.patch('/client/:id',  /* validateToken,*/ Client.updateClientById)

//Borrar cliente por el id
router.delete('/client/:id', /* validateToken,*/ Client.deleteClientById)

//Buscar cliente por el id
router.get('/client/:id', /* validateToken,*/ Client.getClientById)

//Buscar cliente por el email
router.get('/clientbyemail', /* validateToken,*/ Client.getClientByEmail)

//Buscar cliente por un texto en general
router.get('/clientsearch',  /* validateToken,*/ Client.searchClients)

module.exports = router

