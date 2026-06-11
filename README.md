# Finance Calculator

Công cụ tài chính cá nhân bao gồm:
- Tính lãi kép (Compound Interest)
- Tính vay mua nhà
- Tính vay mua xe
- Gross → Net & Thuế TNCN Việt Nam

## Tech Stack

| Tầng | Công nghệ |
|------|-----------|
| Backend | Java 17 + Spring Boot 3 + Gradle |
| Frontend | React 18 + Vite + TailwindCSS + Recharts |
| Deploy BE | Render.com (free tier) |
| Deploy FE | Vercel (free tier) |

## Yêu cầu cài đặt

- Java 17+
- Node.js 18+
- Gradle (hoặc dùng `./gradlew` wrapper có sẵn)

## Chạy local

### Backend
```bash
cd backend
./gradlew bootRun
# Windows: gradlew.bat bootRun
# API chạy tại http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Web chạy tại http://localhost:5173
```

> Vite đã cấu hình proxy `/api` → `http://localhost:8080`, không cần đổi gì thêm khi chạy local.

## Build

```bash
# Backend - tạo fat JAR
cd backend
./gradlew bootJar
# Output: build/libs/finance-calculator.jar

# Frontend - build production
cd frontend
npm run build
# Output: dist/
```

## API Endpoints

Base URL: `http://localhost:8080/api/v1/calc`

| Method | Endpoint | Chức năng |
|--------|----------|-----------|
| POST | `/compound-interest` | Tính lãi kép |
| POST | `/home-loan` | Tính vay mua nhà |
| POST | `/car-loan` | Tính vay mua xe |
| POST | `/salary` | Gross → Net & Thuế TNCN |

### Ví dụ request — Tính lãi kép
```json
POST /api/v1/calc/compound-interest
{
  "principal": 100000000,
  "annualRate": 8,
  "years": 10,
  "compoundFrequency": 12,
  "monthlyContribution": 1000000
}
```

### Ví dụ request — Gross → Net
```json
POST /api/v1/calc/salary
{
  "grossSalary": 30000000,
  "dependents": 1,
  "otherIncome": 0,
  "hasInsurance": true
}
```

### Ví dụ request — Vay nhà / Vay xe
```json
POST /api/v1/calc/home-loan
{
  "loanAmount": 2000000000,
  "annualRate": 9,
  "termMonths": 240,
  "downPayment": 500000000,
  "loanType": "FIXED"
}
```
> `loanType`: `"FIXED"` (trả đều) hoặc `"DECLINING"` (dư nợ giảm dần)

## Deploy miễn phí

### Backend → Render.com
1. Tạo account tại https://render.com
2. New → Web Service → kết nối GitHub repo
3. Root Directory: `backend`
4. Build Command: `./gradlew bootJar`
5. Start Command: `java -jar build/libs/finance-calculator.jar`
6. Free tier: 512MB RAM, tự sleep sau 15 phút không có request

### Frontend → Vercel
1. Tạo account tại https://vercel.com
2. Import GitHub repo → Root Directory: `frontend`
3. Thêm biến môi trường:
   ```
   VITE_API_URL=https://your-api.onrender.com/api/v1/calc
   ```
4. Deploy tự động mỗi khi push code lên GitHub

### Domain miễn phí
| Loại | Địa chỉ | Ghi chú |
|------|---------|---------|
| Subdomain Vercel | `ten-app.vercel.app` | Tự động khi deploy |
| Subdomain Render | `ten-api.onrender.com` | Tự động khi deploy |
| Domain riêng `.eu.org` | Tự đặt tên | Đăng ký tại https://nic.eu.org, duyệt ~1-2 tuần |

## Cấu trúc project

```
finance-calculator/
├── backend/
│   ├── build.gradle
│   ├── settings.gradle
│   ├── render.yaml                        ← cấu hình deploy Render
│   └── src/main/java/com/finacalc/
│       ├── FinaCalcApplication.java
│       ├── controller/
│       │   └── CalculatorController.java  ← 4 REST endpoints
│       ├── service/
│       │   └── CalculatorService.java     ← logic tính toán
│       └── dto/                           ← Request/Response models
└── frontend/
    ├── vercel.json                         ← cấu hình deploy Vercel
    ├── src/
    │   ├── App.jsx
    │   ├── pages/                          ← 4 trang tính toán
    │   ├── components/                     ← Navbar, ResultRow
    │   └── utils/                          ← api.js, format.js
    └── ...
```
