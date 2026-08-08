# KTUcoins Code Architecture & Function Wiki

This document serves as the authoritative, maintained technical wiki for function references and architectural documentation across the **KTUcoins** platform.

---

## Backend Subsystem (`backend/src/`)

### Database Connection
- **Line 10**: `connectDB()` (`backend/src/config/db.ts`)
  Establishes a MongoDB connection using Mongoose ODM with fallback to local MongoDB instance (`mongodb://127.0.0.1:27017/campuspulse`). Handles connection failure and logging.

### Seed Script & Initial Data
- **Line 14**: `seedInitialData()` (`backend/src/seed/seedProfiles.ts`)
  Inserts default demo profiles for Student ("Rahul V. S."), Organizer ("IEEE Student Branch Council"), and Staff Advisor ("Dr. Anjali Nair"), alongside initial poster events and discussion threads into MongoDB.

### Authentication & Profiles Controller
- **Line 18**: `getProfiles()` (`backend/src/controllers/authController.ts`)
  Fetches all stored user profiles from MongoDB to populate the instant role switcher in demo mode.
- **Line 20**: `createProfile()` (`backend/src/controllers/authController.ts`)
  Creates new student, organizer, or teacher profiles dynamically on the fly without complex signup validation.

### Event Opportunities Controller
- **Line 24**: `getAllEvents()` (`backend/src/controllers/eventController.ts`)
  Retrieves all published poster events sorted by creation date for the student vertical poster feed.
- **Line 26**: `getOrganizerEvents()` (`backend/src/controllers/eventController.ts`)
  Filters and returns opportunity poster events created by a specific organizer account.
- **Line 28**: `createEvent()` (`backend/src/controllers/eventController.ts`)
  Validates input, assigns KTU activity group tag, point value, venue, and poster URL, and saves a new event listing to MongoDB.

### Registration & Attendance QR Controller
- **Line 32**: `registerForEvent()` (`backend/src/controllers/registrationController.ts`)
  Registers a student for a specific event, checks registration caps, and generates a unique verifiable QR token (`KTU-EVENTID-STUDENTID-TIMESTAMP`).
- **Line 34**: `getStudentRegistrations()` (`backend/src/controllers/registrationController.ts`)
  Fetches a student's active registrations and attendance history populated with full event details.
- **Line 36**: `scanQRCode()` (`backend/src/controllers/registrationController.ts`)
  Processes an incoming QR token scanned at the event door by an organizer, verifies authenticity, and marks the student's status as `ATTENDED`.
- **Line 38**: `completeEvent()` (`backend/src/controllers/registrationController.ts`)
  Marks an event as complete and automatically forwards all verified `ATTENDED` registrations to the teacher approval queue with status `PENDING_APPROVAL`.
- **Line 40**: `getEventAttendees()` (`backend/src/controllers/registrationController.ts`)
  Retrieves student attendee lists and verification statuses for organizer management console.

### Teacher Approval & Roster Controller
- **Line 44**: `getPendingApprovals()` (`backend/src/controllers/teacherController.ts`)
  Fetches all student registrations waiting in `PENDING_APPROVAL` status for staff advisors.
- **Line 46**: `approveRegistration()` (`backend/src/controllers/teacherController.ts`)
  Approves a student activity point request, credits points to the student ledger, and records advisor approval details.
- **Line 48**: `rejectRegistration()` (`backend/src/controllers/teacherController.ts`)
  Rejects a student point request and updates registration status to `REJECTED`.
- **Line 50**: `getStudentRoster()` (`backend/src/controllers/teacherController.ts`)
  Aggregates student records and calculates running point totals across Group I, Group II, and Group III against the 100-point KTU requirement.

### Public Discussions Controller
- **Line 60**: `getDiscussions()` (`backend/src/controllers/discussionController.ts`)
  Retrieves all public forum discussion threads from MongoDB.
- **Line 61**: `createDiscussion()` (`backend/src/controllers/discussionController.ts`)
  Saves a new discussion thread document in MongoDB.
- **Line 62**: `upvoteDiscussion()` (`backend/src/controllers/discussionController.ts`)
  Increments the upvote count of a discussion thread in MongoDB.
- **Line 63**: `addCommentToDiscussion()` (`backend/src/controllers/discussionController.ts`)
  Pushes a new comment object into a thread document's comments array in MongoDB.

### Express Routing Setup
- **Line 54**: `setupRoutes()` (`backend/src/routes/api.ts`)
  Wires up Express REST API router endpoints including `/api/health`, profiles, events, registrations, QR scanning, teacher approvals, and public discussions.
- **Line 56**: `startServer()` (`backend/src/server.ts`)
  Initializes MongoDB database connection, triggers profile seeding, and starts the Express server listening on port 5000.

---

## Frontend Subsystem (`frontend/src/`)

### API Services Client
- **Line 63**: `fetchHealthCheck()` (`frontend/src/services/api.ts`)
  Calls `/api/health` to verify backend and MongoDB availability.
- **Line 64**: `fetchProfiles()` (`frontend/src/services/api.ts`)
  Calls `/api/profiles` endpoint to retrieve demo user identities.
- **Line 66**: `createProfile()` (`frontend/src/services/api.ts`)
  Calls `POST /api/profiles` to register a new user identity.
- **Line 68**: `fetchEvents()` (`frontend/src/services/api.ts`)
  Calls `/api/events` endpoint to load opportunity listings for the feed.
- **Line 70**: `createEvent()` (`frontend/src/services/api.ts`)
  Calls `POST /api/events` to publish a new event poster.
