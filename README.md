# MePhaPhin — Hệ thống Quản lý và Vận hành Chuỗi Cà phê

Đồ án cuối kỳ học phần **Hệ quản trị Cơ sở dữ liệu**  
Mã học phần: **DBMS330284**  
Cơ sở đào tạo: **Trường Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE)** — Khoa Công nghệ Thông tin

Ứng dụng xây dựng theo mô hình **Client – Server**, kết nối trực tiếp **Microsoft SQL Server**. Toàn bộ nghiệp vụ ghi dữ liệu đi qua stored procedure, function, view và transaction — không chỉ là câu lệnh SQL rời ở tầng ứng dụng.

---

## Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Chức năng chính](#chức-năng-chính)
3. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
4. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
5. [Yêu cầu môi trường](#yêu-cầu-môi-trường)
6. [Cài đặt và chạy chương trình](#cài-đặt-và-chạy-chương-trình)
7. [Tài khoản mẫu](#tài-khoản-mẫu)

---

## Giới thiệu

**MePhaPhin** là hệ thống vận hành chuỗi cà phê, bao phủ từ quầy bán hàng, bếp pha chế, kho nguyên liệu đến hội viên và báo cáo doanh thu.

Bài toán được chọn vì vừa có nghiệp vụ giao dịch nhiều bước (đặt món → trừ kho theo BOM → cấp thẻ rung → thanh toán → tích điểm), vừa đủ để thể hiện các nội dung môn học: ràng buộc, trigger, khung nhìn, chỉ mục, lập trình T-SQL, giao dịch, đồng thời và phân quyền.

**Phạm vi thực hiện**

- Một cơ sở dữ liệu SQL Server hoàn chỉnh, chuẩn hóa tối thiểu 3NF.
- API Node.js gọi stored procedure / function / view.
- Ứng dụng web Next.js cho POS, KDS, kho, thực đơn, hội viên và báo cáo.
- Phân quyền đăng nhập tương ứng role trong cơ sở dữ liệu.

---

## Chức năng chính

| Phân hệ | Mô tả |
| --- | --- |
| POS & thẻ rung | Đặt món tại quầy, tự gán và thu hồi pager, in hóa đơn nhiệt khổ 80mm. |
| Bếp & quầy bar (KDS) | Hàng đợi pha chế (polling 5 giây), hoàn tất ly, rung chuông thẻ, trừ kho theo BOM. |
| Kho & định lượng | Tồn kho nguyên liệu, BOM món chính và topping, phiếu nhập, kiểm kê hao hụt. |
| Hội viên | Hồ sơ khách, sổ cái điểm append-only, đổi điểm lấy giảm giá, nâng hạng Standard / Silver / Gold / Diamond. |
| Thực đơn | Danh mục, đồ uống nhiều size (S, M, L, XL) và topping đi kèm. |
| Báo cáo | Doanh thu thực nhận, sản phẩm bán chạy, cảnh báo tồn kho dưới ngưỡng. |

---

## Công nghệ sử dụng

| Tầng | Công nghệ |
| --- | --- |
| Cơ sở dữ liệu | Microsoft SQL Server 2019 / 2022, Transact-SQL |
| Backend | Node.js 20+, Express, TypeScript, driver `mssql` (connection pool, TVP, transaction) |
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide, Axios |
| Tài liệu API | Swagger UI — OpenAPI 3.0 tại `/api/docs` |
| Xác thực | JWT, mật khẩu băm bằng bcrypt |

---

## Cấu trúc thư mục

```text
COFFEE_SYSTEM_PROJECT/
├── server/
│   ├── database/                         # Script SQL Server, chạy đúng thứ tự
│   │   ├── 01_schema_tables.sql          # DDL: database + 16 bảng
│   │   ├── 02_constraints.sql            # UNIQUE, CHECK, DEFAULT, FK
│   │   ├── 03_triggers.sql               # Trigger kho, thẻ rung, điểm
│   │   ├── 04_views.sql                  # 7 view báo cáo và in bill
│   │   ├── 05_stored_procedures.sql      # Thủ tục + user-defined table type
│   │   ├── 06_functions.sql              # Scalar và table-valued function
│   │   ├── 07_indexes.sql                # Non-clustered index có INCLUDE
│   │   ├── 08_security_roles.sql         # 4 database role + GRANT/REVOKE
│   │   ├── 09_backup_recovery.sql        # Recovery FULL và thủ tục sao lưu
│   │   └── seed_data.sql                 # 22 món, 5 user, kho, đơn mẫu
│   ├── src/
│   │   ├── config/                       # Pool SQL Server, env, Swagger
│   │   ├── middlewares/                  # Auth, role guard, error filter
│   │   ├── modules/                      # POS, Menu, KDS, Kho, Loyalty, Report
│   │   ├── app.ts
│   │   └── server.ts                     # Cổng mặc định 5000
│   ├── .env
│   └── package.json
│
├── client/
│   ├── api/                              # Axios client và service
│   ├── app/                              # App Router: POS, KDS, Dashboard, Menu
│   ├── components/
│   ├── context/                          # Auth, Cart, Toast
│   ├── hooks/
│   ├── types/
│   ├── .env.local
│   └── package.json
│
└── README.md
```

---

## Yêu cầu môi trường

- Hệ điều hành: Windows 10/11, macOS hoặc Linux.
- [Node.js](https://nodejs.org/) **20.x** trở lên và npm **10.x** trở lên.
- Microsoft SQL Server **2019** hoặc **2022** (bản Developer / Express đều được).
- SQL Server Management Studio (SSMS) hoặc Azure Data Studio.
- TCP/IP của SQL Server đang bật, cổng mặc định **1433**.
- Tài khoản SQL có quyền tạo database (ví dụ `sa`, hoặc một login được cấp `dbcreator`).

Kiểm tra nhanh:

```bash
node -v
npm -v
```

---


## Cài đặt và chạy chương trình

Chạy **ba phần theo đúng thứ tự**: cơ sở dữ liệu → backend → frontend. Backend không khởi động được nếu chưa có database `COFFEE_SYSTEM`.

### Bước 1 — Thiết lập Cơ sở dữ liệu (SQL Server)

Người cài đặt có thể chọn **1 trong 3 phương án** dưới đây tùy theo môi trường làm việc:

---

#### Phương án 1: Khôi phục từ file Backup (`.bak`) — *Khuyến nghị (Nhanh nhất)*

1. Mở **SSMS** hoặc **DBeaver**, kết nối tới máy chủ SQL Server.
2. Mở một cửa sổ SQL Query mới và chạy lệnh khôi phục (sửa lại đường dẫn file `.bak` cho đúng vị trí trên máy):

```sql
RESTORE DATABASE [COFFEE_SYSTEM]
FROM DISK = N'D:\Path\To\Database\COFFEE_SYSTEM.bak'
WITH REPLACE;
```

> **Lưu ý (nếu dùng Docker):** Copy file `.bak` vào container hoặc trỏ đúng đường dẫn nội bộ bên trong Linux container (ví dụ: `/var/opt/mssql/data/COFFEE_SYSTEM.bak`).

---

#### Phương án 2: Chạy 1 file script tổng hợp (`Full_Database_MePhaPhin.sql`)

Dành cho trường hợp không thể restore file `.bak` do khác biệt phiên bản SQL Server giữa các máy:

1. Mở file `Full_Database_MePhaPhin.sql` (đã bao gồm toàn bộ cấu trúc bảng, logic T-SQL và dữ liệu mẫu) bằng SSMS hoặc DBeaver.
2. Chọn kết nối tới SQL Server của bạn.
3. Nhấn **Execute** (F5) để thực thi. Script sẽ tự động khởi tạo CSDL `COFFEE_SYSTEM`, toàn bộ bảng, trigger, thủ tục, phân quyền và nạp dữ liệu mẫu ban đầu.

---

#### Phương án 3: Chạy lần lượt từng file `.sql` theo thứ tự phụ thuộc

Dành cho trường hợp muốn rà soát, kiểm tra từng thành phần CSDL:

Mở thư mục `server/database/` (hoặc `Database/scripts/`), kết nối SQL Server và thực thi lần lượt từ file **01 đến 10** theo đúng bảng dưới đây (**bắt buộc tuân thủ thứ tự** do script sau phụ thuộc đối tượng của script trước):

| Thứ tự | Tên File Script              | Chức năng & Nghiệp vụ khởi tạo                                                              |
| ------ | ---------------------------- | ------------------------------------------------------------------------------------------- |
| 01     | `01_schema_tables.sql`       | Khởi tạo CSDL `COFFEE_SYSTEM` và cấu trúc 18 bảng dữ liệu.                                  |
| 02     | `02_constraints.sql`         | Thiết lập Khóa ngoại (CASCADE), ràng buộc UNIQUE, DEFAULT và CHECK enum.                    |
| 03     | `03_triggers.sql`            | Cài đặt 8 Triggers (tự trừ kho BOM, cộng dồn nhập kho, chặn âm kho, thẻ rung, khóa sổ cái). |
| 04     | `04_views.sql`               | Tạo 7 Views phục vụ in bill K80 snapshot, dashboard thẻ rung, cảnh báo kho, doanh thu.      |
| 05     | `05_stored_procedures.sql`   | Khởi tạo 3 kiểu dữ liệu bảng (TVP) và các Stored Procedures bọc Transaction/ACID.           |
| 06     | `06_functions.sql`           | Tạo 7 User-Defined Functions (5 hàm Scalar tính tiền/điểm + 2 hàm Table-Valued).            |
| 07     | `07_indexes.sql`             | Xây dựng 6 Non-Clustered Indexes kết hợp INCLUDE và Filtered Index tối ưu truy vấn.         |
| 08     | `08_security_roles.sql`      | Thiết lập 4 Database Roles (CASHIER, BARISTA, STOREKEEPER, MANAGER) và GRANT/DENY.          |
| 09     | `09_backup_recovery.sql`     | Chuyển Recovery Model sang FULL và tạo các thủ tục sao lưu tự động.                         |
| 10     | `seed_data.sql`              | Nạp dữ liệu mẫu ban đầu (22 món, công thức BOM, nguyên vật liệu kho, tài khoản nhân viên).  |

Trong SSMS: mở file → chọn đúng instance → **Execute** (F5).  
Nếu script báo database đã tồn tại, xóa database cũ rồi chạy lại từ file 01, hoặc chỉ chạy phần còn thiếu nếu bạn đang vá script.

**Kiểm tra sau khi seed:**

```sql
USE COFFEE_SYSTEM;
SELECT COUNT(*) AS SoBang
FROM sys.tables
WHERE is_ms_shipped = 0;

SELECT name
FROM sys.procedures
WHERE name LIKE 'sp_%';
```

### Bước 2 — Backend (cổng 5000)

```bash
cd server
npm install
```

Tạo file `server/.env`:

```env
NODE_ENV=development
PORT=5000

# SQL Server
DB_USER=sa
DB_PASSWORD=your_password_here
DB_SERVER=localhost
DB_PORT=1433
DB_NAME=COFFEE_SYSTEM

# JWT
JWT_SECRET=CoffeeSystemSecretKey_DBMS330284_2026
JWT_EXPIRES_IN=1d
```

Đổi `DB_USER`, `DB_PASSWORD`, `DB_SERVER` cho đúng máy của bạn.  
Nếu SQL Server là named instance (ví dụ `localhost\SQLEXPRESS`), ghi đúng tên instance vào `DB_SERVER` và để trống hoặc bỏ `DB_PORT` nếu instance không lắng nghe 1433.

```bash
npm run dev
```

Khi thành công, console in:

```text
Kết nối thành công tới Database [COFFEE_SYSTEM] trên SQL Server.
CoffeeShop Backend Server đang chạy tại: http://localhost:5000
```

- API gốc: `http://localhost:5000/api/v1`
- Swagger: `http://localhost:5000/api/docs`

Build production (khi nộp bài hoặc demo ổn định):

```bash
npm run build
npm start
```

### Bước 3 — Frontend (cổng 3000)

Mở **một terminal khác**:

```bash
cd client
npm install
```

Tạo file `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

```bash
npm run dev
```

Mở trình duyệt: [http://localhost:3000](http://localhost:3000)

Đăng nhập bằng một tài khoản ở bảng bên dưới. Hệ thống chuyển tới trang mặc định theo role.

### Thứ tự tắt / bật lại

1. Dừng frontend (`Ctrl + C`).
2. Dừng backend (`Ctrl + C`).
3. SQL Server có thể để chạy nền.
4. Khi bật lại: backend trước, frontend sau.

---

## Tài khoản mẫu

Mật khẩu của mọi tài khoản seed: **`123456`**.

| Vai trò | Username / SĐT | Trang mặc định | Quyền chính |
| --- | --- | --- | --- |
| MANAGER / ADMIN | `manager01` | `/dashboard` | Thực đơn, BOM, báo cáo doanh thu, toàn quyền quản trị. |
| CASHIER (Thu ngân) | `cashier01` | `/pos/terminal` | POS, thẻ rung, lịch sử đơn, in hóa đơn. |
| BARISTA (Pha chế) | `barista01` | `/kds/queue` | Hàng đợi KDS, bắt đầu / hoàn tất ly, rung chuông. |
| STOREKEEPER (Thủ kho) | `storekeeper01` | `/dashboard/inventory/ingredients` | Phiếu nhập, kiểm kê, cảnh báo thiếu kho. |
| CUSTOMER (Hội viên) | `0988111222` | `/menu` | Đặt món, theo dõi đơn, tích điểm và đổi điểm. |

Role ứng dụng ánh xạ với database role tạo trong `08_security_roles.sql`. Người dùng không được gọi API ngoài quyền của role (middleware từ chối trước khi vào controller).

---


