export type UserRole = 'student' | 'club_admin' | 'sys_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  rollNumber: string;
  avatarUrl?: string;
  clubId?: string; // If club_admin, the club they lead
  clubName?: string;
  joinedClubIds: string[];
  registeredEventIds: string[];
  status: 'active' | 'suspended';
  createdAt: string;
}

export type EventCategory = 'Tech' | 'Cultural' | 'Sports' | 'Workshop' | 'Academic';

export interface CampusEvent {
  id: string;
  title: string;
  clubId: string;
  clubName: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  description: string;
  capacity: number;
  registeredCount: number;
  bannerColor: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isFeatured?: boolean;
  createdAt: string;
}

export type ClubCategory = 'Engineering' | 'Arts & Music' | 'Sports' | 'Literary' | 'Innovation';

export interface Club {
  id: string;
  name: string;
  category: ClubCategory;
  description: string;
  presidentName: string;
  presidentEmail: string;
  contactEmail: string;
  meetingSchedule: string;
  accentColor: string;
  memberCount: number;
  memberIds: string[];
  status: 'active' | 'pending';
  establishedYear: number;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: string;
  rollNumber: string;
  ticketCode: string;
  registeredAt: string;
  status: 'confirmed' | 'cancelled';
}

export type AnnouncementPriority = 'urgent' | 'important' | 'general';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  clubId?: string;
  clubName?: string;
  priority: AnnouncementPriority;
  date: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'event' | 'club' | 'announcement' | 'system';
  date: string;
  isRead: boolean;
}

export interface PlatformStats {
  totalUsers: number;
  totalStudents: number;
  totalClubAdmins: number;
  totalClubs: number;
  totalEvents: number;
  totalRegistrations: number;
  activeEventsCount: number;
}
