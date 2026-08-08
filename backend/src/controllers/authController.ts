import { Request, Response } from 'express';
import User from '../models/User.js';

// this function is used for fetching seeded user profiles for quick switching in demo mode for more info refer code-wiki.md line 18
export const getProfiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profiles', error });
  }
};

// this function is used for creating new custom user profiles on the fly for more info refer code-wiki.md line 20
export const createProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, role, department, studentId } = req.body;
    if (!name || !email || !role) {
      res.status(400).json({ success: false, message: 'Name, email, and role are required' });
      return;
    }

    const newUser = await User.create({
      name,
      email,
      role,
      department: department || 'General Department',
      studentId: studentId || (role === 'STUDENT' ? `TVE21CS${Math.floor(100 + Math.random() * 900)}` : undefined),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create profile', error });
  }
};
