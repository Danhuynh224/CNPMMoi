# TypeScript Project

Dự án Node.js với Express và Sequelize đã được chuyển đổi sang TypeScript.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Cài đặt TypeScript dependencies:
```bash
npm install --save-dev typescript @types/node @types/express @types/bcrypt @types/body-parser ts-node-dev rimraf
```

## Scripts

- `npm run build`: Biên dịch TypeScript sang JavaScript
- `npm start`: Chạy ứng dụng đã build
- `npm run dev`: Chạy ứng dụng trong chế độ development với hot reload
- `npm run clean`: Xóa thư mục dist

## Cấu trúc dự án

```
src/
├── config/
│   ├── config.json
│   ├── configdb.ts
│   └── viewEngine.ts
├── controllers/
│   └── homeController.ts
├── models/
│   ├── index.ts
│   └── user.ts
├── route/
│   └── web.ts
├── services/
│   └── CRUDService.ts
├── types/
│   └── index.ts
├── views/
│   ├── crud.ejs
│   └── users/
│       ├── findAllUser.ejs
│       └── updateUser.ejs
└── server.ts
```

## TypeScript Features

- **Type Safety**: Tất cả các function và variable đều có type annotations
- **Interface Definitions**: Định nghĩa interface cho User, Request/Response
- **Service Layer**: CRUDService với proper typing
- **Model Definitions**: Sequelize models với TypeScript support

## Chạy ứng dụng

1. Development mode:
```bash
npm run dev
```

2. Production mode:
```bash
npm run build
npm start
```

## Database

Đảm bảo MySQL server đang chạy và có database `node_fullstack` với thông tin đăng nhập:
- Host: localhost
- Username: root
- Password: root

## API Endpoints

- `GET /`: Trang chủ
- `GET /home`: Trang home
- `GET /about`: Trang about
- `GET /crud`: Trang CRUD
- `POST /post-crud`: Tạo user mới
- `GET /get-crud`: Lấy danh sách users
- `GET /edit-crud`: Trang edit user
- `POST /put-crud`: Cập nhật user
- `GET /delete-crud`: Xóa user
