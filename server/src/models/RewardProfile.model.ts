import mongoose, { Schema, Document } from 'mongoose';

export interface IRewardProfile extends Document {
  userId: mongoose.Types.ObjectId;
  totalPoints: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const RewardProfileSchema = new Schema<IRewardProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  currentLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 8
  },
  currentStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  longestStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastCheckInDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model<IRewardProfile>('RewardProfile', RewardProfileSchema);

