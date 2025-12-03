💳 Online Banking System

An Online Banking Web Application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to manage their finances securely and conveniently. The platform enables account creation, fund transfers, transaction history tracking, and profile management — all with a clean and intuitive interface.

🚀 Features

✅ User Authentication

Secure Login & Signup with JWT-based authentication

Password encryption using bcrypt

Role-based access control (Admin / User)

✅ Dashboard

Personalized user dashboard displaying balance and recent transactions

Real-time updates for account data

✅ Banking Operations

Deposit, Withdraw, and Transfer funds

Track all transactions in detailed history

Transaction receipts with timestamps

✅ Profile Management

Edit personal details

Change password and update profile picture

✅ Admin Panel

Manage all users and accounts

View and approve transactions

Analytics dashboard for total deposits, withdrawals, and transfers

✅ Security Features

Encrypted communication (HTTPS-ready)

Input validation and sanitization

Protection against XSS, CSRF, and SQL injection

🧩 Tech Stack
Layer	Technology
Frontend	React.js, Tailwind CSS / Bootstrap
Backend	Node.js, Express.js
Database	MongoDB (Mongoose ODM)
Authentication	JWT + bcrypt
Hosting (Optional)	Vercel / Render / Netlify / MongoDB Atlas
🏗️ Project Setup
🔹 Prerequisites

Make sure you have the following installed:

Node.js (v16+)

MongoDB (local or Atlas cloud)

npm or yarn

🔹 Installation

Clone the repository

git clone https://github.com/your-username/online-banking-system.git
cd online-banking-system


Install dependencies

npm install


Configure environment variables
Create a .env file in the root directory and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000


Run the server

npm run server


Run the frontend

cd client
npm install
npm start

### One-command dev startup
You can start local in-memory DB, backend, and frontend together using a single command (Windows PowerShell):

```powershell
# From the project root
npm.cmd run dev:all
```

This command runs an in-memory MongoDB (via `mongodb-memory-server`), the backend (tsx watch), and the Vite dev server concurrently.


Access the app
Visit 👉 http://localhost:3000

📸 Screenshots
Login Page	Dashboard	Transaction History

	
	
📁 Folder Structure
Online-Banking-System/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── .env
├── package.json
└── README.md

🧠 Future Enhancements

💰 Integration with UPI / Payment Gateway APIs

📱 Mobile Responsive UI (PWA support)

🔔 Email & SMS notifications

📊 Advanced analytics dashboard

🧾 PDF statement generation

🤝 Contributing

Contributions are welcome!

Fork the repo

Create a new branch (feature/new-feature)

Commit your changes

Push and open a pull request 🚀

🧑‍💻 Author

Ketan Singh
Ankit Kumar
Suraj Singh



