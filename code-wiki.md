# KTUcoins Code Architecture & Function Wiki

This document serves as the authoritative, maintained technical wiki for function references and architectural documentation across the **KTUcoins** platform.

---

## Backend Subsystem (`backend/src/`)

### Database Connection & Config
- **Line 10**: `connectDB()` (`backend/src/config/db.ts`)
  Establishes a MongoDB connection using Mongoose ODM with fallback to local MongoDB instance (`mongodb://127.0.0.1:27017/campuspulse`). Handles connection failure and logging.

### Seed Script & Initial Data
- **Line 6**: `seedInitialData()` (`backend/src/seed/seedProfiles.ts`)
  Inserts default demo profiles for Student ("Rahul V. S."), Organizer ("IEEE Student Branch Council"), and Staff Advisor ("Dr. Anjali Nair"), alongside initial poster events and campus discussion threads tied to the seeded events.

### Authentication & Profiles Controller
- **Line 5**: `getProfiles()` (`backend/src/controllers/authController.ts`)
  Fetches all stored user profiles from MongoDB to populate the instant role switcher in demo mode.
- **Line 15**: `createProfile()` (`backend/src/controllers/authController.ts`)
  Creates new student, organizer, or teacher profiles dynamically on the fly without complex signup validation.

### Event Opportunities Controller
- **Line 5**: `getAllEvents()` (`backend/src/controllers/eventController.ts`)
  Retrieves all published poster events sorted by creation date for the student vertical poster feed.
- **Line 15**: `getOrganizerEvents()` (`backend/src/controllers/eventController.ts`)
  Filters and returns opportunity poster events created by a specific organizer account.
- **Line 26**: `createEvent()` (`backend/src/controllers/eventController.ts`)
  Validates input, assigns KTU activity group tag, point value, venue, and poster URL, and saves a new event listing to MongoDB.

### Registration & Attendance QR Controller
- **Line 7**: `registerForEvent()` (`backend/src/controllers/registrationController.ts`)
  Registers a student for a specific event, checks registration caps, and generates a unique verifiable QR token (`KTU-EVENTID-STUDENTID-TIMESTAMP`).
- **Line 54**: `getStudentRegistrations()` (`backend/src/controllers/registrationController.ts`)
  Fetches a student's active registrations and attendance history populated with full event details.
- **Line 68**: `scanQRCode()` (`backend/src/controllers/registrationController.ts`)
  Processes an incoming QR token scanned at the event door by an organizer, verifies authenticity, and marks the student's status as `ATTENDED`.
- **Line 112**: `completeEvent()` (`backend/src/controllers/registrationController.ts`)
  Marks an event as complete and automatically forwards all verified `ATTENDED` registrations to the teacher approval queue with status `PENDING_APPROVAL`.
- **Line 142**: `getEventAttendees()` (`backend/src/controllers/registrationController.ts`)
  Retrieves student attendee lists and verification statuses for organizer management console.
- **Line 155**: `submitManualPointRequest()` (`backend/src/controllers/registrationController.ts`)
  Saves a student's manual activity point claim request with proof URL and forwards to advisor queue.

### Teacher Approval, Student Roster & Role Controller
- **Line 8**: `getPendingApprovals()` (`backend/src/controllers/teacherController.ts`)
  Fetches all student registrations waiting in `PENDING_APPROVAL` status for staff advisors.
- **Line 22**: `approveRegistration()` (`backend/src/controllers/teacherController.ts`)
  Approves a student activity point request, credits points to the student ledger, and records advisor approval details.
- **Line 72**: `rejectRegistration()` (`backend/src/controllers/teacherController.ts`)
  Rejects a student point request with feedback and updates registration status to `REJECTED`.
- **Line 111**: `getStudentRoster()` (`backend/src/controllers/teacherController.ts`)
  Aggregates student records and calculates running point totals across Group I, Group II, and Group III against the 120-point KTU requirement.
- **Line 151**: `searchStudents()` (`backend/src/controllers/teacherController.ts`)
  Searches students by name, student ID, department, or class for faculty advisors.
- **Line 167**: `assignStudentRole()` (`backend/src/controllers/teacherController.ts`)
  Assigns Class Representative (CR) status to a student and sends an instant role notification.
- **Line 192**: `notifyStudentDeficiency()` (`backend/src/controllers/teacherController.ts`)
  Sends targeted warning alert notification to students lacking required KTU activity points.

### Notifications & User Customization Controller
- **Line 6**: `getNotifications()` (`backend/src/controllers/notificationController.ts`)
  Retrieves user notifications from MongoDB.
- **Line 17**: `sendNotification()` (`backend/src/controllers/notificationController.ts`)
  Saves custom notification document in MongoDB.
