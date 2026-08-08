import mongoose, { Schema, Document } from 'mongoose';

export type RegistrationStatus = 'REGISTERED' | 'ATTENDED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface IRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  qrCodeToken: string;
  registeredAt: Date;
  attended: boolean;
  attendedAt?: Date;
  status: RegistrationStatus;
}

const RegistrationSchema: Schema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  qrCodeToken: { type: String, required: true, unique: true },
  registeredAt: { type: Date, default: Date.now },
  attended: { type: Boolean, default: false },
  attendedAt: { type: Date },
  status: { 
    type: String, 
    enum: ['REGISTERED', 'ATTENDED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'], 
    default: 'REGISTERED' 
  }
});

export default mongoose.model<IRegistration>('Registration', RegistrationSchema);
