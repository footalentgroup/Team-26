const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
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
          userName: {
            type: String,
            required: [true, 'Nombre es obligatorio'],
            uppercase: true,
            trim: true,
            minlength: [3, 'El nombre del usuario debe tener al menos 3 caracteres'],
            maxlength: [100, 'El nombre del usuario no puede exceder los 50 caracteres'],
          },
          userLastName: {
            type: String,
            required: [true, 'Apellido es obligatorio'],
            uppercase: true,
            trim: true,
            minlength: [3, 'El nombre del usuario debe tener al menos 3 caracteres'],
            maxlength: [100, 'El nombre del usuario no puede exceder los 50 caracteres'],
            },
            userFullName: {
            type: String,
            trim: true,
            unique: true,
            default: function() {
              return `${this.userName} ${this.userLastName}`;
            }
          },
          userPhone: {
            type: String,
            maxlength: [20, 'El telefono no puede exceder los 20 caracteres']
          },
          userPassword: { type: String
            , minlength: [8, 'El password debe tener al menos 8 caracteres']
          },
          userIsActive: { type: Boolean, default: false }, // Active/Inactive status
    userRole: { type: String, enum: ['administrator', 'supervisor', 'technician'], default: 'technician' }, // User role
    userDeletionCause: { type: String }, // Reason for deletion
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

userSchema.pre('validate', function (next) {
  if (!this.userPassword && !this.userConfirmationToken) {
    this.invalidate('userPassword', 'El password es obligatorio');
  }
  next();
});

userSchema.pre('save', function (next) {
  this.userFullName = `${this.userName} ${this.userLastName}`;
  next();
});

module.exports = mongoose.model('User', userSchema);

