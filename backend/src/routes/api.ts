import { Router } from 'express';
import mongoose from 'mongoose';
import { getProfiles, createProfile } from '../controllers/authController';
import { getAllEvents, getOrganizerEvents, createEvent } from '../controllers/eventController';
import { 
  registerForEvent, 
  getStudentRegistrations, 
  scanQRCode, 
  completeEvent, 
  getEventAttendees 
} from '../controllers/registrationController';
import { 
  getPendingApprovals, 
  approveRegistration, 
  rejectRegistration, 
  getStudentRoster 
} from '../controllers/teacherController';
import { 
  getDiscussions, 
  createDiscussion, 
  upvoteDiscussion, 
  addCommentToDiscussion 
} from '../controllers/discussionController';

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

  // Events
  router.get('/events', getAllEvents);
  router.get('/events/organizer/:organizerId', getOrganizerEvents);
  router.post('/events', createEvent);

  // Registrations & Door Scanner
  router.post('/register', registerForEvent);
  router.get('/registrations/student/:studentId', getStudentRegistrations);
  router.get('/registrations/event/:eventId', getEventAttendees);
  router.post('/scan-qr', scanQRCode);
  router.post('/complete-event', completeEvent);

  // Teacher Approval & Roster
  router.get('/teacher/pending', getPendingApprovals);
  router.post('/teacher/approve', approveRegistration);
  router.post('/teacher/reject', rejectRegistration);
  router.get('/teacher/roster', getStudentRoster);

  // Public Discussions
  router.get('/discussions', getDiscussions);
  router.post('/discussions', createDiscussion);
  router.post('/discussions/:id/upvote', upvoteDiscussion);
  router.post('/discussions/:id/comment', addCommentToDiscussion);

  return router;
};

export default setupRoutes;
