const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products API - Ocean Professional',
      version: '1.0.0',
      description:
        'A modern, minimalist REST API for managing products. Accents: Blue (#2563EB) & Amber (#F59E0B).',
      contact: {
        name: 'Products Backend',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local',
      },
    ],
    tags: [
      { name: 'Health', description: 'Service vitality checks' },
      { name: 'Products', description: 'CRUD operations for products' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
