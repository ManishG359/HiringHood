# 🚀 JobBoardX

JobBoardX is a full-stack job board application built to simulate real-world hiring and job-seeking experiences. Inspired by platforms like LinkedIn and AngelList, JobBoardX allows **Job Seekers** to search and apply for jobs while enabling **Employers** to post and manage listings.

## 📆 Tech Stack

### Frontend

* React 18+
* TypeScript
* React Router v6
* Formik + Yup
* Material-UI (MUI)
* styled-components
* Axios

### Backend

* Node.js + Express
* MongoDB + Mongoose
* JWT for authentication
* bcryptjs
* dotenv

---

## 🔧 Getting Started

### Prerequisites

* Node.js (v16+)
* npm or yarn
* MongoDB or MongoDB Atlas URI

---

## 📁 Project Structure

```
jobboardx/
├── client/       # React frontend
├── server/       # Express backend
├── README.md
```

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ManishG359/HiringHood/jobboardx.git
cd jobboardx
```


---

### 2. Backend Setup (`/server`)

```bash
cd server
npm install
```

#### Create `.env` file inside `/server`:

```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

#### Start the server:

```bash
npm run dev
```

---

### 3. Frontend Setup (`/client`)

```bash
cd ../client
npm install
```

#### Start the frontend:

```bash
npm run dev
```

Frontend will run on: [http://localhost:5173](http://localhost:5173)

---

## ✨ Features

### 👥 Job Seekers

* Register/login
* Build & manage profile
* Search/filter jobs
* Apply to jobs
* Track application status

### 🏢 Employers

* Register/login
* Post new jobs
* Edit/delete jobs
* View applicants per job

---

## 🔐 Authentication

* JWT stored in `localStorage`
* Protected routes with role-based access

---

## 🌐 Deployment Tips

* Use **Vercel** or **Netlify** for the frontend.
* Use **Render**, **Railway**, or **Heroku** for backend.
* Store environment variables securely.

---

## 🛠️ To-Do

* Email verification (optional)
* File upload for resumes

---

## 📬 Contact

Made with ❤️ by [MANISH CHANDRA GUTURU](https://github.com/ManishG359)

---
