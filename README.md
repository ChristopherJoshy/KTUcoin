# CampusPulse — Campus Opportunities & KTU Activity Points Platform

> **Stack Wars 24-Hour Solo Hackathon Entry**
> Theme: *Reimagine the Campus*

CampusPulse is a full-stack platform designed to help engineering students discover internships, technical hackathons, workshops, fests, and social initiatives that count toward mandatory **KTU Activity Points** graduation requirements, while automating the entire lifecycle from discovery to point-crediting.

---

## 🚀 The End-to-End Lifecycle Flow

```
Discover (Poster Feed) ➔ Register ➔ Verified Attendance (QR Scan) ➔ Teacher Approval ➔ Points Credited
```

---

## 🌟 Key Features & Role Breakdown

### 1. Signature Discovery Feed (Student Showcase)
- **TikTok/Reels-style vertical poster feed** featuring full-screen visual event posters.
- Keyboard navigation (Up/Down arrow keys) or touch scrolling.
- Instant 1-click event slot registration & QR pass generation.
- Real-time KTU Activity Group badging:
  - **Group I**: Technical / Seminars / Workshops
  - **Group II**: NSS / Sports / Leadership Initiatives
  - **Group III**: Cultural / Arts / Competitions

### 2. Student Dashboard
- Visual progress tracking toward the mandatory 120 KTU Activity Points graduation minimum.
- Progress bars broken down across Group I, Group II, and Group III.
- Registered event pass history with 1-click QR code display.

### 3. Organizer Console (Clubs, Depts & Cells)
- Opportunity creator panel to post new campus posters with custom point values, registration caps, and venue details.
- Integrated gate scanner UI to scan student QR passes at the door.
- "Mark Completed" trigger that automatically forwards verified student gate scans to the Staff Advisor queue.

### 4. Staff Advisor / HOD Queue
- 1-Click approval queue for pending point requests from completed events.
- Automatic credit to student ledgers upon approval (with celebratory confetti feedback).
- Student roster view tracking class progress toward degree requirements.

---

## 🛠️ Tech Stack & Architecture

- **Runtime & Package Manager**: [Bun](https://bun.sh)
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, `qrcode.react`
- **Backend**: Express.js, TypeScript, Mongoose (MongoDB ODM), CORS
- **Database**: MongoDB

---

## 📁 Project Structure

```
Stack Wars/
├── README.md
├── code-wiki.md
├── backend/
│   ├── src/
│   │   ├── config/        # MongoDB connection
│   │   ├── controllers/   # Auth, Event, Registration, Teacher logic
│   │   ├── models/        # User, Event, Registration, PointsLedger schemas
│   │   ├── routes/        # Express REST API routes
│   │   ├── seed/          # Initial seed script
│   │   └── server.ts      # Server entry point
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/    # PosterFeed, Navbar, Modals
    │   ├── context/       # Auth & Role Context
    │   ├── pages/         # Student, Organizer, Teacher Dashboards
    │   ├── services/      # REST API client
    │   ├── types/         # TS interfaces
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
- [Bun](https://bun.sh) installed (`bun --version`)
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string.

### 1. Backend Setup
```bash
cd backend
bun install
bun run dev
```
*Backend runs at `http://localhost:5000` and automatically seeds initial demo profiles.*

### 2. Frontend Setup
Open a new terminal window:
```bash
cd frontend
bun install
bun run dev
```
*Frontend runs at `http://localhost:3000`.*

---

## 🔑 Authentication Architecture Note

To maximize evaluator efficiency during hackathon review, CampusPulse utilizes a **Frictionless Demo Role System**:
- No complex password/email verification is required.
- Pre-loaded profiles (1 Student, 1 Organizer, 1 Advisor) are selectable in 1 click.
- Evaluators can create custom profiles dynamically via the "New Profile" button.

---

## ✂️ Scope Cuts & Future Roadmap

1. **Simplified Points Engine**: Events carry flat point values assigned by organizers. KTU's level-based caps and tier multipliers are framed for future release.
2. **In-App Queue vs SMS Notifications**: Advisor notification is managed via an in-app queue rather than external SMS/Email APIs.
3. **Cryptographic QR Validation**: QR tokens use unique registration strings optimized for demo performance.
