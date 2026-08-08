import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'STUDENT' | 'ORGANIZER' | 'TEACHER';

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  studentId?: string;
  avatarUrl?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'ORGANIZER', 'TEACHER'], required: true },
  department: { type: String, default: 'Computer Science & Engineering' },
  studentId: { type: String },
  avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
