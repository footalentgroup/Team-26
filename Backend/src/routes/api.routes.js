const express = require('express');
const router = express.Router()
const client = require('./client.routes')
const user = require('./user.routes')

router.use('/api', client)
router.use('/api', user)

module.exports = router
