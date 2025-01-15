const express = require('express')

// permitir comunicarnos con el frontend
const router = express.Router()
const mail = require('../controllers/mail.controller')
const { validateToken } = require('../middlewares/validateToken')

router.post('/mailsend', validateToken, mail.sendEmailFrontend );

module.exports = router
