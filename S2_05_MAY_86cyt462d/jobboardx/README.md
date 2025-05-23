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
To clone all projects
git clone https://github.com/ManishG359/HiringHood.git
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
SURVEY_BASE_URL=http://localhost:5173/survey
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
* Manage surveys (create/edit/delete questions)
* Distribute surveys to employees via email
* View HR analytics dashboard with chart visualizations
* Optimize job descriptions based on employee feedback

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
* Role-based dashboards enhancements

---

## 📨 Contact

Made with ❤️ by [MANISH CHANDRA GUTURU](https://github.com/ManishG359)

---

📘 User Guide: How to Use Surveys to Hire Better

JobBoardX introduces HR Analytics Surveys to help employers gain insights from current employees and enhance job postings accordingly. Here’s how to effectively use this feature to improve hiring outcomes.

🧩 What Are HR Surveys?

Surveys are short, anonymous feedback forms you send to employees to understand their satisfaction levels regarding work-life balance, growth opportunities, and more.

🛠️ How Employers Use Surveys

1. Create a Survey

Go to your Employer Dashboard > HR Analytics tab.

Use the "Create Survey" tool to add multiple custom questions.

Save the survey — questions are now stored securely with your company.

2. Distribute Surveys

Add comma-separated employee emails.

Hit "Send Survey" — emails will include a survey response link.

Employees submit 1–5 scores anonymously.

3. Visualize Feedback

Go to the HR Analytics tab.

View real-time average scores and sentiment pie chart.

Each question displays trend data to help you assess organizational health.

✨ Optimize Job Posts with AI

Use employee feedback to enhance job descriptions.

Example: If "growth opportunities" score is low, you’ll get suggestions to include mentorship or training programs.

Generate optimized job descriptions with a click.

🧠 Tips for Better Hiring Decisions

Run surveys quarterly.

Keep questions concise and actionable.

Use trends to prioritize which aspects to improve in job ads.

Transparency in job listings builds trust and attracts stronger candidates.

📌 Summary

Using surveys, employers can:

Understand current team morale

Boost applicant conversion with refined job listings

Retain talent by proactively addressing employee concerns

Let data guide your hiring. Smarter surveys mean smarter teams!

