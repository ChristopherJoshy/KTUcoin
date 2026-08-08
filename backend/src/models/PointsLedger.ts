import mongoose, { Schema, Document } from 'mongoose';

export interface IPointsLedger extends Document {
  studentId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  registrationId: mongoose.Types.ObjectId;
  eventTitle: string;
  activityGroup: string;
  pointsAwarded: number;
  approvedByTeacherId: mongoose.Types.ObjectId;
  approvedByTeacherName: string;
  approvedAt: Date;
}

const PointsLedgerSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  registrationId: { type: Schema.Types.ObjectId, ref: 'Registration', required: true },
  eventTitle: { type: String, required: true },
  activityGroup: { type: String, required: true },
  pointsAwarded: { type: Number, required: true },
  approvedByTeacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvedByTeacherName: { type: String, required: true },
  approvedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPointsLedger>('PointsLedger', PointsLedgerSchema);
