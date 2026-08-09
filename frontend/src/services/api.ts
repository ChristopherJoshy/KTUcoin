import { UserProfile, CampusEvent, Registration, PermissionLetter } from '../types';

// this function is used for normalizing the backend base URL by stripping trailing slashes and ensuring the /api suffix for more info refer code-wiki.md line 4
const normalizeApiBase = (raw: string): string => {
  const trimmed = raw.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const envBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '';
const isLocal = /localhost|127\.0\.0\.1/.test(window.location.hostname);

const API_BASE = envBase
  ? normalizeApiBase(envBase)
  : isLocal
    ? '/api'
    : 'https://ktucoin.onrender.com/api';

// this function is used for checking backend health and MongoDB connection status for more info refer code-wiki.md line 12
export const fetchHealthCheck = async (): Promise<{ status: string }> => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend not reachable');
    return await res.json();
  } catch (err) {
    throw err;
  }
};

// this function is used for fetching stored user profiles from backend for more info refer code-wiki.md line 13
export const fetchProfiles = async (): Promise<UserProfile[]> => {
  const res = await fetch(`${API_BASE}/profiles`);
  if (!res.ok) throw new Error('Failed to fetch profiles');
  const data = await res.json();
  const list = data.users || (Array.isArray(data) ? data : []);
  return list;
};

// this function is used for creating new profile in MongoDB for more info refer code-wiki.md line 14
export const createProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  const res = await fetch(`${API_BASE}/profiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  });
  if (!res.ok) throw new Error('Failed to create profile');
  const data = await res.json();
  return data.user || data;
};

// this function is used for updating user profile bio, avatar, and class details in MongoDB for more info refer code-wiki.md line 15
export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> => {
  const res = await fetch(`${API_BASE}/user/profile/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  const data = await res.json();
  return data.user || data;
};

// this function is used for toggling user follow unfollow state in MongoDB for more info refer code-wiki.md line 16
export const toggleFollowUser = async (userId: string, targetId: string) => {
  const res = await fetch(`${API_BASE}/user/follow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, targetId })
  });
  if (!res.ok) throw new Error('Failed to toggle follow');
  return await res.json();
};

// this function is used for fetching poster events from MongoDB for more info refer code-wiki.md line 17
export const fetchEvents = async (): Promise<CampusEvent[]> => {
  const res = await fetch(`${API_BASE}/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  const data = await res.json();
  const list = data.events || (Array.isArray(data) ? data : []);
  return list;
};

// this function is used for publishing a new opportunity event to MongoDB for more info refer code-wiki.md line 18
export const createEvent = async (eventData: Partial<CampusEvent>): Promise<CampusEvent> => {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  });
  if (!res.ok) throw new Error('Failed to create event');
  const data = await res.json();
  return data.event || data;
};

// this function is used for registering a student for an event in MongoDB for more info refer code-wiki.md line 19
export const registerForEvent = async (eventId: string, studentId: string): Promise<Registration> => {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId, studentId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Registration failed');
  }
  const data = await res.json();
  return data.registration || data;
};

// this function is used for submitting manual activity point updation request to teacher in MongoDB for more info refer code-wiki.md line 20
export const submitManualPointRequest = async (payload: {
  studentId: string;
  claimTitle: string;
  claimGroup: string;
  claimPoints: number;
  proofUrl?: string;
  proofDescription?: string;
}) => {
  const res = await fetch(`${API_BASE}/request-points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to submit point request');
  }
  return await res.json();
};

// this function is used for fetching student's active registrations from MongoDB for more info refer code-wiki.md line 21
export const fetchStudentRegistrations = async (studentId: string): Promise<Registration[]> => {
  const res = await fetch(`${API_BASE}/registrations/student/${studentId}`);
  if (!res.ok) throw new Error('Failed to fetch registrations');
  const data = await res.json();
  return data.registrations || (Array.isArray(data) ? data : []);
};

// this function is used for fetching registered attendees for an event for organizer view in MongoDB for more info refer code-wiki.md line 22
export const fetchEventAttendees = async (eventId: string): Promise<Registration[]> => {
  const res = await fetch(`${API_BASE}/registrations/event/${eventId}`);
  if (!res.ok) throw new Error('Failed to fetch attendees');
  const data = await res.json();
  return data.attendees || (Array.isArray(data) ? data : []);
};

// this function is used for scanning student QR code at gate in MongoDB for more info refer code-wiki.md line 23
export const scanQRCode = async (qrCodeToken: string) => {
  const res = await fetch(`${API_BASE}/scan-qr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrCodeToken })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'QR Scan failed');
  }
  return await res.json();
};

// this function is used for completing an event and forwarding registrations to teacher in MongoDB for more info refer code-wiki.md line 24
export const completeEvent = async (eventId: string) => {
  const res = await fetch(`${API_BASE}/complete-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId })
  });
  if (!res.ok) throw new Error('Failed to complete event');
  return await res.json();
};

// this function is used for fetching pending teacher approval requests from MongoDB for more info refer code-wiki.md line 25
export const fetchPendingApprovals = async (): Promise<Registration[]> => {
  const res = await fetch(`${API_BASE}/teacher/pending`);
  if (!res.ok) throw new Error('Failed to fetch pending approvals');
  const data = await res.json();
  return data.pendingList || (Array.isArray(data) ? data : []);
};

// this function is used for approving a student activity point request in MongoDB for more info refer code-wiki.md line 26
export const approvePointRequest = async (registrationId: string, teacherId?: string, teacherName?: string) => {
  const res = await fetch(`${API_BASE}/teacher/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ registrationId, teacherId, teacherName })
  });
  if (!res.ok) throw new Error('Failed to approve points');
  return await res.json();
};

