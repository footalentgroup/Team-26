const mongoose = require('mongoose')

const mongoUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

const connectDatabase = async () => {
    try {
        await mongoose.connect(mongoUri)
    } catch (error) {
        process.exit(1); 
    }
}

module.exports = connectDatabase;

