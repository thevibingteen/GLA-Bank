import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import Account from '../models/Account.model.js';
import RewardProfile from '../models/RewardProfile.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/glabank';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in environment variables');
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`📦 Database: ${mongoose.connection.db?.databaseName || 'glabank'}`);

    // Clear existing data (optional - comment out if you want to keep data)
    // await User.deleteMany({});
    // await Account.deleteMany({});
    // await RewardProfile.deleteMany({});

    // Create admin user
    const adminEmail = 'admin@glabank.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = new User({
        email: adminEmail,
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Created admin user:', adminEmail);
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create test user
    const testEmail = 'test@glabank.com';
    let testUser = await User.findOne({ email: testEmail });

    if (!testUser) {
      testUser = new User({
        email: testEmail,
        password: 'test123',
        name: 'Test User',
        role: 'user'
      });
      await testUser.save();
      console.log('✅ Created test user:', testEmail);

      // Create default accounts for test user
      const account1 = new Account({
        userId: testUser._id,
        name: 'Primary Checking',
        type: 'checking',
        balance: 5000,
        status: 'active'
      });
      await account1.save();

      const account2 = new Account({
        userId: testUser._id,
        name: 'Savings Account',
        type: 'savings',
        balance: 10000,
        status: 'active'
      });
      await account2.save();

      const account3 = new Account({
        userId: testUser._id,
        name: 'Credit Card',
        type: 'credit',
        balance: 0,
        status: 'active'
      });
      await account3.save();
      console.log('✅ Created default accounts for test user');

      // Create reward profile
      const profile = new RewardProfile({
        userId: testUser._id,
        totalPoints: 0,
        currentLevel: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckInDate: null
      });
      await profile.save();
      console.log('✅ Created reward profile for test user');
    } else {
      console.log('ℹ️  Test user already exists');
    }

    console.log('\n✅ Seeding completed!');
    console.log('\n📝 Test credentials:');
    console.log('   Admin: admin@glabank.com / admin123');
    console.log('   User:  test@glabank.com / test123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();

