# BTVN Nhóm 2 - Tích hợp thanh toán VNPAY bằng Spring Boot

- MSSV: 23110171
- Họ tên: Lê Hữu Văn
- Backend: Spring Boot 3.3.5
- Frontend: Thymeleaf + HTML/CSS
- Database demo: H2 in-memory

## 1. Chức năng đã làm

- Trang chủ có form nhập số tiền và nút **Thanh toán qua VNPAY**.
- Backend tạo Payment URL theo chuẩn VNPAY Sandbox.
- Tự tạo `vnp_SecureHash` bằng thuật toán `HmacSHA512` với `vnp_HashSecret`.
- Redirect người dùng sang cổng thanh toán VNPAY Sandbox.
- Có trang `/vnpay-return` để nhận kết quả trả về và hiển thị:
  - Mã đơn hàng
  - Số tiền
  - Ngân hàng thanh toán
  - Mã giao dịch VNPAY
  - Mã giao dịch ngân hàng
  - Thời gian thanh toán
  - Mã phản hồi
  - Trạng thái giao dịch
- Có endpoint `/api/vnpay-ipn` để nhận webhook/IPN từ VNPAY và cập nhật trạng thái đơn hàng.
- Có kiểm tra chữ ký bảo mật khi nhận Return URL và IPN.
- Có lưu trạng thái đơn hàng trong H2 Database.

## 2. Cấu hình VNPAY Sandbox

Không được đẩy `TmnCode` và `HashSecret` thật lên GitHub. Khi chạy local, cấu hình bằng biến môi trường:

### Windows PowerShell

```powershell
$env:VNPAY_TMN_CODE="MA_TMN_CODE_CUA_BAN"
$env:VNPAY_HASH_SECRET="HASH_SECRET_CUA_BAN"
$env:VNPAY_RETURN_URL="https://your-ngrok-url.ngrok-free.app/vnpay-return"
```

### macOS/Linux

```bash
export VNPAY_TMN_CODE="MA_TMN_CODE_CUA_BAN"
export VNPAY_HASH_SECRET="HASH_SECRET_CUA_BAN"
export VNPAY_RETURN_URL="https://your-ngrok-url.ngrok-free.app/vnpay-return"
```
### .env
``` .env
VNPAY_TMN_CODE="MA_TMN_CODE_CUA_BAN"
VNPAY_HASH_SECRET="HASH_SECRET_CUA_BAN"
VNPAY_RETURN_URL="https://your-ngrok-url.ngrok-free.app/vnpay-return"
```

Nếu chưa có tài khoản sandbox, đăng ký tại trang developer sandbox của VNPAY rồi lấy `TmnCode` và `HashSecret` được gửi về email.

## 3. Chạy project

Yêu cầu máy có Java 21 và Maven.

```bash
mvn spring-boot:run
```

Mở trình duyệt:

```text
http://localhost:8080
```

H2 console:

```text
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:vnpaydb
User: sa
Password: để trống
```

## 4. Chạy với Ngrok

Chạy app Spring Boot ở port 8080, sau đó mở terminal khác:

```bash
ngrok http 8080
```

Lấy HTTPS forwarding URL của Ngrok, ví dụ:

```text
https://abc123.ngrok-free.app
```

Cập nhật biến môi trường:

```bash
export VNPAY_RETURN_URL="https://abc123.ngrok-free.app/vnpay-return"
```

Trong trang cấu hình merchant của VNPAY, cấu hình IPN URL là:

```text
https://abc123.ngrok-free.app/api/vnpay-ipn
```

## 5. Cấu trúc project

```text
src/main/java/com/lehuuvan/vnpaydemo
├── config/VnpayProperties.java
├── controller/PaymentController.java
├── dto/CreatePaymentRequest.java
├── dto/IpnResponse.java
├── model/OrderStatus.java
├── model/PaymentOrder.java
├── repository/PaymentOrderRepository.java
├── service/PaymentService.java
└── util/VnpayUtil.java
```
