import mongoose, { Schema, Document } from 'mongoose';

export type RegistrationStatus = 'REGISTERED' | 'ATTENDED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface IRegistration extends Document {
  eventId?: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  qrCodeToken: string;
  registeredAt: Date;
  attended: boolean;
  attendedAt?: Date;
  status: RegistrationStatus;
  isManualClaim?: boolean;
  claimTitle?: string;
  claimGroup?: string;
  claimPoints?: number;
  proofUrl?: string;
  proofDescription?: string;
}

const RegistrationSchema: Schema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  qrCodeToken: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now },
  attended: { type: Boolean, default: false },
  attendedAt: { type: Date },
  status: { 
    type: String, 
    enum: ['REGISTERED', 'ATTENDED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'], 
    default: 'REGISTERED' 
  },
  isManualClaim: { type: Boolean, default: false },
  claimTitle: { type: String },
  claimGroup: { type: String },
  claimPoints: { type: Number },
  proofUrl: { type: String },
  proofDescription: { type: String }
});

export default mongoose.model<IRegistration>('Registration', RegistrationSchema);
