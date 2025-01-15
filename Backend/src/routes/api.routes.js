const express = require('express');
const router = express.Router()
const client = require('./client.routes')
const user = require('./user.routes')
const taskTemplate = require('./taskTemplate.routes')
const workOrder = require('./workOrder.routes')
const mail = require('./mail.routes')

router.use('/api', client)
router.use('/api', user)
router.use('/api', taskTemplate)
router.use('/api', workOrder)
router.use('/api', mail)

module.exports = router
