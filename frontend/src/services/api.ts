import { User, CampusEvent, Registration, RosterItem } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// this function is used for fetching seeded demo profiles from backend for more info refer code-wiki.md line 64
export const fetchProfiles = async (): Promise<User[]> => {
  const res = await fetch(`${API_BASE}/profiles`);
  const data = await res.json();
  return data.users || [];
};

// this function is used for creating new student, organizer, or teacher profiles for more info refer code-wiki.md line 66
export const createProfile = async (profileData: Partial<User>): Promise<User> => {
  const res = await fetch(`${API_BASE}/profiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.user;
};

// this function is used for fetching all events for poster feed for more info refer code-wiki.md line 68
export const fetchEvents = async (): Promise<CampusEvent[]> => {
  const res = await fetch(`${API_BASE}/events`);
  const data = await res.json();
  return data.events || [];
};

// this function is used for creating a new opportunity event by an organizer for more info refer code-wiki.md line 70
export const createEvent = async (eventData: Partial<CampusEvent>): Promise<CampusEvent> => {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.event;
};

// this function is used for registering student for an event for more info refer code-wiki.md line 72
export const registerForEvent = async (eventId: string, studentId: string): Promise<Registration> => {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId, studentId })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.registration;
};

// this function is used for fetching registered events for student dashboard for more info refer code-wiki.md line 74
export const fetchStudentRegistrations = async (studentId: string): Promise<Registration[]> => {
  const res = await fetch(`${API_BASE}/registrations/student/${studentId}`);
  const data = await res.json();
  return data.registrations || [];
};

// this function is used for scanning student QR code to mark attendance for more info refer code-wiki.md line 76
export const scanQRCode = async (qrCodeToken: string) => {
  const res = await fetch(`${API_BASE}/scan-qr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrCodeToken })
  });
  return await res.json();
};

// this function is used for completing an event and moving attendees to teacher queue for more info refer code-wiki.md line 78
export const completeEvent = async (eventId: string) => {
  const res = await fetch(`${API_BASE}/complete-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId })
  });
  return await res.json();
};

// this function is used for fetching pending point approvals for teacher queue for more info refer code-wiki.md line 80
export const fetchPendingApprovals = async (): Promise<Registration[]> => {
  const res = await fetch(`${API_BASE}/teacher/pending`);
  const data = await res.json();
  return data.pendingList || [];
};

// this function is used for approving student activity points for more info refer code-wiki.md line 82
export const approvePointRequest = async (registrationId: string, teacherId: string, teacherName: string) => {
  const res = await fetch(`${API_BASE}/teacher/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ registrationId, teacherId, teacherName })
  });
  return await res.json();
};

// this function is used for rejecting student activity point request for more info refer code-wiki.md line 84
export const rejectPointRequest = async (registrationId: string) => {
  const res = await fetch(`${API_BASE}/teacher/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ registrationId })
  });
  return await res.json();
};

// this function is used for fetching student roster with point totals for teacher staff advisor view for more info refer code-wiki.md line 86
export const fetchStudentRoster = async (): Promise<RosterItem[]> => {
  const res = await fetch(`${API_BASE}/teacher/roster`);
  const data = await res.json();
  return data.roster || [];
};
