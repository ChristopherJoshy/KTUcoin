import { Request, Response } from 'express';
import Discussion from '../models/Discussion';

// this function is used for retrieving all discussion threads from MongoDB for more info refer code-wiki.md line 60
export const getDiscussions = async (req: Request, res: Response) => {
  try {
    const discussions = await Discussion.find().sort({ createdAt: -1 });
    res.json(discussions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// this function is used for posting a new discussion thread to MongoDB for more info refer code-wiki.md line 61
export const createDiscussion = async (req: Request, res: Response) => {
  try {
    const { authorName, authorRole, authorAvatar, title, content, category } = req.body;
    const newThread = new Discussion({
      authorName,
      authorRole,
      authorAvatar,
      title,
      content,
      category,
      upvotes: 1,
      comments: []
    });
    const saved = await newThread.save();
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// this function is used for upvoting a discussion thread in MongoDB for more info refer code-wiki.md line 62
export const upvoteDiscussion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Discussion.findByIdAndUpdate(
      id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// this function is used for adding a comment to a discussion thread in MongoDB for more info refer code-wiki.md line 63
export const addCommentToDiscussion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { author, text, gifUrl } = req.body;
    const thread = await Discussion.findById(id);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    thread.comments.push({
      author,
      text: text || '',
      gifUrl,
      createdAt: new Date()
    });

    const saved = await thread.save();
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
