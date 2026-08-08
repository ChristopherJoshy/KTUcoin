import { Router } from 'express';
import { getProfiles, createProfile } from '../controllers/authController.js';
import { getAllEvents, getOrganizerEvents, createEvent } from '../controllers/eventController.js';
import { 
  registerForEvent, 
  getStudentRegistrations, 
  scanQRCode, 
  completeEvent, 
  getEventAttendees 
} from '../controllers/registrationController.js';
import { 
  getPendingApprovals, 
  approveRegistration, 
  rejectRegistration, 
  getStudentRoster 
} from '../controllers/teacherController.js';

const router = Router();

// this function is used for configuring REST API routing endpoints across the platform for more info refer code-wiki.md line 54
export const setupRoutes = (): Router => {
  // Profiles / Fake Auth
  router.get('/profiles', getProfiles);
  router.post('/profiles', createProfile);

  // Events
  router.get('/events', getAllEvents);
  router.get('/events/organizer/:organizerId', getOrganizerEvents);
  router.post('/events', createEvent);

  // Registration & Attendance QR Lifecycle
  router.post('/register', registerForEvent);
  router.get('/registrations/student/:studentId', getStudentRegistrations);
  router.post('/scan-qr', scanQRCode);
  router.post('/complete-event', completeEvent);
  router.get('/attendees/event/:eventId', getEventAttendees);

  // Teacher Approval Queue & Roster
  router.get('/teacher/pending', getPendingApprovals);
  router.post('/teacher/approve', approveRegistration);
  router.post('/teacher/reject', rejectRegistration);
  router.get('/teacher/roster', getStudentRoster);

  return router;
};

export default setupRoutes;
