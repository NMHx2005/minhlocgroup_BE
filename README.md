# MinhLoc Group Backend API

Backend API cho nền tảng MinhLoc Group - Kết hợp Bất động sản và Sản phẩm Nhân sâm.

## 🚀 Tính năng chính

### 🏢 Bất động sản
- Quản lý dự án bất động sản
- Quản lý mặt bằng dự án
- Tìm kiếm và lọc dự án
- Upload hình ảnh dự án

### 🌿 Sản phẩm Nhân sâm
- Quản lý sản phẩm nhân sâm
- Quản lý danh mục và xuất xứ
- Quản lý kho hàng
- Tìm kiếm sản phẩm

### 📰 Tin tức & Blog
- Quản lý bài viết tin tức
- Quản lý chuyên mục
- Quản lý tags
- SEO optimization

### 👥 Quản lý người dùng
- Hệ thống đăng ký/đăng nhập
- Phân quyền người dùng
- Quản lý vai trò và quyền hạn
- Lịch sử hoạt động

### 📞 Liên hệ & Tư vấn
- Quản lý tin nhắn liên hệ
- Quản lý yêu cầu tư vấn
- Newsletter subscription
- Email marketing

### 📊 Analytics & Báo cáo
- Thống kê tổng quan
- Phân tích traffic
- Báo cáo hiệu suất
- Real-time analytics

## 🛠 Công nghệ sử dụng

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - File storage
- **Nodemailer** - Email service
- **Express Rate Limit** - Rate limiting
- **Helmet** - Security
- **CORS** - Cross-origin requests

## 📁 Cấu trúc thư mục

```
src/
├── config/          # Cấu hình database, cloudinary
├── controllers/     # Controllers cho admin, client, shared
├── middleware/      # Auth, validation, error handling
├── models/          # Mongoose models
│   ├── core/        # Models cơ bản
│   └── advanced/    # Models nâng cao
├── routes/          # API routes
│   ├── admin/       # Admin routes
│   ├── client/      # Client routes
│   └── shared/      # Shared routes
├── services/        # Business logic
│   ├── admin/       # Admin services
│   ├── client/      # Client services
│   └── shared/      # Shared services
├── utils/           # Utility functions
├── types/           # TypeScript types
├── app.ts           # Express app configuration
└── server.ts        # Server entry point
```

## 🚀 Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd backend_minhloc
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình environment
```bash
cp env.example .env
# Chỉnh sửa file .env với thông tin của bạn
```

### 4. Chạy development
```bash
npm run dev
```

### 5. Build production
```bash
npm run build
npm start
```

## 🔧 Cấu hình Environment

Tạo file `.env` từ `env.example` và cấu hình:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=mongodb://localhost:27017/minhloc

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints chính

#### 🔐 Authentication
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/logout` - Đăng xuất
- `POST /auth/refresh-token` - Làm mới token

#### 🏢 Projects (Admin)
- `GET /admin/projects` - Lấy danh sách dự án
- `POST /admin/projects` - Tạo dự án mới
- `PUT /admin/projects/:id` - Cập nhật dự án
- `DELETE /admin/projects/:id` - Xóa dự án

#### 🏢 Projects (Client)
- `GET /client/projects` - Lấy danh sách dự án công khai
- `GET /client/projects/:id` - Lấy chi tiết dự án
- `GET /client/projects/search` - Tìm kiếm dự án

#### 🌿 Products (Admin)
- `GET /admin/products` - Lấy danh sách sản phẩm
- `POST /admin/products` - Tạo sản phẩm mới
- `PUT /admin/products/:id` - Cập nhật sản phẩm
- `DELETE /admin/products/:id` - Xóa sản phẩm

#### 🌿 Products (Client)
- `GET /client/products` - Lấy danh sách sản phẩm công khai
- `GET /client/products/:id` - Lấy chi tiết sản phẩm
- `GET /client/products/search` - Tìm kiếm sản phẩm

#### 📰 News (Admin)
- `GET /admin/news` - Lấy danh sách tin tức
- `POST /admin/news` - Tạo tin tức mới
- `PUT /admin/news/:id` - Cập nhật tin tức
- `DELETE /admin/news/:id` - Xóa tin tức

#### 📰 News (Client)
- `GET /client/news` - Lấy danh sách tin tức công khai
- `GET /client/news/:id` - Lấy chi tiết tin tức
- `GET /client/news/search` - Tìm kiếm tin tức

#### 📞 Contacts
- `POST /client/contacts/messages` - Gửi tin nhắn liên hệ
- `POST /client/contacts/consultation-requests` - Gửi yêu cầu tư vấn
- `POST /client/contacts/newsletter-subscribers` - Đăng ký newsletter

#### 📊 Analytics
- `GET /analytics/overview` - Tổng quan analytics
- `GET /analytics/page-views` - Thống kê lượt xem
- `POST /analytics/track` - Track page view

## 🔒 Authentication

API sử dụng JWT để xác thực. Gửi token trong header:

```bash
Authorization: Bearer <your-jwt-token>
```

Hoặc sử dụng cookie:
```bash
Cookie: accessToken=<your-jwt-token>
```

## 📝 Validation

API sử dụng express-validator để validate dữ liệu đầu vào. Các validation rules được định nghĩa trong `middleware/validation.ts`.

## 🚦 Rate Limiting

API có rate limiting để bảo vệ khỏi spam và abuse:

- **General**: 100 requests/15 minutes
- **Auth**: 5 requests/15 minutes
- **Contact**: 3 requests/hour
- **Newsletter**: 5 requests/hour
- **Upload**: 20 requests/hour

## 🛡 Security

- **Helmet** - Security headers
- **CORS** - Cross-origin protection
- **Rate Limiting** - Request limiting
- **JWT** - Secure authentication
- **Input Validation** - Data validation
- **Error Handling** - Secure error responses

## 📊 Database Models

### Core Models
- **User** - Người dùng
- **Project** - Dự án bất động sản
- **GinsengProduct** - Sản phẩm nhân sâm
- **NewsArticle** - Bài viết tin tức
- **ContactMessage** - Tin nhắn liên hệ
- **Role** - Vai trò người dùng
- **Permission** - Quyền hạn

### Advanced Models
- **FloorPlan** - Mặt bằng dự án
- **GinsengCategory** - Danh mục sản phẩm
- **GinsengOrigin** - Xuất xứ sản phẩm
- **NewsletterSubscriber** - Đăng ký newsletter
- **NewsletterCampaign** - Chiến dịch email
- **ConsultationRequest** - Yêu cầu tư vấn
- **SystemSetting** - Cài đặt hệ thống
- **FileUpload** - File upload
- **ActivityLog** - Lịch sử hoạt động
- **AnalyticsData** - Dữ liệu analytics
- **Banner** - Banner quảng cáo
- **StaticPage** - Trang tĩnh
- **EmailTemplate** - Template email

## 🧪 Testing

```bash
# Chạy tests
npm test

# Chạy tests với coverage
npm run test:coverage

# Chạy tests trong watch mode
npm run test:watch
```

## 📦 Deployment

### Docker
```bash
# Build image
docker build -t minhloc-backend .

# Run container
docker run -p 3000:3000 minhloc-backend
```

### PM2
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/server.js --name minhloc-backend

# Monitor
pm2 monit
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- **Email**: support@minhloc.com
- **Phone**: +84 123 456 789
- **Website**: https://minhloc.com

## 🙏 Acknowledgments

- Express.js team
- MongoDB team
- TypeScript team
- All contributors
