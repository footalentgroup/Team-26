const mongoose = require('mongoose')

const mongoUri =`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;
// const mongoUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

const connectDatabase = async () => {
    try {
        await mongoose.connect(mongoUri)
        console.log('Base de Datos Conectada')
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1); // Detiene la aplicación en caso de error
    }
}

module.exports = connectDatabase;

