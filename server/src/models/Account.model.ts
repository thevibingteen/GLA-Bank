import mongoose, { Schema, Document } from 'mongoose';

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
  if (!this.isNew || this.accountNumber) return next();
  
  // Generate 16-digit account number
  const randomDigits = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
  this.accountNumber = randomDigits.toString();
  next();
});

export default mongoose.model<IAccount>('Account', AccountSchema);

