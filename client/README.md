# KIẾN TRÚC & CƠ CẤU THƯ MỤC DỰ ÁN CLIENT (FRONTEND)
> **Coffee Management System - Frontend Web Application**  
> Dự án được xây dựng trên nền tảng **Next.js 16 (App Router)**, **React 19**, **TypeScript** và **Tailwind CSS v4**.

---

## 📌 Tổng quan kiến trúc thư mục `/client`

Cấu trúc mã nguồn của `/client` được thiết kế theo hướng **Modular Architecture & Domain-Driven Structure**, phân tách rõ ràng giữa tầng giao diện (UI), tầng quản lý trạng thái (State/Context), tầng dịch vụ mạng (API Service) và tầng định tuyến phân quyền (RBAC / Middleware).

```
client/
├── .gitignore               # Cấu hình bỏ qua các file không cần commit lên Git
├── README.md                # Tài liệu giải thích kiến trúc và vai trò các thư mục
├── middleware.ts            # Middleware kiểm soát Route Guard & Phân quyền RBAC
├── next.config.ts           # Cấu hình Next.js
├── package.json             # Danh sách dependencies & scripts chạy dự án
├── tsconfig.json            # Cấu hình TypeScript & path alias (@/*)
├── tailwind.config.ts       # Cấu hình Tailwind CSS
├── postcss.config.mjs       # Cấu hình PostCSS
│
├── api/                     # Lớp giao tiếp API Backend (Network & Services)
├── app/                     # Hệ thống trang & định tuyến (Next.js App Router)
├── components/              # Thư viện UI Components (Dùng chung & theo nghiệp vụ)
├── constants/               # Các hằng số, cấu hình phân quyền và lưu trữ
├── context/                 # Quản lý trạng thái toàn cục (React Context API)
├── hooks/                   # Các Custom React Hooks tái sử dụng
├── public/                  # Tài nguyên tĩnh (Hình ảnh, SVG, Logo, Icons)
├── types/                   # Định nghĩa kiểu dữ liệu TypeScript (Interfaces, Types, Enums)
└── utils/                   # Các hàm tiện ích thuần túy (Formatters, Validators, Storage)
```

---

## 📂 Chi tiết chức năng, nhiệm vụ và vai trò từng thư mục

### 1. 🌐 Thư mục `api/` (API Client & Service Layer)
* **Vai trò:** Đóng vai trò là cầu nối giao tiếp duy nhất giữa Frontend và Backend RESTful API.
* **Chức năng & Nhiệm vụ:**
  - Khởi tạo và cấu hình Axios Client (`client.ts`) với `baseURL`, timeout, và các HTTP Interceptors.
  - **Request Interceptor:** Tự động lấy JWT Access Token từ Cookies và gắn vào header `Authorization: Bearer <token>`.
  - **Response Interceptor:** Bắt lỗi tập trung (centralized error handling), chuẩn hóa thông báo lỗi từ server, và tự động xử lý khi nhận mã lỗi `401 Unauthorized` (xóa phiên đăng nhập, điều hướng về `/login`).
  - Quản lý danh mục các endpoints backend tập trung (`endpoints.ts`).
  - Phân tách các API Service theo từng phân hệ nghiệp vụ cụ thể.
* **Các file thành phần:**
  | Tệp | Chức năng chính |
  | :--- | :--- |
  | `client.ts` | Axios instance với Interceptors cho Token & Error Handling |
  | `endpoints.ts` | Danh sách URL API Backend tập trung |
  | `index.ts` | Barrel file xuất toàn bộ các service |
  | `auth.service.ts` | Gọi API Đăng nhập, Đăng ký, Đổi mật khẩu, Cài đặt mật khẩu |
  | `pos.service.ts` | Tạo đơn hàng POS, thanh toán hóa đơn, tra cứu đơn hàng |
  | `menu.service.ts` | Lấy và thao tác CRUD Sản phẩm, Danh mục, Topping/Size |
  | `inventory.service.ts`| Quản lý Nguyên vật liệu, Phiếu nhập kho, Công thức định lượng (BOM), Phiếu điều chỉnh kho |
  | `kds.service.ts` | Tương tác Bếp/Bar: Lấy hàng đợi chế biến, cập nhật trạng thái món |
  | `loyalty.service.ts` | Quản lý Khách hàng, Hạng thành viên, Lịch sử tích điểm, Phân vai trò |
  | `pager.service.ts` | Quản lý Thẻ rung (Pager): gán thẻ cho đơn, đổi trạng thái, kích hoạt rung |
  | `report.service.ts` | Lấy dữ liệu báo cáo doanh số, thống kê sản phẩm, xuất file báo cáo |

