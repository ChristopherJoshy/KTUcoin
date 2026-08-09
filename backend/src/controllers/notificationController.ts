import { Request, Response } from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// this function is used for retrieving user notifications from MongoDB for more info refer code-wiki.md line 65
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const list = await Notification.find({ recipientId: userId }).sort({ createdAt: -1 }).limit(30);
    res.json({ success: true, notifications: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// this function is used for sending deficiency warning or role assignment notification from teacher to student for more info refer code-wiki.md line 66
export const sendNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipientId, senderName, title, message, type } = req.body;
    const notif = new Notification({
      recipientId,
      senderName,
      title,
      message,
      type: type || 'WARNING',
      read: false
    });
    const saved = await notif.save();
    res.status(201).json({ success: true, notification: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// this function is used for marking notification read in MongoDB for more info refer code-wiki.md line 67
export const markNotificationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    res.json({ success: true, notification: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// this function is used for assigning Class Representative CR role to student in MongoDB for more info refer code-wiki.md line 68
export const assignCRRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, isCR, assignedByTeacherName } = req.body;
    const student = await User.findByIdAndUpdate(studentId, { isCR }, { new: true });
    if (!student) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    if (isCR) {
      await Notification.create({
        recipientId: student._id,
        senderName: assignedByTeacherName || 'Staff Advisor',
        title: 'Class Representative (CR) Role Assigned',
        message: `You have been appointed as Class Representative (CR) for ${student.department || 'your class'}.`,
        type: 'ROLE_ASSIGN'
      });
    }

    res.json({ success: true, student });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// this function is used for updating user profile bio and class details in MongoDB for more info refer code-wiki.md line 69
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { name, bio, department, avatarUrl, classGroup } = req.body;
    const updated = await User.findByIdAndUpdate(
      userId,
      { name, bio, department, avatarUrl, classGroup },
      { new: true }
    );
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// this function is used for toggling follow/unfollow status between users in MongoDB for more info refer code-wiki.md line 71
export const toggleFollowUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, targetId } = req.body;
    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!user || !target) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isFollowing = user.following?.includes(targetId);

    if (isFollowing) {
      user.following = user.following?.filter(id => id !== targetId);
      target.followers = target.followers?.filter(id => id !== userId);
    } else {
      user.following = [...(user.following || []), targetId];
      target.followers = [...(target.followers || []), userId];

      // Notify target user
      await Notification.create({
        recipientId: target._id,
        senderName: user.name,
        title: 'New Follower',
        message: `${user.name} started following your profile on KTUcoins.`,
        type: 'ROLE_ASSIGN'
      });
    }

    await user.save();
    await target.save();

    res.json({ success: true, following: user.following, followersCount: target.followers?.length });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
