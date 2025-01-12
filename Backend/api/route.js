// api/api-docs.js
import swaggerUi from "swagger-ui-express";
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
                url: `${process.env.BASE_URL}/api` || 'http://localhost:3001', // Replace with your server URL
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
const swaggerSpec = swaggerJsdoc(swaggerOptions);

const options = {
    swaggerOptions: {
        docExpansion: 'none', // Colapsar encabezados
    },
};


export default async function handler(req, res) {
  if (req.method === "GET") {
    const app = require("express")();
    app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));
    app(req, res);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
