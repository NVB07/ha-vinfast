# Hướng dẫn cấu hình Nodemailer

## Cài đặt

Nodemailer đã được cài đặt trong project. Nếu chưa có, chạy lệnh:

```bash
npm install nodemailer @types/nodemailer
```

## Cấu hình biến môi trường

Tạo file `.env.local` trong thư mục gốc của project và thêm các biến sau:

### 1. Gmail (Khuyến nghị)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_TO=recipient@example.com
```

**Lưu ý:** Với Gmail, bạn cần tạo "App Password" thay vì mật khẩu thông thường:

1. Vào [Google Account](https://myaccount.google.com/)
2. Security → 2-Step Verification (bật nếu chưa bật)
3. App passwords → Tạo app password mới
4. Chọn "Mail" và "Other (Custom name)"
5. Copy password và dán vào `SMTP_PASSWORD`

### 2. Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@outlook.com
SMTP_TO=recipient@example.com
```

### 3. SMTP Server tùy chỉnh

```env
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@yourdomain.com
SMTP_TO=recipient@example.com
```

**Lưu ý:**

- `SMTP_PORT=587` cho TLS (khuyến nghị)
- `SMTP_PORT=465` cho SSL (cần set `secure: true` trong code)
- `SMTP_PORT=25` cho unencrypted (không khuyến nghị)

## Giải thích các biến

- **SMTP_HOST**: Địa chỉ SMTP server (ví dụ: smtp.gmail.com)
- **SMTP_PORT**: Cổng SMTP (thường là 587 cho TLS hoặc 465 cho SSL)
- **SMTP_USER**: Email đăng nhập SMTP
- **SMTP_PASSWORD**: Mật khẩu hoặc App Password
- **SMTP_FROM**: Email người gửi (thường giống SMTP_USER)
- **SMTP_TO**: Email người nhận (email sẽ nhận form liên hệ)

## Kiểm tra cấu hình

Sau khi cấu hình, restart server:

```bash
npm run dev
```

Sau đó thử gửi form liên hệ trên trang `/contact`. Nếu có lỗi, kiểm tra console log để xem chi tiết.

## Troubleshooting

### Lỗi "Invalid login"

- Kiểm tra lại `SMTP_USER` và `SMTP_PASSWORD`
- Với Gmail, đảm bảo đã dùng App Password, không phải mật khẩu thông thường

### Lỗi "Connection timeout"

- Kiểm tra `SMTP_HOST` và `SMTP_PORT` có đúng không
- Kiểm tra firewall/antivirus có chặn kết nối không

### Lỗi "Authentication failed"

- Với Gmail: Đảm bảo đã bật 2-Step Verification và dùng App Password
- Với Outlook: Đảm bảo mật khẩu đúng và tài khoản không bị khóa