---

### 2. 🧭 Thư mục `app/` (Next.js App Router & Routing System)
* **Vai trò:** Định nghĩa cấu trúc trang web, hệ thống URL (routing), layout tổng thể và luồng điều hướng của toàn bộ hệ thống.
* **Chức năng & Nhiệm vụ:**
  - Ứng dụng mô hình **App Router** của Next.js (thư mục tương ứng với đường dẫn URL).
  - Phân chia các Route Groups `(auth)` để tách biệt layout đăng nhập khỏi giao diện quản trị.
  - Cung cấp Root Layout (`layout.tsx`), trang lỗi (`error.tsx`, `GlobalError.tsx`), màn hình chờ (`loading.tsx`), và trang 404 (`not-found.tsx`).
* **Cấu trúc phân hệ trang:**
  - **`(auth)/` (Phân hệ xác thực):** 
    - `/login`: Đăng nhập hệ thống theo tài khoản và vai trò.
    - `/register`: Đăng ký tài khoản nhân viên / khách hàng mới.
    - `/change-password`: Đổi mật khẩu định kỳ.
    - `/setup-password`: Thiết lập mật khẩu cho tài khoản mới kích hoạt.
  - **`dashboard/` (Phân hệ Quản trị & Điều hành - Dành cho Admin / Manager):**
    - `page.tsx`: Màn hình tổng quan KPI, trạng thái cửa hàng hôm nay.
    - `customers/`: Danh sách khách hàng, thông tin cá nhân `[id]`, và lịch sử giao dịch tích điểm (`transactions`).
    - `inventory/`: Quản lý kho nguyên vật liệu:
      - `ingredients/`: Danh mục nguyên vật liệu, đơn vị tính, mức tồn tối thiểu.
      - `imports/`: Danh sách phiếu nhập hàng, tạo phiếu nhập mới (`new`), chi tiết phiếu (`[id]`).
      - `boms/`: Định lượng công thức thành phần (Bill of Materials) cho từng món.
      - `adjustments/`: Phiếu kiểm kê và cân bằng điều chỉnh tồn kho thực tế.
    - `menu/`: Quản trị thực đơn gồm Danh mục (`categories`), Sản phẩm (`products`, thêm mới `new`, chi tiết `[id]`), và `toppings`.
    - `pagers/`: Theo dõi danh sách và tình trạng toàn bộ thẻ rung trong quán.
    - `reports/`: Phân tích doanh thu, sản phẩm bán chạy, xuất báo cáo tài chính.
  - **`pos/` (Phân hệ Thu ngân - Bán hàng tại quầy - Dành cho Cashier):**
    - `terminal/`: Màn hình bán hàng chính (chọn món, cấu hình đá/đường/topping, giỏ hàng, chọn khách hàng, chọn thanh toán tiền mặt/chuyển khoản, gán thẻ rung).
    - `orders/`: Danh sách hóa đơn bán lẻ trong ca, xem lại chi tiết hóa đơn `[id]`.
    - `pagers/`: Quản lý phát thẻ, gọi rung và thu hồi thẻ rung tại quầy.
  - **`kds/` (Phân hệ Màn hình bếp pha chế - Dành cho Barista/Kitchen):**
    - `queue/`: Màn hình thời gian thực hiển thị danh sách các món cần pha chế theo thứ tự order, hỗ trợ đánh dấu hoàn thành và tra cứu công thức pha chế.

---

### 3. 🧩 Thư mục `components/` (UI Component Library)
* **Vai trò:** Chứa toàn bộ các thành phần giao diện (React UI Components), chia thành cấp dùng chung (common) và cấp module nghiệp vụ (domain-specific).
* **Chức năng & Nhiệm vụ:**
  - Chuẩn hóa giao diện người dùng theo Design System nhất quán.
  - Giúp mã nguồn tại các trang `page.tsx` trở nên tinh gọn, dễ đọc, dễ bảo trì.
  - Ngăn ngừa tình trạng duplicate code giao diện.
