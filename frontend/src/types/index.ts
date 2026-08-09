export type UserRole = 'STUDENT' | 'ORGANIZER' | 'TEACHER';
export type ActivityGroup = 'Group I' | 'Group II' | 'Group III';
export type RegistrationStatus = 'REGISTERED' | 'ATTENDED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  studentId?: string;
  avatarUrl?: string;
  bio?: string;
  classGroup?: string;
  isCR?: boolean;
  followers?: string[];
  following?: string[];
}

export type UserProfile = User;

export interface CampusEvent {
  _id: string;
  title: string;
  description: string;
  organizerId: string;
  organizerName: string;
  activityGroup: ActivityGroup;
  points: number;
  date: string;
  location?: string;
  venue?: string;
  posterUrl: string;
  registrationCap?: number;
  capacity?: number;
  registeredCount: number;
  isCompleted?: boolean;
  status?: string;
  createdAt?: string;
}

export interface Registration {
  _id: string;
  eventId?: CampusEvent;
  studentId: User;
  qrCodeToken: string;
  registeredAt: string;
  attended: boolean;
  attendedAt?: string;
  status: RegistrationStatus;
  isManualClaim?: boolean;
  claimTitle?: string;
  claimGroup?: string;
  claimPoints?: number;
  proofUrl?: string;
  proofDescription?: string;
}

export interface AppNotification {
  _id: string;
  recipientId: string;
  senderName: string;
  title: string;
  message: string;
  type: 'POINT_CREDIT' | 'WARNING' | 'ROLE_ASSIGN' | 'VERIFICATION';
  read: boolean;
  createdAt: string;
}

export interface PointsLedger {
  _id: string;
  studentId: string;
  eventId: string;
  registrationId: string;
  eventTitle: string;
  activityGroup: ActivityGroup;
  pointsAwarded: number;
  approvedByTeacherId: string;
  approvedByTeacherName: string;
  approvedAt: string;
}

export interface RosterItem {
  student: User;
  pointsSummary: {
    group1: number;
    group2: number;
    group3: number;
    totalPoints: number;
    completedMinReq: boolean;
  };
  earnedLedger: PointsLedger[];
}

export type LetterStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PermissionLetter {
  _id: string;
  studentId: User | string;
  eventId: CampusEvent | string;
  registrationId?: string;
  studentName: string;
  studentRoll?: string;
  classGroup?: string;
  eventTitle: string;
  eventDate?: string;
  eventVenue?: string;
  eventPoints?: number;
  eventGroup?: string;
  message?: string;
  status: LetterStatus;
  responseNote?: string;
  respondedBy?: string;
  createdAt: string;
  respondedAt?: string;
}
