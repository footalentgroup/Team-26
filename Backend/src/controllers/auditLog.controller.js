const AuditLog = require('../models/AuditLog');

const createAuditLog = async ( {auditLogUser, auditLogAction, auditLogModel, auditLogDocumentId, auditLogChanges} ) => {
  try {
    await AuditLog.create({
      auditLogUser,
      auditLogAction,
      auditLogModel,
      auditLogDocumentId,
      auditLogChanges
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

// Listar logs por modelo
const getAuditLogByModel = async (model, limit = 50, skip = 0) => {
    try {
      return await AuditLog.find({ auditLogModel })
        .sort({ auditLogTimestamp: -1 }) // Ordenar por fecha, más recientes primero
        .limit(limit)
        .skip(skip);
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  };
  
  // Listar logs por usuario
  const getAuditLogByUser = async (userId, limit = 50, skip = 0) => {
    try {
      return await AuditLog.find({ auditLogUser: userId })
        .sort({ auditLogTimestamp: -1 })
        .limit(limit)
        .skip(skip);
    } catch (error) {
      console.error('Error fetching logs by user:', error);
      throw error;
    }
  };

module.exports = { 
    createAuditLog
    , getAuditLogByModel
    , getAuditLogByUser
 };