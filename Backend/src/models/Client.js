const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  email: {
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
      msg: props => `${props.value} no es un email válido!`
    }
  },
  companyName: {
    type: String,
    // unique: true,
    required: [true, 'El nombre del cliente es obligatorio'],
    uppercase: true,
    trim: true,
    minlength: [3, 'El nombre del cliente debe tener al menos 3 caracteres'],
    maxlength: [100, 'El nombre del cliente no puede exceder los 100 caracteres']
  },
  contactPerson: {
    type: String,
    required: [true, 'El contacto es obligatorio'],
    minlength: [3, 'El contacto debe tener al menos 3 caracteres'],
    maxlength: [100, 'El contacto no puede exceder los 100 caracteres']
  },
  phone: {
    type: String,
    maxlength: [20, 'El telefono no puede exceder los 20 caracteres']
  },
  address: {
    type: String,
    maxlength: [255, 'El dirección no puede exceder los 255 caracteres']
  },
  geoLocation: {
    type: { type: String, default: 'Point' }, // GeoJSON type
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  }
},
  {
    timestamps: true
  });

// Crear el índice 2dsphere en el campo geoLocation
clientSchema.index({ geoLocation: '2dsphere' });

module.exports = mongoose.model('Client', clientSchema);