* **Chi tiết các nhóm component:**
  - **`common/` (Atomic UI Components):**
    - `Button.tsx`, `Input.tsx`, `Badge.tsx`: Các phần tử giao diện nhập liệu và nút bấm chuẩn.
    - `Modal.tsx`, `Drawer.tsx`, `ConfirmModal.tsx`: Hộp thoại popup và ngăn kéo hiển thị chi tiết hoặc form xác nhận.
    - `Table.tsx`: Bảng dữ liệu có phân trang, định dạng cột.
    - `Loading.tsx`, `EmptyState.tsx`, `ErrorState.tsx`: Xử lý các trạng thái tải, trống dữ liệu và báo lỗi.
  - **`layout/` (Khung giao diện):**
    - `Header.tsx`, `Sidebar.tsx`: Thanh điều hướng và menu chức năng cho trang Dashboard.
    - `PosHeader.tsx`: Thanh công cụ riêng cho thu ngân (thông tin ca, ca làm việc, đồng hồ, đăng xuất).
    - `KdsHeader.tsx`: Thanh trạng thái hiển thị số lượng order đang chờ pha chế.
  - **`pos/` (Thành phần trạm bán hàng):**
    - `CartSidebar.tsx`: Cột giỏ hàng bên phải, hiển thị danh sách món chọn, tính tiền, giảm giá.
    - `ProductGrid.tsx`: Lưới hiển thị danh sách món ăn/nước uống theo nhóm danh mục.
    - `ProductOptionModal.tsx`: Modal tùy chọn món (chọn Size, % Đường, % Đá, Topping đi kèm, Ghi chú pha chế).
    - `QuickCreateCustomerModal.tsx`: Tạo nhanh khách hàng mới ngay khi đứng quầy.
    - `OrderDetailDrawer.tsx`: Xem lại chi tiết món trong hóa đơn.
    - `PrintReceiptModal.tsx`: Xem trước và in hóa đơn tạm tính/hóa đơn thanh toán.
    - `CancelOrderModal.tsx`: Modal hủy đơn có nhập lý do.
  - **`inventory/` (Quản lý kho):**
    - `IngredientFormModal.tsx`: Thêm/sửa thông tin nguyên vật liệu.
    - `CreateImportTicketModal.tsx`, `ImportDetailDrawer.tsx`: Lập và xem chi tiết phiếu nhập nguyên vật liệu.
    - `AddBOMIngredientModal.tsx`: Gán nguyên vật liệu vào công thức món.
    - `InventoryAdjustmentModal.tsx`: Tạo phiếu kiểm kho cân bằng nguyên liệu thực tế.
  - **`kds/` (Bếp & Pha chế):**
    - `KDSTicketCard.tsx`: Thẻ hiển thị một đơn món cần làm (thời gian chờ, món, ghi chú, trạng thái).
    - `QuickRecipeModal.tsx`: Bảng tra cứu công thức pha chế nhanh ngay tại quầy bar.
  - **`loyalty/` (Khách hàng & Thành viên):**
    - `CustomerProfileDrawer.tsx`: Hồ sơ chi tiết khách hàng, tích điểm, hạn thẻ.
    - `CustomerFormModal.tsx`: Biểu mẫu thêm/sửa khách hàng.
    - `AdjustPointsModal.tsx`: Modal cộng/trừ điểm thủ công với lý do nghiệp vụ.
    - `AssignRoleModal.tsx`: Phân vai trò quyền hạn cho tài khoản.
  - **`menu/` (Quản trị thực đơn):**
    - `MenuNavTabs.tsx`: Tabs chuyển đổi nhanh giữa Sản phẩm, Danh mục, Topping.
    - `ProductFormModal.tsx`, `CategoryFormModal.tsx`, `ToppingFormModal.tsx`: Biểu mẫu CRUD cho món, nhóm món và topping.
  - **`reports/` (Báo cáo thống kê):**
    - `RevenueBarChart.tsx`: Biểu đồ cột hiển thị xu hướng doanh thu theo ngày/tháng.
    - `RevenueSummaryCards.tsx`: Các thẻ tóm tắt tổng doanh số, số hóa đơn, giá trị đơn trung bình.
    - `ExportReportModal.tsx`: Modal chọn khoảng ngày và định dạng xuất báo cáo.

---

### 4. 🏷️ Thư mục `constants/` (Constants & Configuration)
* **Vai trò:** Nơi tập trung toàn bộ các giá trị cấu hình tĩnh, khóa định danh và hằng số của hệ thống.
* **Chức năng & Nhiệm vụ:**
  - Tránh tình trạng hardcode chuỗi hoặc số rải rác trong code base (magic strings / numbers).
  - Định nghĩa chính sách phân quyền truy cập theo vai trò.
