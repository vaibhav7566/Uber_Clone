import swaggerJsdoc from "swagger-jsdoc";        // swagger-jsdoc: A tool that generates Swagger documentation from JSDoc comments in your code.
import { env } from './env.js';

// Get port from environment or use default 4000
const port = env.PORT;
const serverUrl = `http://localhost:${port}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Uber Clone API',
      version: '1.0.0',
      description: 'Complete API documentation for the Uber Clone backend service',
      contact: {
        name: 'API Support',
        email: 'support@uberclone.com'
      }
    },
    servers: [
      {
        url: serverUrl,
        description: `Development server (Port: ${port})`
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints (signup and login)'
      },
      {
        name: 'Profile',
        description: 'User profile management endpoints'
      }
    ]
  },

  apis: [
    './src/modules/auth/auth.controllers.js',
    './src/modules/profile/profile.controllers.js',
    './src/modules/driver/driver.controllers.js'
  ]

// apis: [
//   './src/modules/auth/*.js',
//   './src/modules/profile/*.js'
// ]

// apis: ['./src/modules/**/*.js'] // This will include all .js files in the modules directory and its subdirectories, ensuring that all your controllers with Swagger comments are included in the documentation.

};

export const swaggerSpec = swaggerJsdoc(options);