- **Line 36**: `markNotificationRead()` (`backend/src/controllers/notificationController.ts`)
  Marks a notification document as read.
- **Line 47**: `assignCRRole()` (`backend/src/controllers/notificationController.ts`)
  Appoints Class Representative CR role in MongoDB.
- **Line 71**: `updateUserProfile()` (`backend/src/controllers/notificationController.ts`)
  Updates user bio, name, class group, and avatar URL in MongoDB.
- **Line 87**: `toggleFollowUser()` (`backend/src/controllers/notificationController.ts`)
  Toggles follow/unfollow status between users and triggers follow alert.

### Public Discussions Controller
- **Line 5**: `getDiscussions()` (`backend/src/controllers/discussionController.ts`)
  Retrieves all public forum discussion threads from MongoDB.
- **Line 15**: `createDiscussion()` (`backend/src/controllers/discussionController.ts`)
  Saves a new discussion thread document in MongoDB.
- **Line 36**: `upvoteDiscussion()` (`backend/src/controllers/discussionController.ts`)
  Increments the upvote count of a discussion thread in MongoDB.
- **Line 51**: `addCommentToDiscussion()` (`backend/src/controllers/discussionController.ts`)
  Pushes a new comment object into a thread document's comments array in MongoDB.

### Permission Letter (HOD Approval) Controller
- **Line 5**: `ILetter` (`backend/src/models/Letter.ts`)
  Mongoose model for student HOD permission letters with denormalized student/event fields and `PENDING` / `APPROVED` / `REJECTED` status.
- **Line 9**: `createPermissionLetter()` (`backend/src/controllers/letterController.ts`)
  Creates a student permission letter for a registration, notifies all teachers, and updates the registration status to `AWAITING_APPROVAL`.
- **Line 81**: `getAllLetters()` (`backend/src/controllers/letterController.ts`)
  Fetches all permission letters for teacher advisors ordered by pending status and date.
- **Line 95**: `getStudentLetters()` (`backend/src/controllers/letterController.ts`)
  Fetches the letter history of a specific student.
- **Line 109**: `decideLetter()` (`backend/src/controllers/letterController.ts`)
  Approves or rejects a letter with an advisor note, notifies the student, and on approval forwards full event details to advisor records and allows attendance.

### Express Routing Setup
- **Line 45**: `setupRoutes()` (`backend/src/routes/api.ts`)
  Wires up Express REST API router endpoints including `/api/health`, profiles, user customizations, events, registrations, manual point requests, door scanning, teacher approvals, permission letters (`POST /letters`, `GET /letters`, `GET /letters/student/:studentId`, `POST /letters/:id/decide`), notifications, and public discussions.

---

## Frontend Subsystem (`frontend/src/`)

### API Services Client
- **Line 6**: `fetchHealthCheck()` (`frontend/src/services/api.ts`)
  Calls `/api/health` to verify backend and MongoDB availability. Throws on failure so the loading screen can retry.
- **Line 17**: `fetchProfiles()` (`frontend/src/services/api.ts`)
  Calls `/api/profiles` endpoint to retrieve demo user identities.
- **Line 26**: `createProfile()` (`frontend/src/services/api.ts`)
  Calls `POST /api/profiles` to register a new user identity.
- **Line 38**: `updateUserProfile()` (`frontend/src/services/api.ts`)
  Calls `PUT /api/user/profile/:userId` to save user bio and customizations.
- **Line 50**: `toggleFollowUser()` (`frontend/src/services/api.ts`)
  Calls `POST /api/user/follow` to follow or unfollow another user profile.
- **Line 61**: `fetchEvents()` (`frontend/src/services/api.ts`)
  Calls `/api/events` endpoint to load opportunity listings for the feed.
- **Line 70**: `createEvent()` (`frontend/src/services/api.ts`)
  Calls `POST /api/events` to publish a new event poster.
- **Line 82**: `registerForEvent()` (`frontend/src/services/api.ts`)
  Calls `POST /api/register` to claim an event slot and generate a QR pass.
- **Line 97**: `submitManualPointRequest()` (`frontend/src/services/api.ts`)
  Calls `POST /api/request-points` to submit a manual activity claim.
- **Line 118**: `fetchStudentRegistrations()` (`frontend/src/services/api.ts`)
  Calls `/api/registrations/student/:studentId` to fetch student pass history.
- **Line 126**: `fetchEventAttendees()` (`frontend/src/services/api.ts`)
  Calls `/api/registrations/event/:eventId` to fetch registered attendees list.
- **Line 134**: `scanQRCode()` (`frontend/src/services/api.ts`)
  Calls `POST /api/scan-qr` to verify gate attendance using a QR token.
