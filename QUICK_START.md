# Hướng dẫn Chạy Backend MinhLoc Group

## 🚀 Quick Start

### 1. **Cài đặt Dependencies**
```bash
npm install
```

### 2. **Cấu hình Environment**
```bash
# Copy file env mẫu
cp env.example .env

# Chỉnh sửa file .env với thông tin của bạn
nano .env
```

**Nội dung file .env:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/minhloc_group

# Server
PORT=3000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@minhlocgroup.com
ADMIN_EMAIL=admin@minhlocgroup.com

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. **Chạy Database**
```bash
# Khởi động MongoDB (nếu chưa chạy)
mongod

# Hoặc sử dụng Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. **Seed Dữ liệu Mẫu**
```bash
# Chạy seed data để tạo dữ liệu mẫu
npm run seed
```

### 5. **Chạy Backend**
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 📊 Kiểm tra Backend

### **Health Check**
```bash
curl http://localhost:3000/health
```

### **API Endpoints**
```bash
# Dashboard
curl http://localhost:3000/api/v1/admin/dashboard/overview

# Projects
curl http://localhost:3000/api/v1/client/projects

# Products
curl http://localhost:3000/api/v1/client/products

# News
curl http://localhost:3000/api/v1/client/news
```

## 🔧 Troubleshooting

### **Lỗi kết nối Database**
```bash
# Kiểm tra MongoDB
mongosh
show dbs

# Kiểm tra connection string
echo $MONGODB_URI
```

### **Lỗi TypeScript**
```bash
# Kiểm tra type
npm run type-check

# Fix linting
npm run lint:fix
```

### **Lỗi Port đã sử dụng**
```bash
# Tìm process sử dụng port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

## 📁 Cấu trúc Project

```
backend_minhloc/
├── src/
│   ├── config/          # Cấu hình database, cloudinary
│   ├── controllers/     # Controllers cho admin, client, shared
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── scripts/         # Seed data, utilities
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── dist/                # Compiled JavaScript
├── .env                 # Environment variables
├── package.json         # Dependencies & scripts
└── tsconfig.json        # TypeScript config
```

## 🎯 API Endpoints

### **Admin APIs**
- `GET /api/v1/admin/dashboard/overview` - Dashboard tổng quan
- `GET /api/v1/admin/dashboard/recent-activity` - Hoạt động gần đây
- `GET /api/v1/admin/projects` - Quản lý dự án
- `GET /api/v1/admin/products` - Quản lý sản phẩm
- `GET /api/v1/admin/news` - Quản lý tin tức
- `GET /api/v1/admin/users` - Quản lý người dùng
- `GET /api/v1/admin/contacts` - Quản lý liên hệ
- `GET /api/v1/admin/company` - Thông tin công ty
- `GET /api/v1/admin/careers` - Tuyển dụng
- `GET /api/v1/admin/business-fields` - Lĩnh vực hoạt động

### **Client APIs**
- `GET /api/v1/client/projects` - Danh sách dự án
- `GET /api/v1/client/products` - Danh sách sản phẩm
- `GET /api/v1/client/news` - Danh sách tin tức
- `GET /api/v1/client/company` - Thông tin công ty
- `GET /api/v1/client/careers` - Tuyển dụng
- `GET /api/v1/client/business-fields` - Lĩnh vực hoạt động

### **Shared APIs**
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/uploads` - Upload file
- `GET /api/v1/analytics` - Analytics

## 🗄️ Dữ liệu Mẫu

Sau khi chạy `npm run seed`, bạn sẽ có:

### **Users**
- Admin: `admin@minhlocgroup.com` / `admin123`

### **Projects**
- MinhLoc City (Quận 7) - Đang xây dựng
- MinhLoc Villa (Quận 2) - Hoàn thành

### **Products**
- Nhân sâm Hàn Quốc 6 năm tuổi - Premium
- Nhân sâm Việt Nam 4 năm tuổi - Standard

### **News**
- Tin tức về khởi công dự án
- Tin tức thị trường bất động sản

### **Company Info**
- Thông tin đầy đủ về MinhLoc Group
- Lịch sử, lợi thế cạnh tranh, đối tác
- Hoạt động xã hội

### **Job Positions**
- Nhân viên Kinh doanh Bất động sản
- Chuyên viên Marketing Digital

### **Business Fields**
- Xây dựng
- Đầu tư Tài chính
- Bất động sản

## 🔐 Authentication

### **JWT Token**
```bash
# Login để lấy token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@minhlocgroup.com","password":"admin123"}'

# Sử dụng token trong header
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/v1/admin/dashboard/overview
```

## 📈 Monitoring

### **Logs**
```bash
# Xem logs real-time
npm run dev

# Logs sẽ hiển thị:
# - Server startup
# - Database connection
# - API requests
# - Errors
```

### **Health Check**
```bash
# Kiểm tra server status
curl http://localhost:3000/health

# Response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## 🚀 Production Deployment

### **Build & Start**
```bash
# Build project
npm run build

# Start production server
npm start
```

### **Environment Variables**
```bash
# Production .env
NODE_ENV=production
MONGODB_URI=mongodb://production-server:27017/minhloc_group
PORT=3000
FRONTEND_URL=https://minhlocgroup.com
```

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:

1. **Database connection** - MongoDB có chạy không?
2. **Environment variables** - File .env có đúng không?
3. **Dependencies** - `npm install` đã chạy chưa?
4. **Port availability** - Port 3000 có bị chiếm không?
5. **TypeScript errors** - `npm run type-check`

## 🎉 Kết luận

Backend MinhLoc Group đã sẵn sàng với:
- ✅ **API đầy đủ** cho admin và client
- ✅ **Dữ liệu mẫu** chuẩn chỉnh
- ✅ **Authentication** JWT
- ✅ **Validation** input
- ✅ **Error handling** toàn diện
- ✅ **Documentation** chi tiết

Chạy `npm run dev` và bắt đầu phát triển! 🚀
