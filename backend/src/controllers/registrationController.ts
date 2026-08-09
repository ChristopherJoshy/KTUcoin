import { Request, Response } from 'express';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// this function is used for registering a student for an event and generating a unique QR code token for more info refer code-wiki.md line 32
export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, studentId } = req.body;

    if (!eventId || !studentId) {
      res.status(400).json({ success: false, message: 'Event ID and Student ID are required' });
      return;
    }

    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    // Check if already registered
    const existing = await Registration.findOne({ eventId, studentId });
    if (existing) {
      res.json({ success: true, registration: existing, message: 'Already registered' });
      return;
    }

    if (event.registeredCount >= event.registrationCap) {
      res.status(400).json({ success: false, message: 'Event registration cap reached' });
      return;
    }

    // Generate clean verifiable unique token
    const qrCodeToken = `KTU-${eventId.toString().slice(-6)}-${studentId.toString().slice(-6)}-${Date.now().toString(36).toUpperCase()}`;

    const registration = await Registration.create({
      eventId,
      studentId,
      qrCodeToken,
      status: 'REGISTERED'
    });

    // Update event registered count
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

    res.status(201).json({ success: true, registration });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to register for event', error });
  }
};

// this function is used for fetching registered events and QR codes for a student for more info refer code-wiki.md line 34
export const getStudentRegistrations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const registrations = await Registration.find({ studentId })
      .populate('eventId')
      .sort({ registeredAt: -1 });

    res.json({ success: true, registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch student registrations', error });
  }
};

// this function is used for scanning a student QR code at an event to mark attendance for more info refer code-wiki.md line 36
export const scanQRCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { qrCodeToken } = req.body;

    if (!qrCodeToken) {
      res.status(400).json({ success: false, message: 'QR Code Token is required' });
      return;
    }

    const registration = await Registration.findOne({ qrCodeToken })
      .populate('studentId')
      .populate('eventId');

    if (!registration) {
      res.status(404).json({ success: false, message: 'Invalid or unrecognized QR Code' });
      return;
    }

    if (registration.attended) {
      res.json({ 
        success: true, 
        alreadyScanned: true, 
        message: 'Attendance already marked for this student!',
        registration 
      });
      return;
    }

    registration.attended = true;
    registration.attendedAt = new Date();
    registration.status = 'ATTENDED';
    await registration.save();

    res.json({
      success: true,
      message: 'Attendance successfully verified via QR scan!',
      registration
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process QR code scan', error });
  }
};

// this function is used for marking an event completed and forwarding attended students for teacher point approval for more info refer code-wiki.md line 38
export const completeEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    event.isCompleted = true;
    await event.save();

    // Move all 'ATTENDED' registrations to 'PENDING_APPROVAL'
    const result = await Registration.updateMany(
      { eventId, attended: true, status: 'ATTENDED' },
      { $set: { status: 'PENDING_APPROVAL' } }
    );

    res.json({
      success: true,
      message: `Event marked complete! ${result.modifiedCount} attended student registrations forwarded for teacher approval.`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to complete event', error });
  }
};

// this function is used for fetching attendee list for a specific event for organizer dashboard for more info refer code-wiki.md line 40
export const getEventAttendees = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const attendees = await Registration.find({ eventId })
      .populate('studentId')
      .sort({ registeredAt: -1 });

    res.json({ success: true, attendees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch attendees', error });
  }
};

// this function is used for submitting a manual activity point request from student to staff advisor queue for more info refer code-wiki.md line 41
export const submitManualPointRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, claimTitle, claimGroup, claimPoints, proofUrl, proofDescription } = req.body;

    if (!studentId || !claimTitle || !claimGroup || !claimPoints) {
      res.status(400).json({ success: false, message: 'Missing required manual claim fields' });
      return;
    }

    const student = await User.findById(studentId);
    if (!student) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    const qrCodeToken = `KTU-MANUAL-${studentId.toString().slice(-6)}-${Date.now().toString(36).toUpperCase()}`;

    const registration = await Registration.create({
      studentId,
      qrCodeToken,
      status: 'PENDING_APPROVAL',
      isManualClaim: true,
      claimTitle,
      claimGroup,
      claimPoints: Number(claimPoints),
      proofUrl: proofUrl || '',
      proofDescription: proofDescription || 'Manual activity submission with proof document attached.'
    });

    // Find teachers/staff advisors to notify
    const teachers = await User.find({ role: 'TEACHER' });
    for (const teacher of teachers) {
      await Notification.create({
        recipientId: teacher._id,
        senderName: student.name,
        title: 'New Activity Point Approval Request',
        message: `${student.name} (${student.studentId || 'Student'}) submitted a claim for "${claimTitle}" (+${claimPoints} ${claimGroup} pts).`,
        type: 'VERIFICATION'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Point request submitted to your Staff Advisor approval queue!',
      registration
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit point request', error });
  }
};
