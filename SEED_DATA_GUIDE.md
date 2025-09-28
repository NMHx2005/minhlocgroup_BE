# Hướng dẫn Seed Data - MinhLoc Group Backend

## Tổng quan
File `seedData.ts` chứa dữ liệu mẫu chuẩn chỉnh cho toàn bộ hệ thống MinhLoc Group, bao gồm:

## Cấu trúc dữ liệu

### 1. **Người dùng & Phân quyền**
- **Roles**: super_admin, admin, editor, user
- **Permissions**: 11 quyền cơ bản cho các module
- **Users**: 1 admin user mặc định

### 2. **Sản phẩm Nhân sâm**
- **Categories**: 4 danh mục (Hàn Quốc, Việt Nam, Mỹ, Sâm củ)
- **Origins**: 3 xuất xứ (Hàn Quốc, Việt Nam, Mỹ)
- **Products**: 2 sản phẩm mẫu với đầy đủ thông tin

### 3. **Dự án Bất động sản**
- **Projects**: 2 dự án mẫu (MinhLoc City, MinhLoc Villa)
- **FloorPlans**: Sẽ được tạo tự động khi có dự án

### 4. **Tin tức & Nội dung**
- **NewsCategories**: 3 chuyên mục tin tức
- **NewsArticles**: 2 bài viết mẫu
- **Banners**: 2 banner quảng cáo

### 5. **Thông tin Công ty**
- **CompanyInfo**: Thông tin đầy đủ về MinhLoc Group
  - General: Tên, slogan, mô tả, logo
  - History: Lịch sử phát triển
  - Competitive Advantages: Lợi thế cạnh tranh
  - System: Hệ thống và thống kê
  - Partners: Đối tác
  - Social Activities: Hoạt động xã hội

### 6. **Tuyển dụng**
- **JobPositions**: 2 vị trí tuyển dụng mẫu
- **JobApplications**: Sẽ được tạo khi có ứng viên

### 7. **Lĩnh vực Hoạt động**
- **BusinessFields**: 3 lĩnh vực chính
  - Xây dựng
  - Đầu tư Tài chính
  - Bất động sản

### 8. **Hệ thống**
- **SystemSettings**: 7 cài đặt cơ bản
- **ContactMessages**: 2 tin nhắn liên hệ mẫu

## Cách sử dụng

### 1. **Chạy Seed Data**
```bash
# Chạy seed data
npm run seed

# Hoặc chạy với ts-node trực tiếp
npm run seed:dev
```

### 2. **Xóa dữ liệu cũ**
Script sẽ tự động xóa tất cả dữ liệu cũ trước khi tạo dữ liệu mới.

### 3. **Tạo dữ liệu mới**
Script sẽ tạo dữ liệu theo thứ tự:
1. Permissions → Roles → Users
2. Categories → Origins → Products
3. Projects → News → Contacts
4. Company Info → Job Positions → Business Fields
5. System Settings → Banners

## Dữ liệu mẫu chi tiết

### **Admin User**
- Email: `admin@minhlocgroup.com`
- Password: `admin123` (đã hash)
- Role: `admin`

### **Dự án Bất động sản**
1. **MinhLoc City** (Quận 7)
   - Loại: Căn hộ chung cư
   - Giá: 2.5-5 tỷ VND
   - Diện tích: 50-120 m²
   - Trạng thái: Đang xây dựng

2. **MinhLoc Villa** (Quận 2)
   - Loại: Biệt thự
   - Giá: 8-15 tỷ VND
   - Diện tích: 200-500 m²
   - Trạng thái: Hoàn thành

### **Sản phẩm Nhân sâm**
1. **Nhân sâm Hàn Quốc 6 năm tuổi**
   - Cấp độ: Premium
   - Trọng lượng: 50g
   - Giá: 2.5 triệu VND
   - Giá khuyến mãi: 2.2 triệu VND

2. **Nhân sâm Việt Nam 4 năm tuổi**
   - Cấp độ: Standard
   - Trọng lượng: 30g
   - Giá: 1.2 triệu VND

### **Tin tức**
1. **MinhLoc Group khởi công dự án mới**
2. **Thị trường bất động sản TP.HCM tăng trưởng mạnh**

### **Vị trí Tuyển dụng**
1. **Nhân viên Kinh doanh Bất động sản**
   - Lương: 15-25 triệu VND
   - Kinh nghiệm: 1-3 năm
   - Trạng thái: Hot job

2. **Chuyên viên Marketing Digital**
   - Lương: 12-20 triệu VND
   - Kinh nghiệm: 2-5 năm
   - Trạng thái: Urgent

## Lưu ý quan trọng

### **Mối quan hệ dữ liệu**
- Tất cả dữ liệu được liên kết chặt chẽ
- Products → Categories & Origins
- News → NewsCategories
- Tất cả có createdBy/updatedBy = Admin User

### **SEO & Metadata**
- Tất cả sản phẩm, dự án, tin tức đều có SEO fields
- Slug được tạo tự động
- Keywords và descriptions được tối ưu

### **Hình ảnh**
- Tất cả hình ảnh đều có đường dẫn mẫu
- Cần thay thế bằng hình ảnh thực tế khi deploy

### **Cài đặt hệ thống**
- Site name, description, contact info
- Social media links
- Maintenance mode settings

## Troubleshooting

### **Lỗi kết nối database**
```bash
# Kiểm tra file .env
cat .env

# Đảm bảo MongoDB đang chạy
mongosh
```

### **Lỗi import modules**
```bash
# Cài đặt dependencies
npm install

# Build project
npm run build
```

### **Lỗi TypeScript**
```bash
# Kiểm tra type
npm run type-check

# Fix linting
npm run lint:fix
```

## Mở rộng dữ liệu

### **Thêm sản phẩm mới**
```typescript
const newProduct = {
    name: 'Tên sản phẩm',
    slug: 'ten-san-pham',
    // ... các field khác
    categoryId: createdGinsengCategories[0]._id,
    originId: createdGinsengOrigins[0]._id,
    createdBy: adminUser._id,
    updatedBy: adminUser._id
};
```

### **Thêm dự án mới**
```typescript
const newProject = {
    name: 'Tên dự án',
    slug: 'ten-du-an',
    // ... các field khác
    createdBy: adminUser._id,
    updatedBy: adminUser._id
};
```

## Kết luận

Dữ liệu seed này cung cấp:
- ✅ **Dữ liệu đầy đủ** cho tất cả models
- ✅ **Mối quan hệ chính xác** giữa các entities
- ✅ **SEO tối ưu** cho tất cả content
- ✅ **Dữ liệu thực tế** phù hợp với business
- ✅ **Cấu trúc chuẩn** dễ mở rộng

Chạy `npm run seed` để tạo dữ liệu mẫu cho hệ thống!
