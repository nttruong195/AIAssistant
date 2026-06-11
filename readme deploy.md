# Deploy Guide — CareerAI

## 1. Deploy Backend lên Render.com

**Bước 1:** Push code lên GitHub

**Bước 2:** Vào [render.com](https://render.com) → **New → Blueprint** → Connect GitHub repo  
Render tự đọc `render.yaml` ở root → tạo service với `env: docker`

**Bước 3:** Thêm Environment Variables trên Render Dashboard:
```
MAIL_USERNAME         = ai.assistant.1995@gmail.com
MAIL_APP_PASSWORD     = <gmail app password>
AI_GEMINI_API_KEY     = <your_key>
AI_GROQ_API_KEY       = <your_key>
AI_HUGGINGFACE_API_KEY= <your_key>
AI_COHERE_API_KEY     = <your_key>
AI_OPENROUTER_API_KEY = <your_key>
APP_CORS_ALLOWED_ORIGINS = https://your-app.vercel.app
```

**Bước 4:** Deploy → lấy URL dạng `https://finance-calculator-api.onrender.com`

> **URL hiện tại:** https://ai-assistant-ji4i.onrender.com

---

## 2. Deploy Frontend lên Vercel

**Bước 1:** Vào [vercel.com](https://vercel.com) → **New Project** → Import GitHub repo

**Bước 2:** Cấu hình:
- **Root Directory:** `frontend`
- **Framework:** Vite (tự detect)

**Bước 3:** Thêm Environment Variable:
```
VITE_API_URL = https://ai-assistant-ji4i.onrender.com
```
> Chỉ điền host, không kèm path `/api/v1/...`

**Bước 4:** Deploy → lấy URL Vercel

**Bước 5:** Tắt Deployment Protection:  
Vercel Dashboard → Project → **Settings → Deployment Protection → tắt Vercel Authentication**

---

## 3. Cập nhật CORS

Sau khi có URL Vercel, cập nhật `APP_CORS_ALLOWED_ORIGINS` trên Render Dashboard:
```
APP_CORS_ALLOWED_ORIGINS = https://your-app.vercel.app
```

---

## 4. Keep-alive — Tránh Render Sleep

Render free tier sleep sau **15 phút** không có request.

**Giải pháp: UptimeRobot (free)**

1. Đăng ký [uptimerobot.com](https://uptimerobot.com)
2. **+ Add New Monitor:**
   - Monitor Type: `HTTP(s)`
   - Friendly Name: `CareerAI Backend`
   - URL: `https://ai-assistant-ji4i.onrender.com/api/v1/calc/ping`
   - Monitoring Interval: `5 minutes`
3. Save → UptimeRobot ping mỗi 5 phút, server không sleep

> Endpoint `/api/v1/calc/ping` trả về `pong` — dùng riêng cho health check.

---

## 5. Custom Domain (tuỳ chọn)

| Nơi mua | Giá | Ghi chú |
|---|---|---|
| Namecheap | ~$10/năm | `.com` phổ biến |
| Cloudflare | At-cost | Rẻ nhất, tích hợp CDN free |

- **Vercel (FE):** Settings → Domains → Add domain → CNAME trỏ `cname.vercel-dns.com`
- **Render (BE):** Settings → Custom Domain → CNAME trỏ domain Render cấp

---

## Lưu ý

- `backend/run.bat` chỉ dùng để chạy local, đã có trong `.gitignore`
- `application.properties` đã commit (không chứa secret, dùng `${ENV_VAR:}`)
- Vercel không sleep, luôn fast
