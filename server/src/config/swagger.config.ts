// server/src/config/swagger.config.ts
import swaggerJSDoc from 'swagger-jsdoc';
import { envConfig } from './env.config';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Coffee Management System API',
      version: '1.0.0',
      description: 'Tài liệu API cho Hệ thống Quản lý Chuỗi Cà phê (Coffee Shop DBMS Project)',
      contact: {
        name: 'Đội ngũ phát triển',
      },
    },
    servers: [
      {
        url: `http://localhost:${envConfig.PORT}/api/v1`,
        description: 'Local Development Server (v1)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập access token nhận được sau khi đăng nhập (không cần gõ chữ Bearer)',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Quét toàn bộ file routes để đọc ghi chú Swagger JSDoc
  apis: ['./src/modules/**/*.routes.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);