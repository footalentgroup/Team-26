const { body } = require('express-validator')

// normalizeEmail que sea email y no este vacio
const users = [
    body('email', 'Ups!! Email is required').normalizeEmail().notEmpty(),
    body('email', 'Email is not valid!!').normalizeEmail().isEmail(),
    body('password', 'Hey!! password must contain at least, uppercase, lowercase, numbers and characters').isStrongPassword()
    // body('username', 'Ups!! Nombre is required').notEmpty()
]

module.exports = users
