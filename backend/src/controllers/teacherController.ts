import { Request, Response } from 'express';
import Registration from '../models/Registration.js';
import PointsLedger from '../models/PointsLedger.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

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

    const student = registration.studentId as any;
    let eventTitle = 'Campus Activity';
    let activityGroup = 'Group I Social';
    let points = 20;
    let eventObjId = registration.eventId ? (registration.eventId as any)._id : registration._id;

    if (registration.isManualClaim) {
      eventTitle = registration.claimTitle || 'Manual Activity Claim';
      activityGroup = registration.claimGroup || 'Group I Social';
      points = registration.claimPoints || 20;
    } else if (registration.eventId) {
      const event = registration.eventId as any;
      eventTitle = event.title;
      activityGroup = event.activityGroup;
      points = event.points;
    }

    // Update status
    registration.status = 'APPROVED';
    await registration.save();

    // Create entry in Points Ledger
    const ledgerEntry = await PointsLedger.create({
      studentId: student._id,
      eventId: eventObjId,
      registrationId: registration._id,
      eventTitle,
      activityGroup,
      pointsAwarded: points,
      approvedByTeacherId: teacherId || student._id,
      approvedByTeacherName: teacherName || 'Staff Advisor',
      approvedAt: new Date()
    });

    // Send notification to student
    await Notification.create({
      recipientId: student._id,
      senderName: teacherName || 'Staff Advisor',
      title: 'KTU Activity Points Credited!',
      message: `Your request for "${eventTitle}" (${points} Points under ${activityGroup}) has been approved!`,
      type: 'POINT_CREDIT'
    });

    res.json({
      success: true,
      message: `Approved! ${points} KTU ${activityGroup} points credited to ${student.name}.`,
      ledgerEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to approve point request', error });
  }
};

// this function is used for rejecting a student activity point request with feedback for more info refer code-wiki.md line 48
export const rejectRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationId, teacherName, reason } = req.body;

    const registration = await Registration.findById(registrationId).populate('studentId');
    if (!registration) {
      res.status(404).json({ success: false, message: 'Registration record not found' });
      return;
    }

    registration.status = 'REJECTED';
    await registration.save();

    const student = registration.studentId as any;
    if (student) {
      await Notification.create({
        recipientId: student._id,
        senderName: teacherName || 'Staff Advisor',
        title: 'Activity Point Request Status Update',
        message: `Your point claim was rejected by your advisor. ${reason ? 'Reason: ' + reason : ''}`,
        type: 'WARNING'
      });
    }

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
          if (entry.activityGroup.includes('Group I')) group1 += entry.pointsAwarded;
          else if (entry.activityGroup.includes('Group II')) group2 += entry.pointsAwarded;
          else if (entry.activityGroup.includes('Group III')) group3 += entry.pointsAwarded;
        });

        const totalPoints = group1 + group2 + group3;

        return {
          student,
          pointsSummary: {
            group1,
            group2,
            group3,
            totalPoints,
            completedMinReq: totalPoints >= 120
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

// this function is used for searching students by name, ID, or class for teacher management for more info refer code-wiki.md line 51
export const searchStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = (req.query.q as string) || '';
    const regex = new RegExp(query, 'i');

    const students = await User.find({
      role: 'STUDENT',
      $or: [{ name: regex }, { studentId: regex }, { department: regex }, { classGroup: regex }]
    });

    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search students', error });
  }
};

// this function is used for assigning Class Representative CR or student role for more info refer code-wiki.md line 52
export const assignStudentRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, isCR, assignedByTeacherName } = req.body;

    const student = await User.findByIdAndUpdate(studentId, { isCR }, { new: true });
    if (!student) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    await Notification.create({
      recipientId: student._id,
      senderName: assignedByTeacherName || 'Staff Advisor',
      title: isCR ? 'Assigned as Class Representative (CR)' : 'Role Updated',
      message: isCR
        ? `You have been appointed as Class Representative (CR) for ${student.classGroup || student.department}.`
        : `Your Class Representative status has been updated.`,
      type: 'ROLE_ASSIGN'
    });

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to assign role', error });
  }
};

// this function is used for notifying student of lack of activity points for more info refer code-wiki.md line 53
export const notifyStudentDeficiency = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, teacherName, currentPoints } = req.body;

    const student = await User.findById(studentId);
    if (!student) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    const needed = 120 - (currentPoints || 0);
    const notification = await Notification.create({
      recipientId: student._id,
      senderName: teacherName || 'Staff Advisor',
      title: 'Action Required: KTU Activity Points Deficiency Alert',
      message: `You currently have ${currentPoints || 0} / 120 KTU Activity Points. You require ${needed > 0 ? needed : 0} more points for degree eligibility. Please register for upcoming campus events.`,
      type: 'WARNING'
    });

    res.json({ success: true, message: `Notification sent to ${student.name}!`, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send deficiency notification', error });
  }
};
