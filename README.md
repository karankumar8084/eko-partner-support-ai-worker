# 🤖 Eko Partner Support AI Worker

An intelligent partner support dashboard designed to help manage transactions, monitor business analytics, track support tickets, and assist users through an AI-powered support chat interface.

The platform provides a centralized workspace for partner operations, combining transaction monitoring, analytics, ticket management, and AI-based assistance in a modern dashboard.

---

## 📌 Overview

**Eko Partner Support AI Worker** is a full-stack web application designed to simplify partner support and operational management.

It provides an interactive dashboard where users can monitor transaction performance, review transaction statuses, analyze business metrics, manage support tickets, and interact with an AI support assistant.

The project focuses on improving the partner support experience through a clean user interface, organized data visualization, and intelligent assistance.

---

## ✨ Features

### 📊 Dashboard
- Overview of key business metrics.
- Transaction statistics and performance summaries.
- Dashboard cards for important information.
- Recent transaction activity.

### 💳 Transaction Management
- View transaction records.
- Monitor transaction statuses.
- Track transaction-related information.
- Organized transaction data display.

### 📈 Analytics
- Transaction performance visualization.
- Status-based transaction analysis.
- Service performance insights.
- Filter analytics based on available criteria.

### 🎫 Support Ticket Management
- View support tickets in one place.
- Monitor ticket status.
- Review ticket descriptions and details.
- Track ticket categories and creation dates.
- Status-based ticket overview.

### 🤖 AI Support Worker
- Interactive AI chat interface.
- Quick prompts for common support queries.
- Transaction-related assistance.
- Support for partner queries.
- Chat-based assistance through a dedicated interface.

### 🔐 Authentication
- Partner login interface.
- Authentication through backend API.
- Protected partner workspace experience.

### 🎨 Modern UI
- Responsive dashboard layout.
- Sidebar navigation.
- Clean card-based design.
- Modern styling with Tailwind CSS.
- Interactive components and visual feedback.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- JavaScript
- Reusable UI Components

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

### Development Tools
- Git
- GitHub
- VS Code
- Postman
- npm

---

## 📂 Project Structure

```text
Eko-Partner-Support-AI-Worker/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── AIChat.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── AnalyticsFilters.jsx
│   │   │   ├── TransactionTrend.jsx
│   │   │   ├── TransactionStatus.jsx
│   │   │   ├── ServicePerformance.jsx
│   │   │   ├── RecentTransactions.jsx
│   │   │   └── SupportTickets.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

*Note: The folder structure may vary depending on the latest project implementation.*

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
```

### 2️⃣ Navigate to the Project Folder

```bash
cd YOUR_REPOSITORY_NAME
```

### 3️⃣ Setup Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend server:

```bash
npm run dev
```

If your project uses a different startup script, use the command defined in your backend `package.json`.

---

### 4️⃣ Setup Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## 🌐 Application Access

After starting the frontend and backend:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

*The URLs and ports may differ depending on your environment configuration.*

---

## 🔄 Application Workflow

```text
                 ┌─────────────────────┐
                 │      Partner       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Login Interface   │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │     Dashboard       │
                 └──────────┬──────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ Transactions │  │  Analytics   │  │   Tickets    │
  └──────────────┘  └──────────────┘  └──────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  AI Support Worker  │
                 └─────────────────────┘
```

---

## 📸 Screenshots

Screenshots of the application can be added here to showcase the user interface.

### Dashboard

> Add your dashboard screenshot here.

### Transactions

> Add your transaction page screenshot here.

### Analytics

> Add your analytics page screenshot here.

### AI Support Worker

> Add your AI chat screenshot here.

---

## 🔮 Future Improvements

- Enhanced AI-powered query understanding.
- More advanced transaction insights.
- Improved ticket prioritization.
- Real-time notifications.
- Advanced analytics and reporting.
- Improved role-based access control.
- Enhanced responsive design for mobile devices.

---

## 👨‍💻 Author

**Karan Kumar Mahto**

Computer Science & Engineering Graduate

Interested in:
- Full Stack Development
- Software Development
- Data Analytics
- Artificial Intelligence

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

---

> Built to create a smarter, more organized, and efficient partner support experience.