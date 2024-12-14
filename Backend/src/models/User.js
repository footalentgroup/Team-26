const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // Active/Inactive status
    loginAttempts: [
      {
        timestamp: { type: Date, default: Date.now },
        status: { type: String, enum: ['success', 'failed'] }, // Login status
        cause: { type: String }, // Reason for failure
        token: { type: String }, // JWT token (if success)
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
