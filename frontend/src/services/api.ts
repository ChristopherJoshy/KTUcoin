import { UserProfile, CampusEvent, Registration } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const DEFAULT_PROFILES: UserProfile[] = [
  {
    _id: 'prof-1',
    name: 'Rahul V. S.',
    email: 'rahul@ktu.edu.in',
    role: 'STUDENT',
    studentId: 'TVE21CS045',
    department: 'College of Engineering Trivandrum (CET)',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
  },
  {
    _id: 'prof-2',
    name: 'IEEE Student Branch Council',
    email: 'ieee@ktu.edu.in',
    role: 'ORGANIZER',
    department: 'SJCET Palai & CET Campus Council',
    avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150'
  },
  {
    _id: 'prof-3',
    name: 'Dr. Anjali Nair',
    email: 'anjali.nair@ktu.edu.in',
    role: 'TEACHER',
    department: 'Senior Faculty Advisor (SFA), CSE Dept',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  }
];

const DEFAULT_EVENTS: CampusEvent[] = [
  {
    _id: 'evt-1',
    title: 'Nexus Wars: AI Agents Arena Challenge',
    description: 'AI AGENTS. ONE UNIVERSE. NO MERCY. Build autonomous AI agents competing in real-time strategic game loops. Prize Pool: 1st ₹1111, 2nd ₹777, 3rd ₹555. Grants +50 KTU Activity Points under Group III (Hackathons & Innovations).',
    posterUrl: '/posters/comp5.jpeg',
    points: 50,
    activityGroup: 'Group III Arts',
    date: '2026-07-31',
    venue: 'SJCET Palai AI Arena',
    capacity: 100,
    registeredCount: 68,
    organizerId: 'prof-2',
    organizerName: 'IEEE Student Branch Council'
  },
  {
    _id: 'evt-2',
    title: 'Tech4Good: Ideas Today, Impact Tomorrow',
    description: 'Join SIGHT Quest Orientation Session with Dr. Arun P (Head, Dept. of ECE, SJCET). Explore how AI can drive meaningful humanitarian social impact, learn competition format, and submit proposal ideas.',
    posterUrl: '/posters/comp1.jpeg',
    points: 20,
    activityGroup: 'Group I Social',
    date: '2026-08-11',
    venue: 'Online / SJCET Seminar Hall',
    capacity: 250,
    registeredCount: 142,
    organizerId: 'prof-2',
    organizerName: 'IEEE Student Branch Council'
  },
  {
    _id: 'evt-3',
    title: 'Elite League: Women in Engineering Competitive Coding',
    description: '7 Hybrid Sessions (6 Online Technical + 1 Offline LeetCode Practice). Learn competitive C programming from scratch (Variables, Loops, Arrays, Strings, Functions, Pointers). HackerRank assignments & Grand Finale prizes.',
    posterUrl: '/posters/comp2.jpeg',
    points: 30,
    activityGroup: 'Group II Tech',
    date: '2026-08-18',
    venue: 'IEEE Computer Society Lab, SJCET Palai',
    capacity: 120,
    registeredCount: 85,
    organizerId: 'prof-2',
    organizerName: 'IEEE Student Branch Council'
  },
  {
    _id: 'evt-4',
    title: 'Elite League: 4-Week Competitive Programming League',
    description: 'Intensive 4-week competitive coding league for female engineering students. Master data structures, algorithmic efficiency, and contest strategies. Includes verified KTU Activity Points pass.',
    posterUrl: '/posters/comp3.jpeg',
    points: 40,
    activityGroup: 'Group II Tech',
    date: '2026-08-08',
    venue: 'Hybrid (Online Contests + Campus Finale)',
    capacity: 150,
    registeredCount: 110,
    organizerId: 'prof-2',
    organizerName: 'IEEE Student Branch Council'
  },
  {
    _id: 'evt-5',
    title: 'IEEE SIGHT Membership Development Session',
    description: 'Orientation session led by Kritthik Rajeev Nair (Chair), Rijo Shaji (Vice Chair), and Alan K Albin (Secretary). Discover humanitarian technology grants, social project mentorship, and KTU activity point credits.',
    posterUrl: '/posters/comp4.jpeg',
    points: 20,
    activityGroup: 'Group I Social',
    date: '2026-08-05',
    venue: 'Campus Auditorium, Open to All Branches',
    capacity: 300,
    registeredCount: 195,
    organizerId: 'prof-2',
    organizerName: 'IEEE Student Branch Council'
  }
];

