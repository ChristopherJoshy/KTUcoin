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
  location: string;
  posterUrl: string;
  registrationCap: number;
  registeredCount: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface Registration {
  _id: string;
  eventId: CampusEvent;
  studentId: User;
  qrCodeToken: string;
  registeredAt: string;
  attended: boolean;
  attendedAt?: string;
  status: RegistrationStatus;
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
