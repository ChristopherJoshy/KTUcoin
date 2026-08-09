export type UserRole = 'STUDENT' | 'ORGANIZER' | 'TEACHER';
export type ActivityGroup = 'Group I' | 'Group II' | 'Group III' | 'Group I Social' | 'Group II Tech' | 'Group III Arts';
export type RegistrationStatus = 'REGISTERED' | 'ATTENDED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface UserProfileData {
  _id?: string;
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
