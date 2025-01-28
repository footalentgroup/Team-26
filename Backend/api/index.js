const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const api = require('../src/routes/api.routes')
const serveStatic = require('serve-static');
const swaggerUi = require('swagger-ui-express');

dotenv.config();
const port = process.env.PORT
const databaseConnect = require('../src/config/db');
databaseConnect()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use('/', api)

app.listen(port, () => {
    
})

const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'gestiON API',
            version: '1.0.0',
            description: 'API documentation for gestiON, MEAN stack application by the "Footalent - Team26-Nioche" team; 2024-2025',
        },
        servers: [
            {
                url: `/api`, 
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

const options = {
    swaggerOptions: {
        docExpansion: 'none', 
    },
};

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, options )
);


app.get('/swagger.json', (req, res) => {
    res.json(swaggerSpec);
  });

app.get('/redoc', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>ReDoc</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,700|Roboto+Mono:400,700">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Material+Icons">
      </head>
      <body>
        <redoc spec-url='/swagger.json'></redoc>
        <script src="https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js"></script>
      </body>
      </html>
    `);
  });
  