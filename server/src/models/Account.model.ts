import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  accountNumber: string;
  status: 'active' | 'inactive' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['checking', 'savings', 'credit'],
    required: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Generate account number before saving
AccountSchema.pre('save', async function(next) {
  try {
    // Only generate if accountNumber is missing
    if (!this.accountNumber) {
      // Generate unique 16-digit account number
      let accountNumber: string;
      let isUnique = false;
      const AccountModel = this.constructor as Model<IAccount>;
      
      // Keep generating until we get a unique one (max 10 attempts)
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        const randomDigits = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
        accountNumber = randomDigits.toString();
        
        // Check if this account number already exists
        const existing = await AccountModel.findOne({ accountNumber });
        if (!existing) {
          isUnique = true;
        }
        attempts++;
      }
      
      // If still not unique after 10 attempts, use timestamp-based number
      if (!isUnique) {
        accountNumber = Date.now().toString().padEnd(16, '0').substring(0, 16);
      }
      
      this.accountNumber = accountNumber!;
    }
    next();
  } catch (error: any) {
    // Fallback: generate simple account number if check fails
    if (!this.accountNumber) {
      const randomDigits = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
      this.accountNumber = randomDigits.toString();
    }
    next();
  }
});

export default mongoose.model<IAccount>('Account', AccountSchema);

