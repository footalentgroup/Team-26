const express = require('express')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const api = require('./src/routes/api.routes')

dotenv.config();
const port = process.env.PORT
const databaseConnect = require('./src/config/db')
databaseConnect()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:4200', // Cambia por tu dominio de frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization' ], // Encabezados personalizados permitidos
};

  // Middleware de CORS
app.use(cors(corsOptions));



app.use('/', api)

app.listen(port, () => {
    console.log(`Servidor conectado en el puerto ${port}`)
})

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'gestiON API',
            version: '1.0.0',
            description: 'API documentation for gestiON, MEAN stack application by the "Footalent - Team26-Noche" team; 2024-2025',
        },
        servers: [
            {
                url: `${process.env.BASE_API_URL}`, // Replace with your server URL
        },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Adjust to the location of your route files
};

// Initialize Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Use Swagger-UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(`swaggerSpec ${process.env.BASE_URL}/api-docs`)
