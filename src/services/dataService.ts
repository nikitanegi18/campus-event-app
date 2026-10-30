import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  CampusEvent,
  Club,
  Announcement,
  EventRegistration,
  NotificationItem,
  PlatformStats,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CLUBS,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
} from './mockData';

const STORAGE_KEYS = {
  USERS: '@campus_app_users_v2',
  CLUBS: '@campus_app_clubs_v2',
  EVENTS: '@campus_app_events_v2',
  REGISTRATIONS: '@campus_app_registrations_v2',
  ANNOUNCEMENTS: '@campus_app_announcements_v2',
  NOTIFICATIONS: '@campus_app_notifications_v2',
  CURRENT_USER: '@campus_app_current_user_v2',
};

class DataService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    try {
      const existingEvents = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!existingEvents) {
        // Seed initial data with Devi Ahilya Vishwavidyalaya (DAVV) & SCSIT
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS)),
          AsyncStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(INITIAL_CLUBS)),
          AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS)),
          AsyncStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS)),
          AsyncStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS)),
          AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS)),
          AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0])),
        ]);
      }
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing data in AsyncStorage:', error);
    }
  }

  // --- Auth & Users ---
  async getCurrentUser(): Promise<User | null> {
    await this.initialize();
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) return null;
    return JSON.parse(data);
  }

  async setCurrentUser(user: User | null): Promise<void> {
    if (user) {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  async getUsers(): Promise<User[]> {
    await this.initialize();
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : INITIAL_USERS;
  }

  async updateUser(user: User): Promise<void> {
    const users = await this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // If updating current user
    const current = await this.getCurrentUser();
    if (current && current.id === user.id) {
      await this.setCurrentUser(user);
    }
  }

  async toggleUserStatus(userId: string): Promise<User[]> {
    const users = await this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.status = user.status === 'active' ? 'suspended' : 'active';
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    return users;
  }

  // --- Events ---
  async getEvents(): Promise<CampusEvent[]> {
    await this.initialize();
    const data = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
    return data ? JSON.parse(data) : INITIAL_EVENTS;
  }

  async getEventById(eventId: string): Promise<CampusEvent | null> {
    const events = await this.getEvents();
    return events.find((e) => e.id === eventId) || null;
  }

  async createEvent(event: Omit<CampusEvent, 'id' | 'createdAt' | 'registeredCount'>): Promise<CampusEvent> {
    const events = await this.getEvents();
    const newEvent: CampusEvent = {
      ...event,
      id: 'evt-' + Date.now(),
      registeredCount: 0,
      createdAt: new Date().toISOString(),
    };
    events.unshift(newEvent);
    await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return newEvent;
  }

  async updateEvent(eventId: string, updates: Partial<CampusEvent>): Promise<CampusEvent | null> {
    const events = await this.getEvents();
    const index = events.findIndex((e) => e.id === eventId);
    if (index === -1) return null;
    events[index] = { ...events[index], ...updates };
    await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return events[index];
  }

  async cancelOrDeleteEvent(eventId: string): Promise<boolean> {
    const events = await this.getEvents();
    const index = events.findIndex((e) => e.id === eventId);
    if (index === -1) return false;
    events[index].status = 'cancelled';
    await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return true;
  }

  // --- Registrations ---
  async getRegistrations(): Promise<EventRegistration[]> {
    await this.initialize();
    const data = await AsyncStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    return data ? JSON.parse(data) : INITIAL_REGISTRATIONS;
  }

  async registerForEvent(
    userId: string,
    eventId: string,
    details: { department: string; rollNumber: string }
  ): Promise<{ success: boolean; message: string; registration?: EventRegistration }> {
    const [events, users, registrations] = await Promise.all([
      this.getEvents(),
      this.getUsers(),
      this.getRegistrations(),
    ]);

    const event = events.find((e) => e.id === eventId);
    if (!event) return { success: false, message: 'Event not found.' };

    const user = users.find((u) => u.id === userId);
    if (!user) return { success: false, message: 'User not found.' };

    // Check duplicate registration
    const existing = registrations.find(
      (r) => r.eventId === eventId && r.userId === userId && r.status === 'confirmed'
    );
    if (existing) {
      return { success: false, message: 'You are already registered for this event!' };
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return { success: false, message: 'This event has reached full capacity.' };
    }

    // Generate unique digital ticket code
    const categoryPrefix = event.category.substring(0, 3).toUpperCase();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ticketCode = `${categoryPrefix}-2026-${randomCode}`;

    const newRegistration: EventRegistration = {
      id: 'reg-' + Date.now(),
      eventId,
      eventTitle: event.title,
      userId,
      userName: user.name,
      userEmail: user.email,
      department: details.department || user.department,
      rollNumber: details.rollNumber || user.rollNumber,
      ticketCode,
      registeredAt: new Date().toISOString(),
      status: 'confirmed',
    };

    // Update event registered count
    event.registeredCount += 1;
    // Update user registeredEventIds
    if (!user.registeredEventIds.includes(eventId)) {
      user.registeredEventIds.push(eventId);
    }

    registrations.unshift(newRegistration);

    // Add notification for user
    const notifications = await this.getNotifications(userId);
    notifications.unshift({
      id: 'notif-' + Date.now(),
      userId,
      title: 'Registration Confirmed 🎫',
      message: `Your ticket for "${event.title}" is confirmed! Ticket Code: ${ticketCode}`,
      type: 'event',
      date: 'Just now',
      isRead: false,
    });

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations)),
      AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events)),
      AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
      AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)),
      this.setCurrentUser(user),
    ]);

    return {
      success: true,
      message: 'Registration successful! Digital ticket issued.',
      registration: newRegistration,
    };
  }

  async cancelRegistration(registrationId: string): Promise<{ success: boolean; message: string }> {
    const [registrations, events, users] = await Promise.all([
      this.getRegistrations(),
      this.getEvents(),
      this.getUsers(),
    ]);

    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return { success: false, message: 'Registration not found.' };

    reg.status = 'cancelled';

    // Decrement event registeredCount
    const event = events.find((e) => e.id === reg.eventId);
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
    }

    // Remove from user registeredEventIds
    const user = users.find((u) => u.id === reg.userId);
    if (user) {
      user.registeredEventIds = user.registeredEventIds.filter((id) => id !== reg.eventId);
    }

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations)),
      AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events)),
      AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
      user ? this.setCurrentUser(user) : Promise.resolve(),
    ]);

    return { success: true, message: 'Registration cancelled successfully.' };
  }

  // --- Clubs ---
  async getClubs(): Promise<Club[]> {
    await this.initialize();
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CLUBS);
    return data ? JSON.parse(data) : INITIAL_CLUBS;
  }

  async getClubById(clubId: string): Promise<Club | null> {
    const clubs = await this.getClubs();
    return clubs.find((c) => c.id === clubId) || null;
  }

  async updateClub(clubId: string, updates: Partial<Club>): Promise<Club | null> {
    const clubs = await this.getClubs();
    const index = clubs.findIndex((c) => c.id === clubId);
    if (index === -1) return null;
    clubs[index] = { ...clubs[index], ...updates };
    await AsyncStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(clubs));
    return clubs[index];
  }

  async joinClub(userId: string, clubId: string): Promise<{ success: boolean; message: string }> {
    const [clubs, users] = await Promise.all([this.getClubs(), this.getUsers()]);
    const club = clubs.find((c) => c.id === clubId);
    const user = users.find((u) => u.id === userId);

    if (!club || !user) return { success: false, message: 'Club or User not found.' };

    if (club.memberIds.includes(userId) || user.joinedClubIds.includes(clubId)) {
      return { success: false, message: 'You are already a member of this club!' };
    }

    club.memberIds.push(userId);
    club.memberCount += 1;
    user.joinedClubIds.push(clubId);

    // Send notification
    const notifications = await this.getNotifications(userId);
    notifications.unshift({
      id: 'notif-' + Date.now(),
      userId,
      title: 'Welcome to ' + club.name + ' 👋',
      message: `You are now a registered club member! Meeting schedule: ${club.meetingSchedule}`,
      type: 'club',
      date: 'Just now',
      isRead: false,
    });

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(clubs)),
      AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
      AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)),
      this.setCurrentUser(user),
    ]);

    return { success: true, message: `Successfully joined ${club.name}!` };
  }

  async leaveClub(userId: string, clubId: string): Promise<{ success: boolean; message: string }> {
    const [clubs, users] = await Promise.all([this.getClubs(), this.getUsers()]);
    const club = clubs.find((c) => c.id === clubId);
    const user = users.find((u) => u.id === userId);

    if (!club || !user) return { success: false, message: 'Club or User not found.' };

    club.memberIds = club.memberIds.filter((id) => id !== userId);
    club.memberCount = Math.max(0, club.memberCount - 1);
    user.joinedClubIds = user.joinedClubIds.filter((id) => id !== clubId);

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(clubs)),
      AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
      this.setCurrentUser(user),
    ]);

    return { success: true, message: `Left ${club.name}.` };
  }

  // --- Announcements ---
  async getAnnouncements(): Promise<Announcement[]> {
    await this.initialize();
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return data ? JSON.parse(data) : INITIAL_ANNOUNCEMENTS;
  }

  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'date'>): Promise<Announcement> {
    const list = await this.getAnnouncements();
    const newAnc: Announcement = {
      ...announcement,
      id: 'anc-' + Date.now(),
      date: 'Just now',
    };
    list.unshift(newAnc);
    await AsyncStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(list));
    return newAnc;
  }

  // --- Notifications ---
  async getNotifications(userId?: string): Promise<NotificationItem[]> {
    await this.initialize();
    const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all: NotificationItem[] = data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    if (!userId) return all;
    return all.filter((n) => n.userId === userId || n.userId === 'user-student-1');
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    const all = await this.getNotifications();
    all.forEach((n) => {
      if (n.userId === userId || n.userId === 'user-student-1') {
        n.isRead = true;
      }
    });
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
  }

  // --- Platform Stats (System Admin) ---
  async getPlatformStats(): Promise<PlatformStats> {
    const [users, clubs, events, registrations] = await Promise.all([
      this.getUsers(),
      this.getClubs(),
      this.getEvents(),
      this.getRegistrations(),
    ]);

    return {
      totalUsers: users.length,
      totalStudents: users.filter((u) => u.role === 'student').length,
      totalClubAdmins: users.filter((u) => u.role === 'club_admin').length,
      totalClubs: clubs.length,
      totalEvents: events.length,
      totalRegistrations: registrations.filter((r) => r.status === 'confirmed').length,
      activeEventsCount: events.filter((e) => e.status === 'upcoming' || e.status === 'ongoing').length,
    };
  }

  // --- Reset to Initial State ---
  async resetAllData(): Promise<void> {
    await AsyncStorage.clear();
    this.initialized = false;
    await this.initialize();
  }
}

export const dataService = new DataService();
