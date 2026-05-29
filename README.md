# Crypto & Stock Tracker - Chrome Extension (Manifest V3)

Một tiện ích mở rộng (Chrome Extension) được thiết kế theo phong cách **Clean UI** hiện đại, giúp bạn theo dõi giá các đồng tiền điện tử (Cryptocurrency) và mã cổ phiếu (Việt Nam & Quốc tế) theo thời gian thực ngay trên thanh công cụ của trình duyệt Chrome.

---

## 🌟 Tính năng nổi bật

- **Theo dõi đa thị trường:** Hỗ trợ song song cả tiền điện tử (Crypto) và thị trường chứng khoán (Cổ phiếu Việt Nam sàn HOSE/HNX, cổ phiếu Mỹ sàn NASDAQ/NYSE...).
- **Tìm kiếm thông minh (Auto-Resolution):** Chỉ cần gõ mã viết tắt (Ví dụ: `BTC`, `FPT`, `AAPL`), hệ thống tự động dò tìm và phân giải thành mã chính xác trên Yahoo Finance.
- **Lưu trữ cục bộ:** Danh sách theo dõi được lưu trữ an toàn thông qua Chrome Storage API, tự động tải lại danh sách ưa thích của bạn mỗi khi mở popup.
- **Tự động định dạng tiền tệ:** 
  - Giá cổ phiếu Việt Nam hiển thị theo VND (Ví dụ: `71.600 ₫`).
  * Giá Crypto và cổ phiếu Mỹ hiển thị theo USD (Ví dụ: `$65,230.12`).
- **Giao diện Clean UI tối giản:**
  - Chế độ nền tối (Dark Mode) sang trọng với các hiệu ứng chuyển động vi mô (Micro-animations).
  - Trạng thái kết nối trực tuyến (Pulsing online indicator).
  - Hiệu ứng xoay tròn nút làm mới khi tải dữ liệu.
  - Dễ dàng xóa bớt mã theo dõi chỉ bằng 1 lượt nhấp chuột (hiển thị nút xóa khi di chuột vào thẻ).

---

## 🛠️ Công nghệ sử dụng

- **Core:** HTML5, CSS3 (Vanilla), JavaScript (ES6)
- **API:** Yahoo Finance v8 API (Dữ liệu thời gian thực miễn phí)
- **Extension Platform:** Chrome Extension Manifest V3
- **Storage:** `chrome.storage.local` (Tự động fallback về `localStorage` khi chạy thử nghiệm trên các tab trình duyệt thường).

---

## 🚀 Hướng dẫn cài đặt cục bộ (Developer Mode)

Để chạy thử nghiệm tiện ích này trên trình duyệt Chrome cá nhân của bạn:

1. **Tải mã nguồn:** Tải mã nguồn của dự án này về máy tính và giải nén.
2. **Mở trang quản lý tiện ích:** 
   - Truy cập địa chỉ `chrome://extensions/` trên trình duyệt Chrome.
   * Gạt bật công tắc **Chế độ dành cho nhà phát triển (Developer mode)** ở góc trên cùng bên phải.
3. **Tải mã nguồn đã giải nén:** 
   - Nhấp vào nút **Tải tiện ích đã giải nén (Load unpacked)** ở góc trên bên trái.
   - Chọn thư mục chứa dự án này (thư mục chứa tệp `manifest.json`).
4. **Ghim để sử dụng:** Nhấp vào biểu tượng mảnh ghép trên thanh công cụ, tìm **Crypto & Stock Tracker** và nhấn ghim (Pin) để tiện ích xuất hiện ở thanh công cụ.

---

## 💡 Hướng dẫn nhập mã theo dõi

Hệ thống sử dụng ký hiệu chuẩn của Yahoo Finance để lấy giá. Hãy nhập mã theo quy tắc dưới đây để được hiển thị chính xác nhất:

| Thị trường | Quy tắc nhập | Ví dụ |
| :--- | :--- | :--- |
| **Cổ phiếu Việt Nam** | Thêm đuôi `.VN` ở cuối | `FPT.VN`, `ACB.VN`, `HPG.VN` |
| **Tiền điện tử (Crypto)** | Nhập trực tiếp mã trơn | `BTC`, `ETH`, `SOL` (Tự nhận diện) |
| **Cổ phiếu Mỹ (Quốc tế)** | Nhập trực tiếp mã trơn | `AAPL`, `TSLA`, `MSFT` |

---

## 📄 Bản quyền và Sử dụng

Dự án này được phát triển hoàn toàn miễn phí cho mục đích học tập, nghiên cứu và theo dõi thị trường cá nhân. Chúc bạn đầu tư thành công!
