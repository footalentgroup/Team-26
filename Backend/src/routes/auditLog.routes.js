const express = require('express')

// permitir comunicarnos con el frontend
const router = express.Router()
const AuditLog = require('../controllers/auditLog.controller')


router.get('/auditlogbymodel', AuditLog.getAuditLogByModel );
router.get('/auditlogbyuser', AuditLog.getAuditLogByUser );

router.post('/auditlog', AuditLog.createAuditLog );

module.exports = router
