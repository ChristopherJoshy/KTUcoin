import { Request, Response } from 'express';
import Registration from '../models/Registration.js';
import PointsLedger from '../models/PointsLedger.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

// this function is used for fetching pending point approval requests for teacher staff advisor queue for more info refer code-wiki.md line 44
export const getPendingApprovals = async (req: Request, res: Response): Promise<void> => {
  try {
    const pendingList = await Registration.find({ status: 'PENDING_APPROVAL' })
      .populate('studentId')
      .populate('eventId')
      .sort({ registeredAt: -1 });

    res.json({ success: true, pendingList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch pending approval queue', error });
  }
};

// this function is used for approving a student activity point request and crediting points for more info refer code-wiki.md line 46
export const approveRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationId, teacherId, teacherName } = req.body;

    const registration = await Registration.findById(registrationId)
      .populate('eventId')
      .populate('studentId');

    if (!registration) {
      res.status(404).json({ success: false, message: 'Registration record not found' });
      return;
    }

    if (registration.status === 'APPROVED') {
      res.json({ success: true, message: 'Points already credited for this registration' });
      return;
    }

    const event = registration.eventId as any;
    const student = registration.studentId as any;

    // Update status
    registration.status = 'APPROVED';
    await registration.save();

    // Create entry in Points Ledger
    const ledgerEntry = await PointsLedger.create({
      studentId: student._id,
      eventId: event._id,
      registrationId: registration._id,
      eventTitle: event.title,
      activityGroup: event.activityGroup,
      pointsAwarded: event.points,
      approvedByTeacherId: teacherId,
      approvedByTeacherName: teacherName || 'Staff Advisor',
      approvedAt: new Date()
    });

    res.json({
      success: true,
      message: `Approved! ${event.points} KTU ${event.activityGroup} points credited to ${student.name}.`,
      ledgerEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to approve point request', error });
  }
};

// this function is used for rejecting a student activity point request with feedback for more info refer code-wiki.md line 48
export const rejectRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationId } = req.body;

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      res.status(404).json({ success: false, message: 'Registration record not found' });
      return;
    }

    registration.status = 'REJECTED';
    await registration.save();

    res.json({ success: true, message: 'Point approval request rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reject point request', error });
  }
};

// this function is used for fetching student roster and running KTU activity point totals for teacher overview for more info refer code-wiki.md line 50
export const getStudentRoster = async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await User.find({ role: 'STUDENT' });

    // Aggregate earned points per student
    const rosterData = await Promise.all(
      students.map(async (student) => {
        const ledgerEntries = await PointsLedger.find({ studentId: student._id });
        
        let group1 = 0;
        let group2 = 0;
        let group3 = 0;

        ledgerEntries.forEach((entry) => {
          if (entry.activityGroup === 'Group I') group1 += entry.pointsAwarded;
          else if (entry.activityGroup === 'Group II') group2 += entry.pointsAwarded;
          else if (entry.activityGroup === 'Group III') group3 += entry.pointsAwarded;
        });

        const totalPoints = group1 + group2 + group3;

        return {
          student,
          pointsSummary: {
            group1,
            group2,
            group3,
            totalPoints,
            completedMinReq: totalPoints >= 100
          },
          earnedLedger: ledgerEntries
        };
      })
    );

    res.json({ success: true, roster: rosterData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch student roster', error });
  }
};
