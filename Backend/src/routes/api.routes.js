const express = require('express');
const router = express.Router()
const client = require('./client.routes')

router.use('/api', client)

module.exports = router