// this function is used for rejecting a student activity point request in MongoDB for more info refer code-wiki.md line 27
export const rejectPointRequest = async (registrationId: string, teacherName?: string, reason?: string) => {
  const res = await fetch(`${API_BASE}/teacher/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ registrationId, teacherName, reason })
  });
  if (!res.ok) throw new Error('Failed to reject points');
  return await res.json();
};

// this function is used for fetching aggregated student point roster from MongoDB for more info refer code-wiki.md line 28
export const fetchStudentRoster = async () => {
  const res = await fetch(`${API_BASE}/teacher/roster`);
  if (!res.ok) throw new Error('Failed to fetch student roster');
  const data = await res.json();
  return data.roster || (Array.isArray(data) ? data : []);
};

// this function is used for searching students by query string for teacher management for more info refer code-wiki.md line 29
export const searchStudents = async (query: string = '') => {
  const res = await fetch(`${API_BASE}/teacher/students?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search students');
  const data = await res.json();
  return data.students || [];
};

// this function is used for assigning Class Representative CR or student role for more info refer code-wiki.md line 30
export const assignStudentRole = async (studentId: string, isCR: boolean, assignedByTeacherName?: string) => {
  const res = await fetch(`${API_BASE}/teacher/assign-role`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, isCR, assignedByTeacherName })
  });
  if (!res.ok) throw new Error('Failed to assign role');
  return await res.json();
};

// this function is used for sending activity points deficiency alert notification to student for more info refer code-wiki.md line 31
export const notifyStudentDeficiency = async (studentId: string, teacherName: string, currentPoints: number) => {
  const res = await fetch(`${API_BASE}/teacher/notify-deficiency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, teacherName, currentPoints })
  });
  if (!res.ok) throw new Error('Failed to send deficiency alert');
  return await res.json();
};

// this function is used for fetching notifications for user from MongoDB for more info refer code-wiki.md line 32
export const fetchNotifications = async (userId: string) => {
  const res = await fetch(`${API_BASE}/notifications/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  const data = await res.json();
  return data.notifications || [];
};

// this function is used for marking notification as read in MongoDB for more info refer code-wiki.md line 33
export const markNotificationRead = async (notificationId: string) => {
  const res = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to mark read');
  return await res.json();
};

// this function is used for fetching discussion threads from MongoDB for more info refer code-wiki.md line 34
export const fetchDiscussions = async () => {
  const res = await fetch(`${API_BASE}/discussions`);
  if (!res.ok) throw new Error('Failed to fetch discussions');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

// this function is used for creating discussion thread in MongoDB for more info refer code-wiki.md line 35
export const createDiscussion = async (threadData: any) => {
  const res = await fetch(`${API_BASE}/discussions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(threadData)
  });
  if (!res.ok) throw new Error('Failed to create thread');
  return await res.json();
};

// this function is used for upvoting discussion thread in MongoDB for more info refer code-wiki.md line 36
export const upvoteDiscussion = async (id: string) => {
  const res = await fetch(`${API_BASE}/discussions/${id}/upvote`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to upvote thread');
  return await res.json();
};

// this function is used for adding comment to discussion thread in MongoDB for more info refer code-wiki.md line 37
export const addCommentToDiscussion = async (id: string, commentData: { author: string; text?: string; gifUrl?: string }) => {
  const res = await fetch(`${API_BASE}/discussions/${id}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData)
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return await res.json();
};

// this function is used for sending HOD permission letter after student joins event for more info refer code-wiki.md line 38
export const sendPermissionLetter = async (registrationId: string, studentId: string, message?: string) => {
  const res = await fetch(`${API_BASE}/letters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ registrationId, studentId, message })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to send permission letter');
  }
  return await res.json();
};

// this function is used for fetching all HOD permission letters for advisor review for more info refer code-wiki.md line 39
export const fetchPermissionLetters = async (): Promise<PermissionLetter[]> => {
  const res = await fetch(`${API_BASE}/letters`);
  if (!res.ok) throw new Error('Failed to fetch permission letters');
  const data = await res.json();
  return data.letters || [];
};

// this function is used for fetching permission letters for a specific student for more info refer code-wiki.md line 40
export const fetchStudentLetters = async (studentId: string): Promise<PermissionLetter[]> => {
  const res = await fetch(`${API_BASE}/letters/student/${studentId}`);
  if (!res.ok) throw new Error('Failed to fetch student letters');
  const data = await res.json();
  return data.letters || [];
};

// this function is used for approving or rejecting an HOD permission letter for more info refer code-wiki.md line 41
export const decidePermissionLetter = async (letterId: string, decision: 'APPROVED' | 'REJECTED', note?: string, responderName?: string) => {
  const res = await fetch(`${API_BASE}/letters/${letterId}/decide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision, note, responderName })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update letter');
  }
  return await res.json();
};
