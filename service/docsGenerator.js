'use strict';
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotels nearby API',
      description: `RESTful API for getting hotels info`,
      contact: {
        name: 'eugenesqr',
        url: 'https://eugenesqr.com/en',
      },
      licence: {
        name: 'GNU GPL3',
      },
    },
  },
  apis: ['index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = function(app, route) {
  app.use(route, swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