- **Line 148**: `completeEvent()` (`frontend/src/services/api.ts`)
  Calls `POST /api/complete-event` to finalize an event and trigger approval requests.
- **Line 159**: `fetchPendingApprovals()` (`frontend/src/services/api.ts`)
  Calls `/api/teacher/pending` to populate the advisor queue.
- **Line 167**: `approvePointRequest()` (`frontend/src/services/api.ts`)
  Calls `POST /api/teacher/approve` to credit points.
- **Line 178**: `rejectPointRequest()` (`frontend/src/services/api.ts`)
  Calls `POST /api/teacher/reject` to deny a point claim.
- **Line 189**: `fetchStudentRoster()` (`frontend/src/services/api.ts`)
  Calls `/api/teacher/roster` to load class point totals.
- **Line 197**: `searchStudents()` (`frontend/src/services/api.ts`)
  Calls `/api/teacher/students` to search student records.
- **Line 205**: `assignStudentRole()` (`frontend/src/services/api.ts`)
  Calls `POST /api/teacher/assign-role` to update CR status.
- **Line 216**: `notifyStudentDeficiency()` (`frontend/src/services/api.ts`)
  Calls `POST /api/teacher/notify-deficiency` to send low point warning.
- **Line 227**: `fetchNotifications()` (`frontend/src/services/api.ts`)
  Calls `/api/notifications/:userId` to retrieve user notifications.
- **Line 235**: `markNotificationRead()` (`frontend/src/services/api.ts`)
  Calls `POST /api/notifications/:id/read` to mark notification read.
- **Line 244**: `fetchDiscussions()` (`frontend/src/services/api.ts`)
  Calls `/api/discussions` to load forum threads.
- **Line 252**: `createDiscussion()` (`frontend/src/services/api.ts`)
  Calls `POST /api/discussions` to publish a new thread.
- **Line 263**: `upvoteDiscussion()` (`frontend/src/services/api.ts`)
  Calls `POST /api/discussions/:id/upvote` to increment thread votes.
- **Line 272**: `addCommentToDiscussion()` (`frontend/src/services/api.ts`)
  Calls `POST /api/discussions/:id/comments` to attach a comment or GIF.
- **Line 283**: `sendPermissionLetter()` (`frontend/src/services/api.ts`)
  Calls `POST /api/letters` to submit a student HOD permission letter for a registration.
- **Line 297**: `fetchPermissionLetters()` (`frontend/src/services/api.ts`)
  Calls `GET /api/letters` to load the teacher approval letter queue.
- **Line 305**: `fetchStudentLetters()` (`frontend/src/services/api.ts`)
  Calls `GET /api/letters/student/:studentId` to load a student's letter history.
- **Line 313**: `decidePermissionLetter()` (`frontend/src/services/api.ts`)
  Calls `POST /api/letters/:id/decide` to approve or reject a permission letter with a note.

### React Context & Auth Provider
- **Line 23**: `AuthProvider` (`frontend/src/context/AuthContext.tsx`)
  React context component managing active profile, active role, profile list, and global role switcher state.
- **Line 123**: `useAuth()` (`frontend/src/context/AuthContext.tsx`)
  Custom hook for consuming authentication state across components.
- **Line 11**: `ThemeProvider` / **Line 41**: `useTheme()` (`frontend/src/context/ThemeContext.tsx`)
  React context provider and hook managing global dark mode and light mode state with localStorage persistence and `color-scheme` sync.

### Shared UI Primitives (`frontend/src/components/ui/`)
- **Line 19**: `Modal` (`frontend/src/components/ui/Modal.tsx`)
  Framer-motion animated shared modal shell with backdrop blur, scroll lock, Escape close, size variants (`sm`/`md`/`lg`/`xl`), optional header icon/action, and mobile bottom-sheet layout.
- **Line 43**: `ToastProvider` / **Line 117**: `useToast()` (`frontend/src/components/ui/Toast.tsx`)
  Global toast notification provider with success, error, info, and warning variants and auto-dismiss replacing native `alert()`.
- **Line 25**: `ConfirmProvider` / **Line 121**: `useConfirm()` (`frontend/src/components/ui/ConfirmDialog.tsx`)
  Promise-based global confirm dialog provider replacing native `confirm()` with tone variants and custom labels.
- **Line 23**: `Badge` (`frontend/src/components/ui/Badge.tsx`)
  Small pill badge with seven tone variants for status, role, and point labels.
- **Line 13**: `PageHeader` (`frontend/src/components/ui/PageHeader.tsx`)
  Card-style page heading with title, subtitle, optional icon, and action slot for dashboard views.
