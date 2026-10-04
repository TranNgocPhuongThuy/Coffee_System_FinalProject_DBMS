// server/swagger-gen.cjs
const fs = require('fs');
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Coffee Management System API',
    version: '1.0.0',
    description: 'Hệ thống Quản lý Chuỗi Cà phê - Project DBMS',
  },
  servers: [
    {
      url: 'http://localhost:5000', // Giữ nguyên để khớp với đường dẫn /api/v1/...
      description: 'Local Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Dán Access Token (không cần chữ Bearer)',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const outputFile = './src/config/swagger.json';
const routes = ['./src/app.ts'];

// 1. Chạy sinh file swagger tự động
swaggerAutogen(outputFile, routes, doc).then(() => {
  // 2. Đọc lại file JSON vừa tạo và tự động phân nhóm Tags theo tiền tố Route
  const rawData = fs.readFileSync(outputFile, 'utf8');
  const swaggerData = JSON.parse(rawData);

  for (const path in swaggerData.paths) {
    let tag = 'General';

    // Phân loại nhóm theo tiền tố URL
    if (path.includes('/auth')) tag = '1. Authentication';
    else if (path.includes('/pos')) tag = '2. POS & Pager Devices';
    else if (path.includes('/menu')) tag = '3. Menu Catalog';
    else if (path.includes('/inventory')) tag = '4. Inventory & BOM';
    else if (path.includes('/kds')) tag = '5. KDS (Bếp & Pha chế)';
    else if (path.includes('/loyalty')) tag = '6. Customer & Loyalty';
    else if (path.includes('/reports')) tag = '7. Reports & Analytics';
    else if (path.includes('/health')) tag = 'System Health';

    const methods = swaggerData.paths[path];
    for (const method in methods) {
      if (methods[method] && typeof methods[method] === 'object') {
        methods[method].tags = [tag]; // Gán lại tag thay vì để 'default'
      }
    }
  }

  // 3. Ghi đè lại file swagger.json đã phân loại hoàn chỉnh
  fs.writeFileSync(outputFile, JSON.stringify(swaggerData, null, 2), 'utf8');
  console.log('✅ Đã tự động phân nhóm Tags (thư mục) theo route thành công!');
});