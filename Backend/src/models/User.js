const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true },
    userIsActive: { type: Boolean, default: true }, // Active/Inactive status
    userRole: { type: String, enum: ['administrator', 'supervisor', 'technician'], default: 'technician' }, // User role
    userFailedAttempts: { type: Number, default: 0 }, // Count of failed login attempts
    userLoginAttempts: [
      {
        timestamp: { type: Date, default: Date.now },
        status: { type: String, enum: ['success', 'failed'] }, // Login status
        cause: { type: String }, // Reason for failure
        token: { type: String }, // JWT token (if success)
      },
    ],
    userConfirmationToken: { type: String }, // Token de confirmación
    userConfirmationTokenExpires: { type: Date }, // Fecha de expiración del token    
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
