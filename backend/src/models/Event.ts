import mongoose, { Schema, Document } from 'mongoose';

export type ActivityGroup = 'Group I' | 'Group II' | 'Group III';

export interface IEvent extends Document {
  title: string;
  description: string;
  organizerId: mongoose.Types.ObjectId;
  organizerName: string;
  activityGroup: ActivityGroup;
  points: number;
  date: Date;
  location: string;
  posterUrl: string;
  registrationCap: number;
  registeredCount: number;
  isCompleted: boolean;
  createdAt: Date;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  organizerName: { type: String, required: true },
  activityGroup: { type: String, enum: ['Group I', 'Group II', 'Group III'], required: true },
  points: { type: Number, required: true, min: 1 },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  posterUrl: { type: String, required: true },
  registrationCap: { type: Number, default: 100 },
  registeredCount: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEvent>('Event', EventSchema);
