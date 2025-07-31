import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JagaKota API Documentation',
      version: '1.0.0',
      description: 'Dokumentasi API JagaKota.',
    },
    servers: [
      {
        url: 'http://localhost:9000',
      },
    ],
  },
  apis: ['./src/routes/routes.js'],
};

export const swaggerSpec = swaggerJSDoc(options);