import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  fromAccount?: mongoose.Types.ObjectId;
  toAccount?: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  type: 'send' | 'receive' | 'deposit' | 'withdrawal' | 'transfer';
  status: 'pending' | 'approved' | 'rejected';
  category?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fromAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  toAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['send', 'receive', 'deposit', 'withdrawal', 'transfer'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  category: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);

