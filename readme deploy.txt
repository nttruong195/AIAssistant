1. Deploy Backend lên Render.com
Bước 1: Push code lên GitHub

Bước 2: Vào render.com → New → Web Service → Connect GitHub repo

Bước 3: Render tự detect backend/render.yaml, điền thông tin:

Root Directory: backend
Build Command: ./gradlew bootJar
Start Command: java -jar build/libs/finance-calculator.jar
Bước 4: Thêm Environment Variables:


AI_GEMINI_API_KEY     = <your_key>
AI_GROQ_API_KEY       = <your_key>
AI_OPENROUTER_API_KEY = <your_key>
Bước 5: Deploy → lấy URL dạng https://finance-calculator-api.onrender.com

2. Deploy Frontend lên Vercel
Bước 1: Vào vercel.com → New Project → Import GitHub repo

Bước 2: Cấu hình:

Root Directory: frontend
Framework: Vite (tự detect)
Bước 3: Thêm Environment Variable:


VITE_API_URL = https://finance-calculator-api.onrender.com/api/v1/calc
Bước 4: Deploy → lấy URL dạng https://your-app.vercel.app

3. Cập nhật CORS
Sau khi có URL Vercel, cập nhật backend/render.yaml:


- key: APP_CORS_ALLOWED_ORIGINS
  value: https://your-app.vercel.app
Hoặc set trực tiếp trên Render Dashboard.

4. Custom Domain (tuỳ chọn)
Nơi mua domain	Giá	Ghi chú
Namecheap	~$10/năm	.com phổ biến
Cloudflare	At-cost	Rẻ nhất, tích hợp CDN free
Gắn vào Vercel (FE):

Vercel → Settings → Domains → Add domain
Trỏ DNS CNAME → cname.vercel-dns.com
Gắn vào Render (BE):

Render → Settings → Custom Domain
Trỏ DNS CNAME → domain Render cấp
Lưu ý quan trọng
Render free tier sẽ sleep sau 15 phút không có request → request đầu chậm ~30s
Vercel không sleep, luôn fast
File backend/run.bat chỉ dùng để chạy local, không commit key vào git