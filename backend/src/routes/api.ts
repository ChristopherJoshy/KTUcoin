import { Router } from 'express';
import mongoose from 'mongoose';
import { getProfiles, createProfile } from '../controllers/authController.js';
import { getAllEvents, getOrganizerEvents, createEvent } from '../controllers/eventController.js';
import { 
  registerForEvent, 
  getStudentRegistrations, 
  scanQRCode, 
  completeEvent, 
  getEventAttendees,
  submitManualPointRequest
} from '../controllers/registrationController.js';
import { 
  getPendingApprovals, 
  approveRegistration, 
  rejectRegistration, 
  getStudentRoster,
  searchStudents,
  assignStudentRole,
  notifyStudentDeficiency
} from '../controllers/teacherController.js';
import { 
  getDiscussions, 
  createDiscussion, 
  upvoteDiscussion, 
  addCommentToDiscussion 
} from '../controllers/discussionController.js';
import {
  getNotifications,
  sendNotification,
  markNotificationRead,
  updateUserProfile,
  toggleFollowUser
} from '../controllers/notificationController.js';
import {
  createPermissionLetter,
  getAllLetters,
  getStudentLetters,
  decideLetter
} from '../controllers/letterController.js';

const router = Router();

// this function is used for configuring REST API router endpoints for KTUcoins backend for more info refer code-wiki.md line 54
export const setupRoutes = (): Router => {
  // Health Check Endpoint
  router.get('/health', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.json({
      status: isConnected ? 'healthy' : 'connecting',
      dbState: mongoose.connection.readyState,
      timestamp: new Date()
    });
  });

  // Auth & Profiles
  router.get('/profiles', getProfiles);
  router.post('/profiles', createProfile);
  router.put('/user/profile/:userId', updateUserProfile);
  router.post('/user/follow', toggleFollowUser);

  // Events
  router.get('/events', getAllEvents);
  router.get('/events/organizer/:organizerId', getOrganizerEvents);
  router.post('/events', createEvent);

  // Registrations & Door Scanner & Manual Claims
  router.post('/register', registerForEvent);
  router.post('/request-points', submitManualPointRequest);
  router.get('/registrations/student/:studentId', getStudentRegistrations);
  router.get('/registrations/event/:eventId', getEventAttendees);
  router.post('/scan-qr', scanQRCode);
  router.post('/complete-event', completeEvent);

  // Teacher Approval & Roster & Student Management
  router.get('/teacher/pending', getPendingApprovals);
  router.post('/teacher/approve', approveRegistration);
  router.post('/teacher/reject', rejectRegistration);
  router.get('/teacher/roster', getStudentRoster);
  router.get('/teacher/students', searchStudents);
  router.post('/teacher/assign-role', assignStudentRole);
  router.post('/teacher/notify-deficiency', notifyStudentDeficiency);

  // Notifications System
  router.get('/notifications/:userId', getNotifications);
  router.post('/notifications/send', sendNotification);
  router.post('/notifications/:id/read', markNotificationRead);

  // HOD Permission Letters
  router.post('/letters', createPermissionLetter);
  router.get('/letters', getAllLetters);
  router.get('/letters/student/:studentId', getStudentLetters);
  router.post('/letters/:id/decide', decideLetter);

  // Public Discussions
  router.get('/discussions', getDiscussions);
  router.post('/discussions', createDiscussion);
  router.post('/discussions/:id/upvote', upvoteDiscussion);
  router.post('/discussions/:id/comment', addCommentToDiscussion);

  return router;
};

export default setupRoutes;
