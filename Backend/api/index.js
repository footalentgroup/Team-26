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
    console.log(`Servidor conectado en el puerto ${port}`)
})

const swaggerJsdoc = require('swagger-jsdoc');

// Swagger configuration
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
                url: `/api`, // Replace with your server URL
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

const options = {
    swaggerOptions: {
        docExpansion: 'none', // Colapsar encabezados
    },
};

// Configura Swagger UI con rutas de archivos estáticos
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, options )
);
console.log(`swaggerSpec ${process.env.BASE_URL}/api-docs`)


// Endpoint para servir swagger.json dinámico
app.get('/swagger.json', (req, res) => {
    res.json(swaggerSpec);
  });

// Endpoint para ReDoc
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
  

// try {
//   module.exports.SwaggerUIBundle = require("./swagger-ui-bundle.js")
//   module.exports.SwaggerUIStandalonePreset = require("./swagger-ui-standalone-preset.js")
// } catch(e) {
//   // swallow the error if there's a problem loading the assets.
//   // allows this module to support providing the assets for browserish contexts,
//   // without exploding in a Node context.
//   //
//   // see https://github.com/swagger-api/swagger-ui/issues/3291#issuecomment-311195388
//   // for more information.
// }

// // `absolutePath` and `getAbsoluteFSPath` are both here because at one point,
// // we documented having one and actually implemented the other.
// // They were both retained so we don't break anyone's code.
// module.exports.absolutePath = require("./absolute-path.js")
// module.exports.getAbsoluteFSPath = require("./absolute-path.js")