- **Line 14**: `StatCard` (`frontend/src/components/ui/StatCard.tsx`)
  Compact stat tile with icon, value, label, and tone accent for dashboard metric grids.
- **Line 13**: `EmptyState` (`frontend/src/components/ui/EmptyState.tsx`)
  Centered empty-state placeholder with icon, title, description, and optional action button.
- **Line 5**: `cn()` (`frontend/src/lib/cn.ts`)
  Tailwind class merge utility combining `clsx` and `tailwind-merge` for conditional styling.

### Visual Branding & Animations
- **Line 10**: `CoinLogo` (`frontend/src/components/CoinLogo.tsx`)
  SVG gold coin emblem with anime.js rotation animation for KTUcoins branding.
- **Line 12**: `LoadingScreen` (`frontend/src/components/LoadingScreen.tsx`)
  Splash screen with anime.js logo pulse animation polling `/api/health` every 1 second until the backend responds (handles Render free-tier cold starts) before proceeding.
- **Line 15**: `GachaRewardModal` (`frontend/src/components/GachaRewardModal.tsx`)
  Gacha game style anime.js summon celebration animation triggered upon earning or approving KTUcoins.

### Navigation & UI Components
- **Line 4**: `SkeletonLoader` (`frontend/src/components/SkeletonLoader.tsx`)
  Renders paper-light theme skeleton placeholders for feed, tables, and card widgets.
- **Line 27**: `UserProfileModal` (`frontend/src/components/UserProfileModal.tsx`)
  Instagram-style user profile card, customization modal, follower stats, and role display.
- **Line 18**: `NotificationsModal` (`frontend/src/components/NotificationsModal.tsx`)
  Notifications drawer fetching `/api/notifications` with type filter pills and unread highlighting.
- **Line 15**: `RequestPointsModal` (`frontend/src/components/RequestPointsModal.tsx`)
  Modal drawer allowing students to submit manual activity point requests to teacher.
- **Line 15**: `EventAttendeesModal` (`frontend/src/components/EventAttendeesModal.tsx`)
  Organizer view displaying registered student participants list, gate verification status, and CSV export.
- **Line 14**: `QRModal` (`frontend/src/components/QRModal.tsx`)
  Displays student's verified entry QR pass generated via SVG with canvas image download.
- **Line 15**: `QRScannerModal` (`frontend/src/components/QRScannerModal.tsx`)
  Organizer live webcam QR camera scanner using html5-qrcode and token verification modal.
- **Line 35**: `PosterFeed` (`frontend/src/components/PosterFeed.tsx`)
  Signature vertical swipeable TikTok/Reels-style poster feed with swipe controls, KTU point badges, a desktop side details panel with expandable rules section, and a mobile overlay drawer.
- **Line 39**: `Sidebar` (`frontend/src/components/Sidebar.tsx`)
  Instagram-style left vertical sidebar navigation for desktop and bottom navbar for mobile.
- **Line 17**: `CreateEventModal` (`frontend/src/components/CreateEventModal.tsx`)
  Event creation modal with official KTU regulation presets, activity group picker, and point credit banner.
- **Line 15**: `CreateProfileModal` (`frontend/src/components/CreateProfileModal.tsx`)
  Modal for creating new student, organizer, or teacher demo profiles with role type cards.
- **Line 30**: `EventDetailsModal` (`frontend/src/components/EventDetailsModal.tsx`)
  Event detail sheet with register action, QR pass, and HOD permission letter submission step.

### Page Views
- **Line 19**: `StudentDashboard` (`frontend/src/pages/StudentDashboard.tsx`)
  Student dashboard displaying activity group progress bars (Group I/II/III) against 120-point target and registered event passes.
- **Line 33**: `OrganizerDashboard` (`frontend/src/pages/OrganizerDashboard.tsx`)
  Organizer console for creating events, scanning student QR codes, and viewing registered participants.
- **Line 42**: `TeacherDashboard` (`frontend/src/pages/TeacherDashboard.tsx`)
  Staff advisor console featuring 1-click point approval queue, HOD letter approvals, CR role assignment, deficiency warnings, and student roster overview.
- **Line 48**: `DiscussionsPage` (`frontend/src/pages/DiscussionsPage.tsx`)
  Reddit-style public campus discussions forum with thread categories, upvoting, comments, and GIF attachment support synced live with MongoDB.

### App Container
- **Line 24**: `MainAppContent` (`frontend/src/App.tsx`)
  Main container rendering active view tabs, sidebar navigation, anime.js gacha reward modal, and global overlays.
- **Line 228**: `App` (`frontend/src/App.tsx`)
  Root React application component wrapped in `AuthProvider`, `ToastProvider`, and `ConfirmProvider`.