* **Các file thành phần:**
  - `roles.ts`: Định nghĩa danh sách vai trò (`ADMIN`, `MANAGER`, `CASHIER`, `BARISTA`, `CUSTOMER`), bảng ánh xạ trang mặc định theo vai trò (`ROLE_DEFAULT_ROUTES`), và ma trận kiểm tra quyền truy cập route (`isRouteAllowed`).
  - `routes.ts`: Danh mục các đường dẫn nội bộ trong ứng dụng.
  - `storage.ts`: Danh sách các khóa lưu trữ trong Cookie và LocalStorage (`ACCESS_TOKEN`, `ROLE`, `USER_DATA`,...).

---

### 5. 🔄 Thư mục `context/` (Global State Management)
* **Vai trò:** Quản lý và phân phối trạng thái dữ liệu dùng chung (Global State) trên toàn ứng dụng bằng React Context API.
* **Chức năng & Nhiệm vụ:**
  - Tránh truyền thuộc tính qua nhiều cấp trung gian (prop-drilling).
  - Đảm bảo tính phản hồi tức thì giữa các component khác nhau trên cùng một trang.
* **Các Context chính:**
  - `AuthContext.tsx`: Quản lý phiên đăng nhập hiện tại, dữ liệu User, vai trò (role), hàm `login()`, `logout()`, đồng bộ hóa Token vào Cookie và LocalStorage.
  - `CartContext.tsx`: Quản lý trạng thái giỏ hàng trạm POS: thêm món, đổi size/topping, tăng giảm số lượng, gắn thông tin khách hàng, chiết khấu, xóa giỏ hàng, tính tổng tiền tức thời.
  - `ToastContext.tsx`: Cung cấp cơ chế hiển thị thông báo nổi (Toast notifications) dạng `success`, `error`, `warning`, `info` trên toàn hệ thống.

---

### 6. 🪝 Thư mục `hooks/` (Custom React Hooks)
* **Vai trò:** Tách biệt và tái sử dụng các logic phức tạp, logic có trạng thái (Stateful Logic) giữa các React Component.
* **Chức năng & Nhiệm vụ:**
  - Cung cấp cách tiếp cận tiện lợi, an toàn kiểu dữ liệu (Type-Safe) để đọc Context.
  - Xử lý các tác vụ tối ưu hóa hiệu năng giao diện.
* **Các Hooks tiêu biểu:**
  - `useAuth.ts`: Trích xuất nhanh thông tin người dùng và quyền hạn từ `AuthContext`.
  - `useCart.ts`: Truy cập nhanh giỏ hàng POS và các hành động thao tác giỏ hàng từ `CartContext`.
  - `useDebounce.ts`: Hoãn việc kích hoạt tìm kiếm khi người dùng đang nhập liệu (search debounce), giúp giảm số lượng request gửi về Backend.

---

### 7. 📦 Thư mục `types/` (TypeScript Type Definitions)
* **Vai trò:** Định nghĩa hệ thống kiểu dữ liệu (Type System) cho toàn bộ ứng dụng Frontend, đảm bảo tính Type Safety tuyệt đối.
* **Chức năng & Nhiệm vụ:**
  - Đồng bộ cấu trúc dữ liệu với Database và DTO của Backend.
  - Hỗ trợ IDE gợi ý mã (IntelliSense) và phát hiện lỗi ngay trong quá trình viết code (Compile Time).
* **Các file thành phần:**
  | Tệp | Định nghĩa kiểu dữ liệu |
  | :--- | :--- |
  | `api.ts` | Cấu trúc chuẩn của phản hồi API (`ApiResponse<T>`, phân trang, lỗi) |
  | `auth.ts` | Thông tin người dùng (`User`), payload đăng nhập, enum vai trò `UserRole` |
  | `common.ts` | Kiểu dữ liệu phân trang, lọc, sắp xếp dùng chung |
  | `customer.ts` | Khách hàng, điểm tích lũy, hạng thẻ, lịch sử đổi điểm |
  | `enums.ts` | Danh sách Enums trạng thái đơn, hình thức thanh toán, loại phiếu kho |
  | `inventory.ts` | Nguyên vật liệu, đơn vị tính, phiếu nhập kho, công thức BOM, kiểm kê |
  | `kds.ts` | Vé chế biến bếp (KDS Ticket), trạng thái món trong quầy bar |
  | `menu.ts` | Sản phẩm, danh mục món, topping, giá theo từng kích cỡ |
  | `order.ts` & `pos.ts` | Đơn hàng bán lẻ, chi tiết món, giỏ hàng POS, thanh toán |
  | `pager.ts` | Thiết bị thẻ rung, trạng thái thẻ (AVAILABLE, IN_USE, LOST...) |
  | `report.ts` | Thống kê doanh số, biểu đồ doanh thu, top món bán chạy |

