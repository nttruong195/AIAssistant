# Finance Calculator — Project Summary

## Stack

| Layer    | Tech                                      |
|----------|-------------------------------------------|
| Backend  | Java 17, Spring Boot 3.2.5, Gradle 8.10   |
| Frontend | React 18, Vite, Tailwind CSS, Recharts    |
| AI       | Gemini 2.0 Flash / Groq LLaMA 3.3 / OpenRouter Gemma |
| Deploy   | Render.com (BE) + Vercel (FE)             |

---

## Backend

**Package:** `com.finacalc`

```
src/main/java/com/finacalc/
├── ai/
│   ├── AiClient.java            — interface (getProvider, complete, isAvailable)
│   ├── AiProvider.java          — enum: GEMINI, GROQ, OPENROUTER
│   ├── GeminiClient.java        — Google Gemini 2.0 Flash (1500 req/day free)
│   ├── GroqClient.java          — LLaMA 3.3 70B (6000 req/day free)
│   ├── OpenRouterClient.java    — Gemma 3 27B free
│   └── AiFallbackService.java   — fallback chain Gemini→Groq→OpenRouter, SSE stream
├── config/
│   ├── AsyncConfig.java         — ThreadPoolTaskExecutor bean "aiExecutor"
│   └── CorsConfig.java          — CORS từ application.properties
├── controller/
│   ├── CalculatorController.java — POST /api/v1/calc/{compound,home-loan,car-loan,salary}
│   └── AiController.java         — POST /api/v1/ai/{cv-analyze,cv-analyze/upload,cover-letter,email,jd}
├── service/
│   ├── CompoundInterestService.java
│   ├── LoanService.java           — inject Map<String,LoanCalculationStrategy>
│   ├── SalaryService.java         — BHXH/BHYT/BHTN + 7-bậc thuế TNCN
│   ├── FileTextExtractor.java     — parse PDF (PDFBox 3.x), DOCX (POI), TXT
│   └── strategy/
│       ├── LoanCalculationStrategy.java  — interface
│       ├── FixedLoanStrategy.java        — @Component("FIXED") — annuity
│       └── DecliningLoanStrategy.java    — @Component("DECLINING") — dư nợ giảm dần
├── dto/request/   — CalculateRequest records
├── dto/response/  — CalculateResponse records
└── exception/
    └── GlobalExceptionHandler.java
```

**Key config — application.properties:**
```properties
server.port=8080
app.cors.allowed-origins=http://localhost:5173,...
ai.gemini.api-key=${AI_GEMINI_API_KEY:}
ai.groq.api-key=${AI_GROQ_API_KEY:}
ai.openrouter.api-key=${AI_OPENROUTER_API_KEY:}
```

**Chạy local:** `run.bat` (điền key vào đây, file này trong .gitignore)

---

## Frontend

**Cấu trúc:**
```
src/
├── api/calculatorApi.js       — axios instance + 4 hàm gọi BE
├── constants/index.js         — COMPOUND_FREQUENCY_OPTIONS, LOAN_TYPE_OPTIONS, TAX_BRACKETS
├── hooks/
│   ├── useCompoundInterest.js
│   ├── useLoan.js
│   ├── useSalary.js
│   └── useAi.js               — SSE streaming hook dùng chung cho AI pages
├── components/
│   ├── ui/
│   │   ├── FormField.jsx
│   │   ├── ResultCard.jsx
│   │   ├── NumberInput.jsx    — input tiền có dấu phẩy (1,000,000)
│   │   └── AiOutputBox.jsx    — hiển thị output streaming AI
│   └── layout/Navbar.jsx
├── pages/
│   ├── CompoundInterestPage.jsx
│   ├── LoanPage.jsx           — dùng chung home/car qua prop type
│   ├── SalaryPage.jsx
│   ├── CvAnalyzerPage.jsx     — upload file PDF/DOCX/TXT hoặc paste text
│   ├── CoverLetterPage.jsx
│   ├── EmailPage.jsx
│   └── JdPage.jsx
└── utils/format.js            — formatVND, formatPercent, parseNumber, formatNumberInput
```

**Env:** `VITE_API_URL=http://localhost:8080` (tạo `.env.local`, không commit)

---

## Patterns

| Pattern             | Nơi dùng                                      |
|---------------------|-----------------------------------------------|
| Strategy            | LoanCalculationStrategy (FIXED / DECLINING)   |
| Fallback Chain      | AiFallbackService (Gemini→Groq→OpenRouter)    |
| Custom Hook         | useCompoundInterest, useLoan, useSalary, useAi |
| DTO layering        | dto/request + dto/response                    |
| Global Error Handler| GlobalExceptionHandler (@RestControllerAdvice)|
| SSE Streaming       | AiFallbackService + SseEmitter                |

---

## AI Endpoints

| Endpoint                        | Body                                      |
|---------------------------------|-------------------------------------------|
| POST /api/v1/ai/cv-analyze      | `{ cvText }`                              |
| POST /api/v1/ai/cv-analyze/upload | multipart `file` (PDF/DOCX/TXT)         |
| POST /api/v1/ai/cover-letter    | `{ jobDescription, candidateInfo }`       |
| POST /api/v1/ai/email           | `{ emailType, context }`                  |
| POST /api/v1/ai/jd              | `{ position, requirements }`             |

Tất cả trả về `text/event-stream` (SSE).

---

## Deploy

- **BE → Render Web Service:** set 3 env vars `AI_GEMINI_API_KEY`, `AI_GROQ_API_KEY`, `AI_OPENROUTER_API_KEY`
- **FE → Vercel:** set env var `VITE_API_URL=https://your-render-service.onrender.com`
- Fat JAR: `./gradlew bootJar` → `build/libs/finance-calculator.jar`
