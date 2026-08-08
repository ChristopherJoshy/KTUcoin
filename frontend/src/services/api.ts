import { UserProfile, CampusEvent, Registration } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// this function is used for checking backend health and MongoDB connection status for more info refer code-wiki.md line 63
export const fetchHealthCheck = async (): Promise<{ status: string }> => {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend not reachable');
  return res.json();
};

// this function is used for fetching stored user profiles from backend for more info refer code-wiki.md line 64
export const fetchProfiles = async (): Promise<UserProfile[]> => {
  const res = await fetch(`${API_BASE}/profiles`);
  if (!res.ok) throw new Error('Failed to fetch profiles');
  return res.json();
};

// this function is used for creating new profile in MongoDB for more info refer code-wiki.md line 66
export const createProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  const res = await fetch(`${API_BASE}/profiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  });
  if (!res.ok) throw new Error('Failed to create profile');
  return res.json();
};

// this function is used for fetching poster events from MongoDB for more info refer code-wiki.md line 68
export const fetchEvents = async (): Promise<CampusEvent[]> => {
  const res = await fetch(`${API_BASE}/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
};

// this function is used for publishing a new opportunity event to MongoDB for more info refer code-wiki.md line 70
export const createEvent = async (eventData: Partial<CampusEvent>): Promise<CampusEvent> => {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
};

// this function is used for registering a student for an event in MongoDB for more info refer code-wiki.md line 72
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
  return res.json();
};

// this function is used for fetching student's active registrations from MongoDB for more info refer code-wiki.md line 74
export const fetchStudentRegistrations = async (studentId: string): Promise<Registration[]> => {
  const res = await fetch(`${API_BASE}/registrations/student/${studentId}`);
  if (!res.ok) throw new Error('Failed to fetch registrations');
  return res.json();
};

// this function is used for scanning student QR code at gate in MongoDB for more info refer code-wiki.md line 76
export const scanQRCode = async (qrToken: string, scannedByOrganizerId?: string) => {
  const res = await fetch(`${API_BASE}/scan-qr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrToken, scannedByOrganizerId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'QR Scan failed');
  }
  return res.json();
};

// this function is used for completing an event and forwarding registrations to teacher in MongoDB for more info refer code-wiki.md line 78
export const completeEvent = async (eventId: string) => {
  const res = await fetch(`${API_BASE}/complete-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId })
  });
  if (!res.ok) throw new Error('Failed to complete event');
  return res.json();
};

// this function is used for fetching pending teacher approval requests from MongoDB for more info refer code-wiki.md line 80
export const fetchPendingApprovals = async (): Promise<Registration[]> => {
  const res = await fetch(`${API_BASE}/teacher/pending`);
  if (!res.ok) throw new Error('Failed to fetch pending approvals');
  return res.json();
};

// this function is used for approving a student activity point request in MongoDB for more info refer code-wiki.md line 82
export const approvePointRequest = async (registrationId: string, approvedByTeacherId?: string, remarks?: string) => {
  const res = await fetch(`${API_BASE}/teacher/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ registrationId, approvedByTeacherId, remarks })
  });
  if (!res.ok) throw new Error('Failed to approve points');
  return res.json();
};

// this function is used for rejecting a student activity point request in MongoDB for more info refer code-wiki.md line 84
export const rejectPointRequest = async (registrationId: string, approvedByTeacherId?: string, remarks?: string) => {
  const res = await fetch(`${API_BASE}/teacher/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ registrationId, approvedByTeacherId, remarks })
  });
  if (!res.ok) throw new Error('Failed to reject points');
  return res.json();
};

// this function is used for fetching aggregated student point roster from MongoDB for more info refer code-wiki.md line 86
export const fetchStudentRoster = async () => {
  const res = await fetch(`${API_BASE}/teacher/roster`);
  if (!res.ok) throw new Error('Failed to fetch student roster');
  return res.json();
};

// this function is used for fetching discussion threads from MongoDB for more info refer code-wiki.md line 87
export const fetchDiscussions = async () => {
  const res = await fetch(`${API_BASE}/discussions`);
  if (!res.ok) throw new Error('Failed to fetch discussions');
  return res.json();
};

// this function is used for creating discussion thread in MongoDB for more info refer code-wiki.md line 88
export const createDiscussion = async (threadData: any) => {
  const res = await fetch(`${API_BASE}/discussions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(threadData)
  });
  if (!res.ok) throw new Error('Failed to create thread');
  return res.json();
};

// this function is used for upvoting discussion thread in MongoDB for more info refer code-wiki.md line 89
export const upvoteDiscussion = async (id: string) => {
  const res = await fetch(`${API_BASE}/discussions/${id}/upvote`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to upvote thread');
  return res.json();
};

// this function is used for adding comment to discussion thread in MongoDB for more info refer code-wiki.md line 90
export const addCommentToDiscussion = async (id: string, commentData: { author: string; text?: string; gifUrl?: string }) => {
  const res = await fetch(`${API_BASE}/discussions/${id}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData)
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
};
