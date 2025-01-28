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


const corsOptions = {
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization' ], 
};

app.use(cors(corsOptions));



app.use('/', api)

app.listen(port, () => {    
})

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
                url: `${process.env.BASE_API_URL}`, 
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
    apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
