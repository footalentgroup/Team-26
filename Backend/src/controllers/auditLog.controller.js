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
    return error.message;
  }
};

const getAuditLogByModel = async (model, limit = 50, skip = 0) => {
    try {
      return await AuditLog.find({ auditLogModel })
        .sort({ auditLogTimestamp: -1 }) 
        .limit(limit)
        .skip(skip);
    } catch (error) {
      throw error;
    }
  };
  
  const getAuditLogByUser = async (userId, limit = 50, skip = 0) => {
    try {
      return await AuditLog.find({ auditLogUser: userId })
        .sort({ auditLogTimestamp: -1 })
        .limit(limit)
        .skip(skip);
    } catch (error) {
      throw error;
    }
  };

module.exports = { 
    createAuditLog
    , getAuditLogByModel
    , getAuditLogByUser
 };