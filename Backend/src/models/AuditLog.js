const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    auditLogUser: { 
        type: String,
        required: true
     }, // ID o nombre del usuario
    auditLogAction: { type: String, required: true }, // e.g., "CREATE", "UPDATE", "DELETE"
    auditLogModel: { type: String, required: true }, // Modelo afectado, e.g., "User"
    auditLogDocumentId: { type: String, default: null }, // ID del documento afectado (puede ser nulo)
    auditLogChanges: { type: Object, default: null }, // Cambios realizados o información adicional (no obligatorio)
    auditLogTimestamp: { type: Date, default: Date.now } // Fecha y hora del evento
    });

// Pre-update middleware
auditLogSchema.pre('updateOne', function (next) {
    next(new Error('AuditLog entries cannot be updated'));
  });
  
  // Pre-remove middleware
  auditLogSchema.pre('remove', function (next) {
    next(new Error('AuditLog entries cannot be deleted'));
  });

module.exports = mongoose.model('AuditLog', auditLogSchema);
