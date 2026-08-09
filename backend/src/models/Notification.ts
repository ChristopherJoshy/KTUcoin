import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipientId: string;
  senderName: string;
  title: string;
  message: string;
  type: 'POINT_CREDIT' | 'WARNING' | 'ROLE_ASSIGN' | 'VERIFICATION';
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipientId: { type: String, required: true },
    senderName: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['POINT_CREDIT', 'WARNING', 'ROLE_ASSIGN', 'VERIFICATION'], 
      default: 'POINT_CREDIT' 
    },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
