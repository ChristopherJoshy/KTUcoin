import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types/index.js';

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  studentId?: string;
  avatarUrl?: string;
  bio?: string;
  classGroup?: string;
  isCR?: boolean;
  followers?: string[];
  following?: string[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['STUDENT', 'ORGANIZER', 'TEACHER'], required: true },
    department: { type: String, required: true },
    studentId: { type: String },
    avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
    bio: { type: String, default: 'Engineering Student & Tech Enthusiast' },
    classGroup: { type: String, default: 'S6 CSE A' },
    isCR: { type: Boolean, default: false },
    followers: [{ type: String }],
    following: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