---

### 8. 🛠️ Thư mục `utils/` (Helper Functions & Utilities)
* **Vai trò:** Chứa các hàm tiện ích thuần túy (Pure Functions) phục vụ xử lý chuỗi, ngày tháng, tính toán và lưu trữ.
* **Chức năng & Nhiệm vụ:**
  - Tách các hàm tính toán, định dạng ra khỏi component, giúp code dễ unit test và dễ tái sử dụng.
* **Các file thành phần:**
  - `format.ts`: Định dạng tiền tệ VND (`formatCurrency(100000) => "100.000 ₫"`), định dạng ngày giờ (`formatDateTime`, `formatDate`), chuẩn hóa số điện thoại.
  - `storage.ts`: Wrapper đọc/ghi dữ liệu an toàn vào Cookie và LocalStorage (tương thích môi trường SSR của Next.js).
  - `validation.ts`: Hàm kiểm tra tính hợp lệ của số điện thoại, định dạng email, độ mạnh mật khẩu.

---

### 9. 🖼️ Thư mục `public/` (Static Assets)
* **Vai trò:** Chứa các tệp tài nguyên tĩnh được Next.js phục vụ trực tiếp tại root URL `/`.
* **Chức năng & Nhiệm vụ:**
  - Chứa logo, favicon, hình ảnh minh họa tĩnh, các file SVG icon giao diện (`globe.svg`, `file.svg`, `next.svg`, `window.svg`).

---

### 10. 🛡️ File `middleware.ts` (Edge Route Guard & Phân quyền RBAC)
* **Vị trí:** Ngang hàng với `.gitignore` và các thư mục chính tại gốc `/client`.
* **Chức năng & Nhiệm vụ:**
  - Chạy trên tầng Edge của Next.js trước khi mọi request chạm vào các trang giao diện.
  - **Xác thực phiên làm việc:** Nếu chưa có Token và truy cập vào các trang nội bộ (`/dashboard`, `/pos`, `/kds`) -> Chuyển hướng ngay về `/login`.
  - **Điều hướng tự động:** Nếu đã có Token mà truy cập trang `/login` hoặc trang gốc `/` -> Tự động chuyển hướng đến trang mặc định theo vai trò (ví dụ: `CASHIER` -> `/pos/terminal`, `BARISTA` -> `/kds/queue`, `MANAGER` -> `/dashboard`).
  - **Kiểm soát ma trận phân quyền RBAC:** Ngăn chặn nhân viên truy cập trái phép vào các trang ngoài phạm vi quyền hạn (ví dụ: Thu ngân không được vào Báo cáo doanh thu hoặc Kho).

---

## 📊 Sơ đồ luồng dữ liệu (Data & Control Flow)

```mermaid
graph TD
    User([Người dùng / Trình duyệt]) --> Middleware[middleware.ts (Route Guard & RBAC)]
    Middleware --> AppPages[app/ (Pages & Layouts)]
    
    AppPages --> UIComponents[components/ (UI Blocks & Form Modals)]
    UIComponents --> ContextHooks[context/ & hooks/ (State: Auth, Cart, Toast)]
    
    UIComponents --> APIServices[api/ (Domain Services: POS, Menu, Inventory...)]
    APIServices --> AxiosInstance[api/client.ts (Interceptors: Auth Token & Error)]
    AxiosInstance --> BackendServer[(Backend REST API Server)]
    
    UIComponents -.-> Utils[utils/ (Format currency, date, validation)]
    UIComponents -.-> Constants[constants/ (Roles, Routes, Keys)]
    UIComponents -.-> Types[types/ (TypeScript Interfaces & Enums)]
```

---
*Tài liệu này được tạo nhằm chuẩn hóa kiến trúc mã nguồn cho toàn bộ nhóm phát triển Frontend dự án Coffee Management System.*
