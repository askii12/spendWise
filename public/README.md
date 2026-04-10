# SpendWise

A modern fullstack expense tracking web application with analytics, built using React, Node.js, and MySQL.

---

## Live Demo

Frontend: https://your-frontend-link  
Backend API: https://your-backend-link  

---

## Features

- Secure authentication (JWT)
-  User-specific data isolation
-  Add, edit, delete expenses
- Filter by category and date
- Analytics dashboard (monthly + category)
- Interactive charts (Recharts)
-  Fast UI with React + Vite
-  Fully responsive design
-  Modern SaaS-style UI

---

##  Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Recharts
- React Hot Toast

### Backend
- Node.js
- Express
- MySQL
- Prisma ORM
- JWT (Authentication)
- bcryptjs

---

##  Screenshots

### Landing Page
![Landing](./public/screenshots/landing-page.png)

### Dashboard
![Dashboard](./public/screenshots/dashboard-overview.png)

### Analytics
![Analytics](./public/screenshots/analytics-filters.png)

---

##  Project Structure
spendwise-client/
spendwise-server/


---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Expenses
- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

### Analytics
- `GET /api/expenses/summary`
- `GET /api/expenses/by-category`
- `GET /api/expenses/by-month`

---

## ⚙️ Environment Variables

### Backend (.env)
```env
PORT=5000
DATABASE_URL="mysql://root:password@localhost:3306/spendwise"
JWT_SECRET=your_secret_key
```
Frontend (.env)
```VITE_API_URL=http://localhost:5000/api```
 Installation
1. Clone repo
  git clone https://github.com/your-username/spendwise.git
  cd spendwise
2. Backend setup
  cd spendwise-server
  npm install
  npx prisma migrate dev --name init
  npm run dev
3. Frontend setup
  cd spendwise-client
  npm install
  npm run dev

🧪 Future Improvements
Budget tracking system
Recurring expenses
Export to CSV / PDF
Dark/Light theme toggle
User profile settings
Mobile app version
👨‍💻 Author

Nurlan Mussepov
Fullstack Developer