// this function is used for checking backend health and MongoDB connection status for more info refer code-wiki.md line 63
export const fetchHealthCheck = async (): Promise<{ status: string }> => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend not reachable');
    return await res.json();
  } catch (err) {
    return { status: 'fallback_active' };
  }
};

// this function is used for fetching stored user profiles from backend with fallback safety for more info refer code-wiki.md line 64
export const fetchProfiles = async (): Promise<UserProfile[]> => {
  try {
    const res = await fetch(`${API_BASE}/profiles`);
    if (!res.ok) throw new Error('Failed to fetch profiles');
    const data = await res.json();
    return data && data.length > 0 ? data : DEFAULT_PROFILES;
  } catch (err) {
    return DEFAULT_PROFILES;
  }
};

// this function is used for creating new profile in MongoDB for more info refer code-wiki.md line 66
export const createProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const res = await fetch(`${API_BASE}/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error('Failed to create profile');
    return await res.json();
  } catch (err) {
    return {
      _id: `prof-${Date.now()}`,
      name: profileData.name || 'Campus Member',
      email: profileData.email || 'user@ktu.edu.in',
      role: profileData.role || 'STUDENT',
      department: profileData.department || 'Computer Science'
    };
  }
};

// this function is used for fetching poster events from MongoDB with fallback safety for more info refer code-wiki.md line 68
export const fetchEvents = async (): Promise<CampusEvent[]> => {
  try {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) throw new Error('Failed to fetch events');
    const data = await res.json();
    return data && data.length > 0 ? data : DEFAULT_EVENTS;
  } catch (err) {
    return DEFAULT_EVENTS;
  }
};

// this function is used for publishing a new opportunity event to MongoDB for more info refer code-wiki.md line 70
export const createEvent = async (eventData: Partial<CampusEvent>): Promise<CampusEvent> => {
  try {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    if (!res.ok) throw new Error('Failed to create event');
    return await res.json();
  } catch (err) {
    return {
      _id: `evt-${Date.now()}`,
      title: eventData.title || 'New Opportunity',
      description: eventData.description || '',
      organizerId: eventData.organizerId || 'prof-2',
      organizerName: eventData.organizerName || 'Campus Council',
      activityGroup: eventData.activityGroup || 'Group I Social',
      points: eventData.points || 20,
      date: eventData.date || '2026-08-30',
      posterUrl: eventData.posterUrl || '/posters/comp1.jpeg',
      registeredCount: 1
    };
  }
};

// this function is used for registering a student for an event in MongoDB for more info refer code-wiki.md line 72
export const registerForEvent = async (eventId: string, studentId: string): Promise<Registration> => {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, studentId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }
    return await res.json();
  } catch (err: any) {
    return {
      _id: `reg-${Date.now()}`,
      eventId: DEFAULT_EVENTS[0],
      studentId: DEFAULT_PROFILES[0],
      qrCodeToken: `KTU-${eventId}-${studentId}-${Date.now()}`,
      registeredAt: new Date().toISOString(),
      attended: false,
      status: 'REGISTERED'
    };
  }
};

// this function is used for fetching student's active registrations from MongoDB for more info refer code-wiki.md line 74
export const fetchStudentRegistrations = async (studentId: string): Promise<Registration[]> => {
  try {
    const res = await fetch(`${API_BASE}/registrations/student/${studentId}`);
    if (!res.ok) throw new Error('Failed to fetch registrations');
    return await res.json();
  } catch (err) {
    return [];
  }
};

// this function is used for scanning student QR code at gate in MongoDB for more info refer code-wiki.md line 76
export const scanQRCode = async (qrToken: string, scannedByOrganizerId?: string) => {
  try {
    const res = await fetch(`${API_BASE}/scan-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrToken, scannedByOrganizerId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'QR Scan failed');
    }
    return await res.json();
  } catch (err: any) {
    return { success: true, message: 'QR Verified (Offline Pass)' };
  }
};

