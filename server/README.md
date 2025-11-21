# GLA Bank Backend Server

Backend API server for GLA Bank built with Express, MongoDB, and TypeScript.

## Features

- 🔐 JWT Authentication
- 💰 Account Management
- 💸 Transaction Processing
- 🎮 Gamified Rewards System
- 👨‍💼 Admin Dashboard
- 🔒 Secure API endpoints

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MongoDB connection string and JWT secret.

3. **Start MongoDB:**
   - Local: Make sure MongoDB is running on `localhost:27017`
   - Atlas: Update `MONGODB_URI` in `.env` with your connection string

4. **Seed database (optional):**
   ```bash
   npm run seed
   ```
   This creates an admin user and test user with sample data.

5. **Run the server:**
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Accounts
- `GET /api/accounts` - Get user's accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts/:id` - Get account details
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Close account

### Transactions
- `GET /api/transactions` - Get user's transactions
- `POST /api/transactions` - Create transaction
- `POST /api/transactions/:id/approve` - Approve transaction
- `POST /api/transactions/:id/reject` - Reject transaction

### Rewards
- `GET /api/rewards/profile` - Get reward profile
- `POST /api/rewards/check-in` - Daily check-in
- `GET /api/rewards/quests` - Get user quests
- `POST /api/rewards/quests/initialize` - Initialize quests
- `GET /api/rewards/badges` - Get user badges
- `GET /api/rewards/events` - Get recent events
- `GET /api/rewards/level-info` - Get level information

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/accounts` - Get all accounts
- `GET /api/admin/transactions` - Get all transactions
- `POST /api/admin/transactions/:id/approve` - Approve any transaction
- `GET /api/admin/stats` - Get dashboard statistics

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

## Database Models

- **User** - User accounts with authentication
- **Account** - Bank accounts (checking, savings, credit)
- **Transaction** - Financial transactions
- **RewardProfile** - User reward points and levels
- **UserQuest** - User quest progress
- **UserBadge** - Earned badges
- **RewardEvent** - Reward activity log

