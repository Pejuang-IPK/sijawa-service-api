📦 README — sijawa-api
# SIJAWA API

Backend service for **SIJAWA (Sistem Informasi Jadwal Wali Akademik)**.  
This service provides RESTful APIs to manage academic schedules, students, and related resources.

## 🧩 Tech Stack
- **Next.js** (API Routes only)
- **Prisma ORM (v6)**
- **MySQL**
- **REST API**
- **JWT Authentication (planned)**

## 📁 Project Structure


sijawa-api/
├─ app/api/ # REST API endpoints
│ ├─ jadwal/
│ ├─ mahasiswa/
│ └─ auth/
├─ lib/
│ ├─ prisma.ts # Prisma client singleton
│ └─ response.ts # API response helper
├─ prisma/
│ └─ schema.prisma # Prisma schema
├─ .env
└─ README.md


## ⚙️ Environment Variables
Create a `.env` file:

```env
DATABASE_URL="mysql://user:password@localhost:3306/appdb"
JWT_SECRET="your-secret-key"

🚀 Getting Started

Install dependencies:

npm install


Generate Prisma Client:

npx prisma generate


Run database migration:

npx prisma migrate dev


Start development server:

npm run dev


The API will be available at:

http://localhost:3000/api

📌 Example Endpoint
GET /api/jadwal


Response:

{
  "success": true,
  "data": []
}

🧠 Notes

This service is backend-only

Do NOT use Prisma in frontend

Designed to be consumed by multiple clients (web, mobile, admin)

📄 License

MIT


---

# 🌐 README — `sijawa-web`

```md
# SIJAWA Web

Frontend web application for **SIJAWA (Sistem Informasi Jadwal Wali Akademik)**.  
This app consumes the SIJAWA REST API and focuses purely on user interface and experience.

## 🧩 Tech Stack
- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **REST API**

## 📁 Project Structure


sijawa-web/
├─ app/
│ ├─ jadwal/
│ ├─ mahasiswa/
│ └─ login/
├─ services/
│ └─ api.ts # API communication layer
├─ components/
├─ .env
└─ README.md


## ⚙️ Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