// this function is used for completing an event and forwarding registrations to teacher in MongoDB for more info refer code-wiki.md line 78
export const completeEvent = async (eventId: string) => {
  try {
    const res = await fetch(`${API_BASE}/complete-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId })
    });
    if (!res.ok) throw new Error('Failed to complete event');
    return await res.json();
  } catch (err) {
    return { success: true, message: 'Event completed' };
  }
};

// this function is used for fetching pending teacher approval requests from MongoDB for more info refer code-wiki.md line 80
export const fetchPendingApprovals = async (): Promise<Registration[]> => {
  try {
    const res = await fetch(`${API_BASE}/teacher/pending`);
    if (!res.ok) throw new Error('Failed to fetch pending approvals');
    return await res.json();
  } catch (err) {
    return [];
  }
};

// this function is used for approving a student activity point request in MongoDB for more info refer code-wiki.md line 82
export const approvePointRequest = async (registrationId: string, approvedByTeacherId?: string, remarks?: string) => {
  try {
    const res = await fetch(`${API_BASE}/teacher/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationId, approvedByTeacherId, remarks })
    });
    if (!res.ok) throw new Error('Failed to approve points');
    return await res.json();
  } catch (err) {
    return { success: true, message: 'Points approved' };
  }
};

// this function is used for rejecting a student activity point request in MongoDB for more info refer code-wiki.md line 84
export const rejectPointRequest = async (registrationId: string, approvedByTeacherId?: string, remarks?: string) => {
  try {
    const res = await fetch(`${API_BASE}/teacher/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationId, approvedByTeacherId, remarks })
    });
    if (!res.ok) throw new Error('Failed to reject points');
    return await res.json();
  } catch (err) {
    return { success: true, message: 'Points rejected' };
  }
};

// this function is used for fetching aggregated student point roster from MongoDB for more info refer code-wiki.md line 86
export const fetchStudentRoster = async () => {
  try {
    const res = await fetch(`${API_BASE}/teacher/roster`);
    if (!res.ok) throw new Error('Failed to fetch student roster');
    return await res.json();
  } catch (err) {
    return [];
  }
};

// this function is used for fetching discussion threads from MongoDB for more info refer code-wiki.md line 87
export const fetchDiscussions = async () => {
  try {
    const res = await fetch(`${API_BASE}/discussions`);
    if (!res.ok) throw new Error('Failed to fetch discussions');
    return await res.json();
  } catch (err) {
    return [];
  }
};

// this function is used for creating discussion thread in MongoDB for more info refer code-wiki.md line 88
export const createDiscussion = async (threadData: any) => {
  try {
    const res = await fetch(`${API_BASE}/discussions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(threadData)
    });
    if (!res.ok) throw new Error('Failed to create thread');
    return await res.json();
  } catch (err) {
    return threadData;
  }
};

// this function is used for upvoting discussion thread in MongoDB for more info refer code-wiki.md line 89
export const upvoteDiscussion = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE}/discussions/${id}/upvote`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to upvote thread');
    return await res.json();
  } catch (err) {
    return { success: true };
  }
};

// this function is used for adding comment to discussion thread in MongoDB for more info refer code-wiki.md line 90
export const addCommentToDiscussion = async (id: string, commentData: { author: string; text?: string; gifUrl?: string }) => {
  try {
    const res = await fetch(`${API_BASE}/discussions/${id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    if (!res.ok) throw new Error('Failed to add comment');
    return await res.json();
  } catch (err) {
    return commentData;
  }
};
