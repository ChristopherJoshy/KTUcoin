import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  _id?: string;
  author: string;
  text: string;
  gifUrl?: string;
  createdAt: Date;
}

export interface IDiscussion extends Document {
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: string;
  upvotes: number;
  comments: IComment[];
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  author: { type: String, required: true },
  text: { type: String, default: '' },
  gifUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const DiscussionSchema: Schema = new Schema(
  {
    authorName: { type: String, required: true },
    authorRole: { type: String, required: true },
    authorAvatar: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true, default: 'Group I Tech' },
    upvotes: { type: Number, default: 0 },
    comments: [CommentSchema]
  },
  { timestamps: true }
);

export default mongoose.model<IDiscussion>('Discussion', DiscussionSchema);
