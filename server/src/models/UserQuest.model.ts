import mongoose, { Schema, Document } from 'mongoose';

export interface IUserQuest extends Document {
  userId: mongoose.Types.ObjectId;
  questId: string;
  progressValue: number;
  status: 'active' | 'completed' | 'expired';
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserQuestSchema = new Schema<IUserQuest>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  questId: {
    type: String,
    required: true
  },
  progressValue: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'expired'],
    default: 'active'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index for user and quest
UserQuestSchema.index({ userId: 1, questId: 1 }, { unique: true });

export default mongoose.model<IUserQuest>('UserQuest', UserQuestSchema);

