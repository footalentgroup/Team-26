const express = require('express')

// permitir comunicarnos con el frontend
const router = express.Router()
const AuditLog = require('../controllers/auditLog.controller')
const { validateToken } = require('../middlewares/validateToken')

router.get('/auditlogbymodel', validateToken, AuditLog.getAuditLogByModel );
router.get('/auditlogbyuser', validateToken, AuditLog.getAuditLogByUser );

router.post('/auditlog', AuditLog.createAuditLog );

module.exports = router