- **Line 72**: `registerForEvent()` (`frontend/src/services/api.ts`)
  Calls `POST /api/register` to claim an event slot and generate a QR pass.
- **Line 74**: `fetchStudentRegistrations()` (`frontend/src/services/api.ts`)
  Calls `/api/registrations/student/:studentId` to fetch student pass history.
- **Line 76**: `scanQRCode()` (`frontend/src/services/api.ts`)
  Calls `POST /api/scan-qr` to verify gate attendance using a QR token.
- **Line 78**: `completeEvent()` (`frontend/src/services/api.ts`)
  Calls `POST /api/complete-event` to finalize an event and trigger approval requests.
- **Line 80**: `fetchPendingApprovals()` (`frontend/src/services/api.ts`)
  Calls `/api/teacher/pending` to populate the advisor queue.
- **Line 82**: `approvePointRequest()` (`frontend/src/services/api.ts`)
  Calls `POST /api/teacher/approve` to credit points.
- **Line 84**: `rejectPointRequest()` (`frontend/src/services/api.ts`)
  Calls `POST /api/teacher/reject` to deny a point claim.
- **Line 86**: `fetchStudentRoster()` (`frontend/src/services/api.ts`)
  Calls `/api/teacher/roster` to load class point totals.
- **Line 87**: `fetchDiscussions()` (`frontend/src/services/api.ts`)
  Calls `/api/discussions` to load forum threads.
- **Line 88**: `createDiscussion()` (`frontend/src/services/api.ts`)
  Calls `POST /api/discussions` to post a new thread.
- **Line 89**: `upvoteDiscussion()` (`frontend/src/services/api.ts`)
  Calls `POST /api/discussions/:id/upvote` to upvote a thread.
- **Line 90**: `addCommentToDiscussion()` (`frontend/src/services/api.ts`)
  Calls `POST /api/discussions/:id/comment` to attach a comment.

### React Context & Auth Provider
- **Line 90**: `AuthProvider` (`frontend/src/context/AuthContext.tsx`)
  React context component managing active profile, active role, profile list, and global role switcher state.
- **Line 92**: `useAuth()` (`frontend/src/context/AuthContext.tsx`)
  Custom hook for consuming authentication state across components.

### Visual Branding & Animations
- **Line 96**: `CoinLogo` (`frontend/src/components/CoinLogo.tsx`)
  SVG gold coin emblem with anime.js rotation animation for KTUcoins branding without boxes.
- **Line 98**: `LoadingScreen` (`frontend/src/components/LoadingScreen.tsx`)
  Splash screen with anime.js logo pulse animation polling `/api/health` to verify MongoDB readiness.
- **Line 100**: `GachaRewardModal` (`frontend/src/components/GachaRewardModal.tsx`)
  Gacha game style anime.js summon celebration animation triggered upon earning or approving KTUcoins.

### Navigation & UI Components
- **Line 106**: `CreateProfileModal` (`frontend/src/components/CreateProfileModal.tsx`)
  Modal component for creating custom Student, Organizer, or Advisor profiles stored in MongoDB.
- **Line 108**: `PosterFeed` (`frontend/src/components/PosterFeed.tsx`)
  Signature vertical swipeable TikTok/Reels-style poster feed with swipe controls, 1-click registration, and KTU point badges.
- **Line 110**: `EventDetailsModal` (`frontend/src/components/EventDetailsModal.tsx`)
  Modal drawer displaying event description, points breakdown, venue, and registration CTA.
- **Line 112**: `QRModal` (`frontend/src/components/QRModal.tsx`)
  Displays student's verified entry QR pass generated via SVG.
- **Line 114**: `QRScannerModal` (`frontend/src/components/QRScannerModal.tsx`)
  Gate scanner interface for organizers supporting camera scanning and manual token verification.
- **Line 116**: `CreateEventModal` (`frontend/src/components/CreateEventModal.tsx`)
  Form modal for event organizers to post new campus posters directly to MongoDB.
- **Line 118**: `LoginScreen` (`frontend/src/components/LoginScreen.tsx`)
  Dedicated login and role selection screen with split layout inspired by Instagram preview image.
- **Line 120**: `Sidebar` (`frontend/src/components/Sidebar.tsx`)
  Instagram-style left vertical sidebar navigation for desktop and bottom navbar for mobile.

### Page Views
- **Line 124**: `StudentDashboard` (`frontend/src/pages/StudentDashboard.tsx`)
  Student dashboard displaying activity group progress bars (Group I/II/III) against 100-point target and registered event passes.
- **Line 126**: `OrganizerDashboard` (`frontend/src/pages/OrganizerDashboard.tsx`)
  Organizer console for creating events, scanning student QR codes, and completing events in MongoDB.
- **Line 128**: `TeacherDashboard` (`frontend/src/pages/TeacherDashboard.tsx`)
  Staff advisor console featuring 1-click point approval queue and student roster overview from MongoDB.
- **Line 130**: `DiscussionsPage` (`frontend/src/pages/DiscussionsPage.tsx`)
  Reddit-style public campus discussions forum with thread categories, upvoting, comments, and GIF attachment support synced live with MongoDB.

### App Container
- **Line 134**: `MainAppContent` (`frontend/src/App.tsx`)
  Main container rendering active view tabs, sidebar navigation, anime.js gacha reward modal, and global overlays.
- **Line 136**: `App` (`frontend/src/App.tsx`)
  Root React application component wrapped in `AuthProvider`.
