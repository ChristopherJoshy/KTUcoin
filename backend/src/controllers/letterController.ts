import { Request, Response } from 'express';
import Letter from '../models/Letter.js';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// this function is used for creating a permission letter from a student to HOD for attending an event for more info refer code-wiki.md line 42
export const createPermissionLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationId, studentId, message } = req.body;

    if (!registrationId || !studentId) {
      res.status(400).json({ success: false, message: 'Registration and Student IDs are required' });
      return;
    }

    const registration = await Registration.findById(registrationId)
      .populate('studentId')
      .populate('eventId');

    if (!registration) {
      res.status(404).json({ success: false, message: 'Registration record not found' });
      return;
    }

    const student = registration.studentId as any;
    const event = registration.eventId as any;

    if (!event || !student) {
      res.status(404).json({ success: false, message: 'Event or student details not found' });
      return;
    }

    // Prevent duplicate pending letters for the same registration
    const existing = await Letter.findOne({ registrationId, status: 'PENDING' });
    if (existing) {
      res.json({ success: true, letter: existing, message: 'Permission letter already sent' });
      return;
    }

    const letter = await Letter.create({
      studentId,
      eventId: event._id,
      registrationId,
      studentName: student.name,
      studentRoll: student.studentId,
      classGroup: student.classGroup,
      eventTitle: event.title,
      eventDate: event.date ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined,
      eventVenue: event.location || event.venue,
      eventPoints: event.points,
      eventGroup: event.activityGroup,
      message: message || '',
      status: 'PENDING'
    });

    // Notify all HODs / staff advisors about the permission request
    const teachers = await User.find({ role: 'TEACHER' });
    for (const teacher of teachers) {
      await Notification.create({
        recipientId: teacher._id,
        senderName: student.name,
        title: 'HOD Permission Letter Request',
        message: `${student.name} (${student.studentId || 'Student'}) requests permission to attend "${event.title}" on ${letter.eventDate || 'scheduled date'} at ${letter.eventVenue || 'campus venue'}. +${event.points} ${event.activityGroup} points.`,
        type: 'VERIFICATION'
      });
    }

    res.status(201).json({
      success: true,
      letter,
      message: 'Permission letter sent to HOD for review.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create permission letter', error });
  }
};

// this function is used for fetching all permission letters for HOD advisor review queue for more info refer code-wiki.md line 43
export const getAllLetters = async (req: Request, res: Response): Promise<void> => {
  try {
    const letters = await Letter.find()
      .populate('studentId')
      .populate('eventId')
      .sort({ createdAt: -1 });

    res.json({ success: true, letters });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch permission letters', error });
  }
};

// this function is used for fetching permission letters for a specific student for more info refer code-wiki.md line 44
export const getStudentLetters = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const letters = await Letter.find({ studentId })
      .populate('eventId')
      .sort({ createdAt: -1 });

    res.json({ success: true, letters });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch student letters', error });
  }
};

// this function is used for approving or rejecting a student HOD permission letter with response note for more info refer code-wiki.md line 45
export const decideLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { decision, note, responderName } = req.body;

    if (!decision || !['APPROVED', 'REJECTED'].includes(decision)) {
      res.status(400).json({ success: false, message: 'Invalid decision. Use APPROVED or REJECTED.' });
      return;
    }

    const letter = await Letter.findById(id).populate('studentId');
    if (!letter) {
      res.status(404).json({ success: false, message: 'Permission letter not found' });
      return;
    }

    if (letter.status !== 'PENDING') {
      res.status(400).json({ success: false, message: 'This letter has already been reviewed' });
      return;
    }

    letter.status = decision as 'APPROVED' | 'REJECTED';
    letter.responseNote = note || '';
    letter.respondedBy = responderName || 'Head of Department';
    letter.respondedAt = new Date();
    await letter.save();

    const student = letter.studentId as any;

    // Notify student of the HOD decision
    await Notification.create({
      recipientId: student._id,
      senderName: letter.respondedBy,
      title: decision === 'APPROVED' ? 'HOD Permission Granted' : 'HOD Permission Declined',
      message: decision === 'APPROVED'
        ? `Your permission letter for "${letter.eventTitle}" has been approved. You may attend the event and complete gate verification for +${letter.eventPoints || 0} KTU points.`
        : `Your permission letter for "${letter.eventTitle}" was declined. ${note ? 'Reason: ' + note : ''}`,
      type: decision === 'APPROVED' ? 'VERIFICATION' : 'WARNING'
    });

    // When approved, forward the full event details to the staff advisor queue
    if (decision === 'APPROVED') {
      const teachers = await User.find({ role: 'TEACHER' });
      for (const teacher of teachers) {
        await Notification.create({
          recipientId: teacher._id,
          senderName: `${student.name} (HOD Approved)`,
          title: 'Approved Attendance: Event Details for Records',
          message: `HOD approved ${student.name} for "${letter.eventTitle}". Details — Date: ${letter.eventDate || 'TBD'}, Venue: ${letter.eventVenue || 'TBD'}, Points: +${letter.eventPoints || 0} (${letter.eventGroup || 'Group'}). Awaiting gate verification before point credit.`,
          type: 'VERIFICATION'
        });
      }
    }

    res.json({
      success: true,
      letter,
      message: decision === 'APPROVED' ? 'Permission granted. Event details forwarded to advisor records.' : 'Permission request declined.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update permission letter', error });
  }
};
