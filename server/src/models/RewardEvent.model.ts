import mongoose, { Schema, Document } from 'mongoose';

export interface IRewardEvent extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'points_earned' | 'level_up' | 'badge_earned' | 'quest_completed' | 'check_in';
  points?: number;
  description: string;
  timestamp: Date;
  createdAt: Date;
}

const RewardEventSchema = new Schema<IRewardEvent>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['points_earned', 'level_up', 'badge_earned', 'quest_completed', 'check_in'],
    required: true
  },
  points: {
    type: Number
  },
  description: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for efficient querying by user and timestamp
RewardEventSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model<IRewardEvent>('RewardEvent', RewardEventSchema);

