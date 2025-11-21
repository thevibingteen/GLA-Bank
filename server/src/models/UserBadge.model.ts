import mongoose, { Schema, Document } from 'mongoose';

export interface IUserBadge extends Document {
  userId: mongoose.Types.ObjectId;
  badgeId: string;
  awardedAt: Date;
  createdAt: Date;
}

const UserBadgeSchema = new Schema<IUserBadge>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  badgeId: {
    type: String,
    required: true
  },
  awardedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate badges
UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export default mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);

