const express = require('express');
const router = express.Router()
const client = require('./client.routes')
const user = require('./user.routes')
const taskTemplate = require('./taskTemplate.routes')
router.use('/api', client)
router.use('/api', user)
router.use('/api', taskTemplate)

module.exports = router
