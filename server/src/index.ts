import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import accountRoutes from './routes/account.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import rewardsRoutes from './routes/rewards.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/glabank';

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in environment variables');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GLA Bank API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`📦 Database: ${mongoose.connection.db?.databaseName || 'glabank'}`);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error('💡 Tip: Check your IP whitelist in MongoDB Atlas');
      console.error('💡 Tip: Verify your connection string is correct');
    }
    process.exit(1);
  });

export default app;

