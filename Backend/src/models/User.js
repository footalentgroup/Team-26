const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: [true, 'Nombre es obligatorio'],
      uppercase: true,
      trim: true,
      minlength: [3, 'El nombre del usuario debe tener al menos 3 caracteres'],
      maxlength: [100, 'El nombre del usuario no puede exceder los 100 caracteres']
    },
    userEmail: {
      type: String,
      unique: true,
      required: [true, 'Email es obligatorio'],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (review) {
          // Expresión regular para validar el formato de email
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(review);
        },
        message: props => `${props.value} no es un email válido!`
      }
    },
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
    userLoginToken: { type: String } // Token de Login
  },
  { timestamps: true }
);




module.exports = mongoose.model('User', userSchema);

