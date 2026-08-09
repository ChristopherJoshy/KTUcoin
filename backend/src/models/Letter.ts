import mongoose, { Schema, Document } from 'mongoose';

export type LetterStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ILetter extends Document {
  studentId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  registrationId?: mongoose.Types.ObjectId;
  studentName: string;
  studentRoll?: string;
  classGroup?: string;
  eventTitle: string;
  eventDate?: string;
  eventVenue?: string;
  eventPoints?: number;
  eventGroup?: string;
  message?: string;
  status: LetterStatus;
  responseNote?: string;
  respondedBy?: string;
  createdAt: Date;
  respondedAt?: Date;
}

const LetterSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  registrationId: { type: Schema.Types.ObjectId, ref: 'Registration' },
  studentName: { type: String, required: true },
  studentRoll: { type: String },
  classGroup: { type: String },
  eventTitle: { type: String, required: true },
  eventDate: { type: String },
  eventVenue: { type: String },
  eventPoints: { type: Number },
  eventGroup: { type: String },
  message: { type: String },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  responseNote: { type: String },
  respondedBy: { type: String },
  respondedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model<ILetter>('Letter', LetterSchema);
