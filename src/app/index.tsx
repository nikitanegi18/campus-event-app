import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import {
  CampusEvent,
  Club,
  Announcement,
  EventRegistration,
  NotificationItem,
  PlatformStats,
  EventCategory,
  ClubCategory,
} from '../types';

// Components
import { RoleSwitcherBar } from '../components/RoleSwitcherBar';
import { Header } from '../components/Header';
import { EventCard } from '../components/EventCard';
import { ClubCard } from '../components/ClubCard';
import { AnnouncementCard } from '../components/AnnouncementCard';

// Modals
import { EventDetailsModal } from '../components/EventDetailsModal';
import { EventRegistrationModal } from '../components/EventRegistrationModal';
import { DigitalPassModal } from '../components/DigitalPassModal';
import { ClubDetailsModal } from '../components/ClubDetailsModal';
import { CreateEventModal } from '../components/CreateEventModal';
import { EditEventModal } from '../components/EditEventModal';
import { EventParticipantsModal } from '../components/EventParticipantsModal';
import { PublishAnnouncementModal } from '../components/PublishAnnouncementModal';
import { NotificationsModal } from '../components/NotificationsModal';
import { EditProfileModal } from '../components/EditProfileModal';
import { ManageUsersModal } from '../components/ManageUsersModal';
import { ManageClubsModal } from '../components/ManageClubsModal';

export default function MainAppScreen() {
  const router = useRouter();
  const { user, role, isLoading: authLoading, logout, refreshUser } = useAuth();

  // Primary Data State
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);

  // Navigation Subtabs
  const [studentTab, setStudentTab] = useState<'events' | 'clubs' | 'passes' | 'notices' | 'profile'>('events');
  const [clubAdminTab, setClubAdminTab] = useState<'overview' | 'events' | 'notices' | 'profile'>('overview');
  const [sysAdminTab, setSysAdminTab] = useState<'analytics' | 'users' | 'clubs' | 'events'>('analytics');
  const [myHubSubtab, setMyHubSubtab] = useState<'passes' | 'clubs'>('passes');

  // Search & Filters
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<'All' | EventCategory>('All');
  const [clubSearch, setClubSearch] = useState('');
  const [clubCategoryFilter, setClubCategoryFilter] = useState<'All' | ClubCategory>('All');

  // Modals visibility
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [isEventDetailsVisible, setIsEventDetailsVisible] = useState(false);
  const [isEventRegVisible, setIsEventRegVisible] = useState(false);
  const [selectedPass, setSelectedPass] = useState<EventRegistration | null>(null);
  const [isDigitalPassVisible, setIsDigitalPassVisible] = useState(false);

  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isClubDetailsVisible, setIsClubDetailsVisible] = useState(false);

  const [isCreateEventVisible, setIsCreateEventVisible] = useState(false);
  const [isEditEventVisible, setIsEditEventVisible] = useState(false);
  const [isParticipantsVisible, setIsParticipantsVisible] = useState(false);
  const [isPublishNoticeVisible, setIsPublishNoticeVisible] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isManageUsersVisible, setIsManageUsersVisible] = useState(false);
  const [isManageClubsVisible, setIsManageClubsVisible] = useState(false);

  // Loading & Refresh
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [evts, clbs, ancs, regs, notifs, stats, usrs] = await Promise.all([
        dataService.getEvents(),
        dataService.getClubs(),
        dataService.getAnnouncements(),
        dataService.getRegistrations(),
        dataService.getNotifications(user?.id),
        dataService.getPlatformStats(),
        dataService.getUsers(),
      ]);
      setEvents(evts);
      setClubs(clbs);
      setAnnouncements(ancs);
      setRegistrations(regs);
      setNotifications(notifs);
      setPlatformStats(stats);
      setUsersList(usrs);
    } catch (e) {
      console.error('Error loading app data:', e);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData, role]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    await loadData();
    setRefreshing(false);
  };

  // --- Handlers: Events & Registrations ---
  const handleOpenEventDetails = (event: CampusEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsVisible(true);
  };

  const handleOpenRegistration = (event: CampusEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsVisible(false);
    setIsEventRegVisible(true);
  };

  const handleConfirmRegistration = async (details: { department: string; rollNumber: string }) => {
    if (!user || !selectedEvent) return;
    const result = await dataService.registerForEvent(user.id, selectedEvent.id, details);
    if (result.success && result.registration) {
      setIsEventRegVisible(false);
      await refreshUser();
      await loadData();
      setSelectedPass(result.registration);
      setIsDigitalPassVisible(true);
      Alert.alert('Registration Confirmed! 🎉', result.message);
    } else {
      Alert.alert('Registration Notice', result.message);
    }
  };

  const handleOpenDigitalPass = (reg: EventRegistration) => {
    const matchingEvt = events.find((e) => e.id === reg.eventId) || null;
    setSelectedEvent(matchingEvt);
    setSelectedPass(reg);
    setIsDigitalPassVisible(true);
  };

  const handleCancelRegistration = async (regId: string) => {
    Alert.alert(
      'Cancel Ticket?',
      'Are you sure you want to cancel your event registration? Your seat will be released.',
      [
        { text: 'Keep Ticket', style: 'cancel' },
        {
          text: 'Confirm Cancel',
          style: 'destructive',
          onPress: async () => {
            const res = await dataService.cancelRegistration(regId);
            setIsDigitalPassVisible(false);
            await refreshUser();
            await loadData();
            Alert.alert('Cancelled', res.message);
          },
        },
      ]
    );
  };

  // --- Handlers: Clubs ---
  const handleOpenClubDetails = (club: Club) => {
    setSelectedClub(club);
    setIsClubDetailsVisible(true);
  };

  const handleJoinClub = async () => {
    if (!user || !selectedClub) return;
    const res = await dataService.joinClub(user.id, selectedClub.id);
    await refreshUser();
    await loadData();
    setIsClubDetailsVisible(false);
    Alert.alert(res.success ? 'Welcome! 🤝' : 'Notice', res.message);
  };

  const handleLeaveClub = async () => {
    if (!user || !selectedClub) return;
    Alert.alert(
      'Leave Club?',
      `Are you sure you want to leave ${selectedClub.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            const res = await dataService.leaveClub(user.id, selectedClub.id);
            await refreshUser();
            await loadData();
            setIsClubDetailsVisible(false);
            Alert.alert('Notice', res.message);
          },
        },
      ]
    );
  };

  // --- Handlers: Admin Actions ---
  const handleCreateEvent = async (newEventData: any) => {
    await dataService.createEvent(newEventData);
    await loadData();
    Alert.alert('Event Created! ✨', 'Your event is now live on the campus feed.');
  };

  const handleSaveEventUpdates = async (eventId: string, updates: Partial<CampusEvent>) => {
    await dataService.updateEvent(eventId, updates);
    await loadData();
    Alert.alert('Updated', 'Event details saved successfully.');
  };

  const handleCancelEvent = async (eventId: string) => {
    await dataService.cancelOrDeleteEvent(eventId);
    await loadData();
    Alert.alert('Event Cancelled', 'Event has been marked cancelled.');
  };

  const handlePublishNotice = async (noticeData: any) => {
    await dataService.createAnnouncement(noticeData);
    await loadData();
    Alert.alert('Broadcast Sent! 📢', 'Campus announcement published successfully.');
  };

  const handleSaveProfile = async (updated: any) => {
    if (!user) return;
    const newUser = { ...user, ...updated };
    await dataService.updateUser(newUser);
    await refreshUser();
    await loadData();
    Alert.alert('Saved', 'Profile details updated.');
  };

  const handleToggleUserStatus = async (userId: string) => {
    await dataService.toggleUserStatus(userId);
    await loadData();
  };

  const handleUpdateClub = async (clubId: string, updates: Partial<Club>) => {
    await dataService.updateClub(clubId, updates);
    await loadData();
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await dataService.markAllNotificationsRead(user.id);
    await loadData();
  };

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  if (authLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.teal} />
        <Text style={styles.loadingText}>Initializing Campus Event App...</Text>
      </View>
    );
  }

  // Filtered lists
  const filteredEvents = events.filter((e) => {
    const matchesCat = eventCategoryFilter === 'All' || e.category === eventCategoryFilter;
    const matchesSearch =
      e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.clubName.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.venue.toLowerCase().includes(eventSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredClubs = clubs.filter((c) => {
    const matchesCat = clubCategoryFilter === 'All' || c.category === clubCategoryFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(clubSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(clubSearch.toLowerCase()) ||
      c.presidentName.toLowerCase().includes(clubSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const myRegisteredEvents = events.filter((e) =>
    user?.registeredEventIds?.includes(e.id)
  );

  const myJoinedClubs = clubs.filter((c) =>
    user?.joinedClubIds?.includes(c.id)
  );

  // Club Admin specific events
  const clubAdminClubId = user?.clubId || 'club-2';
  const clubAdminClub = clubs.find((c) => c.id === clubAdminClubId) || clubs[1];
  const myClubEvents = events.filter((e) => e.clubId === clubAdminClubId);
  const myClubTotalAttendees = myClubEvents.reduce((acc, curr) => acc + curr.registeredCount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Top Demo Role Switcher Bar */}
      <RoleSwitcherBar />

      {/* 2. Campus App Header */}
      <Header
        title="DAVV - SCSIT Connect"
        subtitle={`Devi Ahilya Vishwavidyalaya • ${user?.name || 'Nikita Negi'}`}
        onNotificationPress={() => setIsNotificationsVisible(true)}
        onLoginPress={() => router.push('/login')}
        unreadCount={unreadNotifsCount}
      />

      {/* 3. Main Role Content */}
      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.teal} />}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== A. STUDENT VIEW ==================== */}
        {role === 'student' && (
          <View style={styles.roleContainer}>
            {/* Student Sub-Tab Nav */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tabItem, studentTab === 'events' && styles.tabItemActive]}
                onPress={() => setStudentTab('events')}
              >
                <Ionicons
                  name={studentTab === 'events' ? 'calendar' : 'calendar-outline'}
                  size={18}
                  color={studentTab === 'events' ? Colors.deepNavy : Colors.textLight}
                />
                <Text style={[styles.tabLabel, studentTab === 'events' && styles.tabLabelActive]}>
                  Events
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, studentTab === 'clubs' && styles.tabItemActive]}
                onPress={() => setStudentTab('clubs')}
              >
                <Ionicons
                  name={studentTab === 'clubs' ? 'people' : 'people-outline'}
                  size={18}
                  color={studentTab === 'clubs' ? Colors.deepNavy : Colors.textLight}
                />
                <Text style={[styles.tabLabel, studentTab === 'clubs' && styles.tabLabelActive]}>
                  Clubs
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, studentTab === 'passes' && styles.tabItemActive]}
                onPress={() => setStudentTab('passes')}
              >
                <Ionicons
                  name={studentTab === 'passes' ? 'ticket' : 'ticket-outline'}
                  size={18}
                  color={studentTab === 'passes' ? Colors.deepNavy : Colors.textLight}
                />
                <Text style={[styles.tabLabel, studentTab === 'passes' && styles.tabLabelActive]}>
                  My Passes ({myRegisteredEvents.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, studentTab === 'notices' && styles.tabItemActive]}
                onPress={() => setStudentTab('notices')}
              >
                <Ionicons
                  name={studentTab === 'notices' ? 'megaphone' : 'megaphone-outline'}
                  size={18}
                  color={studentTab === 'notices' ? Colors.deepNavy : Colors.textLight}
                />
                <Text style={[styles.tabLabel, studentTab === 'notices' && styles.tabLabelActive]}>
                  Notices
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, studentTab === 'profile' && styles.tabItemActive]}
                onPress={() => setStudentTab('profile')}
              >
                <Ionicons
                  name={studentTab === 'profile' ? 'person' : 'person-outline'}
                  size={18}
                  color={studentTab === 'profile' ? Colors.deepNavy : Colors.textLight}
                />
                <Text style={[styles.tabLabel, studentTab === 'profile' && styles.tabLabelActive]}>
                  Profile
                </Text>
              </TouchableOpacity>
            </View>

            {/* TAB: EVENTS */}
            {studentTab === 'events' && (
              <View style={styles.subview}>
                {/* Search & Filter */}
                <View style={styles.searchContainer}>
                  <Ionicons name="search" size={18} color={Colors.textLight} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search events, venues, hackathons..."
                    placeholderTextColor={Colors.textLight}
                    value={eventSearch}
                    onChangeText={setEventSearch}
                  />
                  {eventSearch.length > 0 && (
                    <TouchableOpacity onPress={() => setEventSearch('')}>
                      <Ionicons name="close-circle" size={18} color={Colors.textLight} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Category Pills */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {(['All', 'Tech', 'Cultural', 'Sports', 'Workshop', 'Academic'] as const).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.catChip, eventCategoryFilter === cat && styles.catChipActive]}
                      onPress={() => setEventCategoryFilter(cat)}
                    >
                      <Text
                        style={[
                          styles.catChipText,
                          eventCategoryFilter === cat && styles.catChipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Event Count Indicator */}
                <View style={styles.countRow}>
                  <Text style={styles.countTitle}>
                    Upcoming Campus Events ({filteredEvents.length})
                  </Text>
                  <Text style={styles.countSub}>Tap to view passes & RSVP</Text>
                </View>

                {/* Events List */}
                {filteredEvents.map((evt) => {
                  const isReg = user?.registeredEventIds?.includes(evt.id) || false;
                  return (
                    <EventCard
                      key={evt.id}
                      event={evt}
                      isRegistered={isReg}
                      onPress={() => handleOpenEventDetails(evt)}
                    />
                  );
                })}
              </View>
            )}

            {/* TAB: CLUBS */}
            {studentTab === 'clubs' && (
              <View style={styles.subview}>
                {/* Search */}
                <View style={styles.searchContainer}>
                  <Ionicons name="search" size={18} color={Colors.textLight} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search student clubs & societies..."
                    placeholderTextColor={Colors.textLight}
                    value={clubSearch}
                    onChangeText={setClubSearch}
                  />
                </View>

                {/* Category Pills */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {(['All', 'Engineering', 'Arts & Music', 'Sports', 'Literary'] as const).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.catChip, clubCategoryFilter === cat && styles.catChipActive]}
                      onPress={() => setClubCategoryFilter(cat)}
                    >
                      <Text
                        style={[
                          styles.catChipText,
                          clubCategoryFilter === cat && styles.catChipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.countRow}>
                  <Text style={styles.countTitle}>
                    Recognized Societies ({filteredClubs.length})
                  </Text>
                  <Text style={styles.countSub}>Tap any club to see meetings & join</Text>
                </View>

                {/* Clubs List */}
                {filteredClubs.map((club) => {
                  const isMember = user?.joinedClubIds?.includes(club.id) || false;
                  return (
                    <ClubCard
                      key={club.id}
                      club={club}
                      isMember={isMember}
                      onPress={() => handleOpenClubDetails(club)}
                    />
                  );
                })}
              </View>
            )}

            {/* TAB: MY PASSES & CLUBS */}
            {studentTab === 'passes' && (
              <View style={styles.subview}>
                {/* Sub-selector */}
                <View style={styles.hubToggleRow}>
                  <TouchableOpacity
                    style={[styles.hubToggleBtn, myHubSubtab === 'passes' && styles.hubToggleBtnActive]}
                    onPress={() => setMyHubSubtab('passes')}
                  >
                    <Ionicons
                      name="ticket"
                      size={16}
                      color={myHubSubtab === 'passes' ? Colors.deepNavy : Colors.textLight}
                    />
                    <Text
                      style={[
                        styles.hubToggleText,
                        myHubSubtab === 'passes' && styles.hubToggleTextActive,
                      ]}
                    >
                      Registered Passes ({myRegisteredEvents.length})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.hubToggleBtn, myHubSubtab === 'clubs' && styles.hubToggleBtnActive]}
                    onPress={() => setMyHubSubtab('clubs')}
                  >
                    <Ionicons
                      name="people"
                      size={16}
                      color={myHubSubtab === 'clubs' ? Colors.deepNavy : Colors.textLight}
                    />
                    <Text
                      style={[
                        styles.hubToggleText,
                        myHubSubtab === 'clubs' && styles.hubToggleTextActive,
                      ]}
                    >
                      My Clubs ({myJoinedClubs.length})
                    </Text>
                  </TouchableOpacity>
                </View>

                {myHubSubtab === 'passes' ? (
                  myRegisteredEvents.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Ionicons name="ticket-outline" size={54} color={Colors.textLight} />
                      <Text style={styles.emptyStateTitle}>No Active Event Passes</Text>
                      <Text style={styles.emptyStateSub}>
                        Browse the Events tab and reserve your digital pass for upcoming hackathons & fests!
                      </Text>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => setStudentTab('events')}
                      >
                        <Text style={styles.actionBtnText}>Explore Events</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    myRegisteredEvents.map((evt) => {
                      const userReg = registrations.find(
                        (r) => r.eventId === evt.id && r.userId === user?.id && r.status === 'confirmed'
                      );
                      return (
                        <View key={evt.id} style={styles.myPassCard}>
                          <View style={[styles.myPassHeader, { backgroundColor: evt.bannerColor }]}>
                            <View>
                              <Text style={styles.myPassCat}>{evt.category.toUpperCase()}</Text>
                              <Text style={styles.myPassTitle}>{evt.title}</Text>
                            </View>
                            <View style={styles.passVerifiedPill}>
                              <Ionicons name="checkmark-done" size={14} color={Colors.white} />
                              <Text style={styles.passVerifiedText}>CONFIRMED</Text>
                            </View>
                          </View>

                          <View style={styles.myPassBody}>
                            <Text style={styles.myPassMeta}>
                              📅 {evt.date} • ⏰ {evt.time}
                            </Text>
                            <Text style={styles.myPassMeta}>📍 {evt.venue}</Text>
                            {userReg && (
                              <View style={styles.ticketCodeRow}>
                                <Text style={styles.ticketCodeLabel}>Digital Ticket Code:</Text>
                                <Text style={styles.ticketCodeVal}>{userReg.ticketCode}</Text>
                              </View>
                            )}
                          </View>

                          <View style={styles.myPassFooter}>
                            <TouchableOpacity
                              style={styles.viewPassBtn}
                              onPress={() => {
                                if (userReg) handleOpenDigitalPass(userReg);
                              }}
                            >
                              <Ionicons name="qr-code" size={16} color={Colors.deepNavy} />
                              <Text style={styles.viewPassBtnText}>Show Digital QR Pass</Text>
                            </TouchableOpacity>

                            {userReg && (
                              <TouchableOpacity
                                style={styles.cancelPassBtn}
                                onPress={() => handleCancelRegistration(userReg.id)}
                              >
                                <Ionicons name="close-circle-outline" size={16} color={Colors.danger} />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      );
                    })
                  )
                ) : (
                  myJoinedClubs.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Ionicons name="people-outline" size={54} color={Colors.textLight} />
                      <Text style={styles.emptyStateTitle}>No Joined Clubs Yet</Text>
                      <Text style={styles.emptyStateSub}>
                        Join student societies to receive meeting updates and insider announcements!
                      </Text>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => setStudentTab('clubs')}
                      >
                        <Text style={styles.actionBtnText}>Discover Clubs</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    myJoinedClubs.map((club) => (
                      <ClubCard
                        key={club.id}
                        club={club}
                        isMember={true}
                        onPress={() => handleOpenClubDetails(club)}
                      />
                    ))
                  )
                )}
              </View>
            )}

            {/* TAB: NOTICES */}
            {studentTab === 'notices' && (
              <View style={styles.subview}>
                <View style={styles.countRow}>
                  <Text style={styles.countTitle}>Campus Announcements ({announcements.length})</Text>
                  <Text style={styles.countSub}>Official broadcasts & room notices</Text>
                </View>
                {announcements.map((anc) => (
                  <AnnouncementCard key={anc.id} announcement={anc} />
                ))}
              </View>
            )}

            {/* TAB: PROFILE */}
            {studentTab === 'profile' && (
              <View style={styles.subview}>
                <View style={styles.profileCard}>
                  <View style={styles.profileAvatar}>
                    <Text style={styles.profileAvatarText}>{user?.name?.charAt(0) || 'S'}</Text>
                  </View>

                  <Text style={styles.profileName}>{user?.name || 'Nikita Negi'}</Text>
                  <Text style={styles.profileEmail}>{user?.email || 'nikita@davv.ac.in'}</Text>

                  <View style={styles.studentIdBadge}>
                    <Text style={styles.studentIdText}>DAVV • SCSIT STUDENT PASS</Text>
                  </View>

                  <View style={styles.profileDetailsGrid}>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileItemLabel}>University</Text>
                      <Text style={[styles.profileItemVal, { fontSize: 12 }]}>DAVV Indore</Text>
                    </View>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileItemLabel}>College / Dept</Text>
                      <Text style={[styles.profileItemVal, { fontSize: 12 }]}>SCSIT</Text>
                    </View>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileItemLabel}>Roll Number</Text>
                      <Text style={styles.profileItemVal}>{user?.rollNumber || 'DAVV-SCSIT-2024-042'}</Text>
                    </View>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileItemLabel}>Department</Text>
                      <Text style={styles.profileItemVal}>{user?.department || 'Computer Science & IT'}</Text>
                    </View>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileItemLabel}>Registered Passes</Text>
                      <Text style={[styles.profileItemVal, { color: Colors.teal }]}>
                        {myRegisteredEvents.length}
                      </Text>
                    </View>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileItemLabel}>Joined Clubs</Text>
                      <Text style={[styles.profileItemVal, { color: Colors.lavender }]}>
                        {myJoinedClubs.length}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.editProfileBtn}
                    onPress={() => setIsEditProfileVisible(true)}
                  >
                    <Ionicons name="pencil" size={16} color={Colors.deepNavy} />
                    <Text style={styles.editProfileText}>Edit Student Credentials</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.loginPortalBtn}
                    onPress={() => router.push('/login')}
                  >
                    <Ionicons name="log-in" size={18} color={Colors.deepNavy} />
                    <Text style={styles.loginPortalBtnText}>Go to Login / Account Portal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.authSwitchBtn}
                    onPress={() => router.push('/splash')}
                  >
                    <Ionicons name="sparkles" size={16} color={Colors.teal} />
                    <Text style={[styles.authSwitchText, { color: Colors.teal, fontWeight: '700' }]}>
                      View Intro & Splash Screen
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={async () => {
                      await logout();
                      router.push('/login');
                    }}
                  >
                    <Ionicons name="log-out-outline" size={16} color={Colors.danger} />
                    <Text style={styles.logoutBtnText}>Log Out Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ==================== B. CLUB ADMIN VIEW ==================== */}
        {role === 'club_admin' && (
          <View style={styles.roleContainer}>
            {/* Club Admin Subtabs */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tabItem, clubAdminTab === 'overview' && styles.tabItemActive]}
                onPress={() => setClubAdminTab('overview')}
              >
                <Ionicons
                  name="grid"
                  size={18}
                  color={clubAdminTab === 'overview' ? Colors.deepNavy : Colors.textLight}
                />
                <Text style={[styles.tabLabel, clubAdminTab === 'overview' && styles.tabLabelActive]}>
                  Overview
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, clubAdminTab === 'events' && styles.tabItemActive]}
                onPress={() => setClubAdminTab('events')}
              >
                <Ionicons
                  name="list"
                  size={18}
                  color={clubAdminTab === 'events' ? Colors.deepNavy : Colors.textLight}
                />
                <Text style={[styles.tabLabel, clubAdminTab === 'events' && styles.tabLabelActive]}>
                  Events ({myClubEvents.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, clubAdminTab === 'notices' && styles.tabItemActive]}
                onPress={() => setClubAdminTab('notices')}
              >
                <Ionicons
                  name="megaphone"
                  size={18}
                  color={clubAdminTab === 'notices' ? Colors.deepNavy : Colors.textLight}
                />
                <Text style={[styles.tabLabel, clubAdminTab === 'notices' && styles.tabLabelActive]}>
                  Broadcasts
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, clubAdminTab === 'profile' && styles.tabItemActive]}
                onPress={() => setClubAdminTab('profile')}
              >
                <Ionicons
                  name="shield"
                  size={18}
                  color={clubAdminTab === 'profile' ? Colors.deepNavy : Colors.textLight}
                />
                <Text style={[styles.tabLabel, clubAdminTab === 'profile' && styles.tabLabelActive]}>
                  Club Info
                </Text>
              </TouchableOpacity>
            </View>

            {/* TAB: OVERVIEW */}
            {clubAdminTab === 'overview' && (
              <View style={styles.subview}>
                {/* Club Leader Banner */}
                <View style={styles.adminHeroCard}>
                  <View style={styles.adminHeroHeader}>
                    <View style={styles.clubPill}>
                      <Text style={styles.clubPillText}>CLUB PRESIDENT PORTAL</Text>
                    </View>
                    <Text style={styles.presidentName}>Leader: {user?.name}</Text>
                  </View>
                  <Text style={styles.adminClubTitle}>{clubAdminClub.name}</Text>
                  <Text style={styles.adminClubBio}>{clubAdminClub.description}</Text>

                  {/* 3 Stats Counters */}
                  <View style={styles.adminStatsRow}>
                    <View style={styles.adminStatCard}>
                      <Text style={styles.adminStatNum}>{myClubEvents.length}</Text>
                      <Text style={styles.adminStatLabel}>Club Events</Text>
                    </View>
                    <View style={styles.adminStatCard}>
                      <Text style={[styles.adminStatNum, { color: Colors.teal }]}>
                        {myClubTotalAttendees}
                      </Text>
                      <Text style={styles.adminStatLabel}>Total RSVPs</Text>
                    </View>
                    <View style={styles.adminStatCard}>
                      <Text style={[styles.adminStatNum, { color: Colors.lavender }]}>
                        {clubAdminClub.memberCount}
                      </Text>
                      <Text style={styles.adminStatLabel}>Members</Text>
                    </View>
                  </View>
                </View>

                {/* Quick Action Buttons */}
                <View style={styles.quickActionRow}>
                  <TouchableOpacity
                    style={styles.quickCreateBtn}
                    onPress={() => setIsCreateEventVisible(true)}
                  >
                    <Ionicons name="add-circle" size={18} color={Colors.deepNavy} />
                    <Text style={styles.quickCreateText}>Create New Event</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickNoticeBtn}
                    onPress={() => setIsPublishNoticeVisible(true)}
                  >
                    <Ionicons name="megaphone" size={18} color={Colors.white} />
                    <Text style={styles.quickNoticeText}>Broadcast Notice</Text>
                  </TouchableOpacity>
                </View>

                {/* Managed Events List */}
                <View style={styles.countRow}>
                  <Text style={styles.countTitle}>Events Hosted by {clubAdminClub.name}</Text>
                  <Text style={styles.countSub}>Manage RSVPs, rosters & cancellations</Text>
                </View>

                {myClubEvents.map((evt) => (
                  <View key={evt.id} style={styles.adminEventCard}>
                    <View style={styles.adminEventTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.adminEventTitle}>{evt.title}</Text>
                        <Text style={styles.adminEventMeta}>
                          📅 {evt.date} • 📍 {evt.venue}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          evt.status === 'cancelled' && { backgroundColor: Colors.danger },
                        ]}
                      >
                        <Text style={styles.statusBadgeText}>{evt.status.toUpperCase()}</Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                      <View style={styles.progressTextRow}>
                        <Text style={styles.progressText}>
                          {evt.registeredCount} of {evt.capacity} registered
                        </Text>
                        <Text style={styles.progressPercent}>
                          {Math.round((evt.registeredCount / evt.capacity) * 100)}%
                        </Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100))}%`,
                              backgroundColor: Colors.teal,
                            },
                          ]}
                        />
                      </View>
                    </View>

                    {/* Action buttons */}
                    <View style={styles.adminActionsRow}>
                      <TouchableOpacity
                        style={styles.adminActionBtn}
                        onPress={() => {
                          setSelectedEvent(evt);
                          setIsParticipantsVisible(true);
                        }}
                      >
                        <Ionicons name="people" size={15} color={Colors.deepNavy} />
                        <Text style={styles.adminActionBtnText}>Attendee Roster</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.adminActionBtn}
                        onPress={() => {
                          setSelectedEvent(evt);
                          setIsEditEventVisible(true);
                        }}
                      >
                        <Ionicons name="pencil" size={15} color={Colors.deepNavy} />
                        <Text style={styles.adminActionBtnText}>Edit Event</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.adminActionBtn, { borderColor: Colors.danger }]}
                        onPress={() => handleCancelEvent(evt.id)}
                      >
                        <Ionicons name="close-circle" size={15} color={Colors.danger} />
                        <Text style={[styles.adminActionBtnText, { color: Colors.danger }]}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* TAB: EVENTS */}
            {clubAdminTab === 'events' && (
              <View style={styles.subview}>
                <TouchableOpacity
                  style={styles.fullWidthCreateBtn}
                  onPress={() => setIsCreateEventVisible(true)}
                >
                  <Ionicons name="add-circle" size={20} color={Colors.deepNavy} />
                  <Text style={styles.fullWidthCreateText}>Schedule & Publish New Event</Text>
                </TouchableOpacity>

                {myClubEvents.map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    onPress={() => {
                      setSelectedEvent(evt);
                      setIsParticipantsVisible(true);
                    }}
                  />
                ))}
              </View>
            )}

            {/* TAB: NOTICES */}
            {clubAdminTab === 'notices' && (
              <View style={styles.subview}>
                <TouchableOpacity
                  style={styles.fullWidthCreateBtn}
                  onPress={() => setIsPublishNoticeVisible(true)}
                >
                  <Ionicons name="megaphone" size={20} color={Colors.deepNavy} />
                  <Text style={styles.fullWidthCreateText}>Broadcast Campus Notice</Text>
                </TouchableOpacity>

                {announcements.map((anc) => (
                  <AnnouncementCard key={anc.id} announcement={anc} />
                ))}
              </View>
            )}

            {/* TAB: PROFILE */}
            {clubAdminTab === 'profile' && (
              <View style={styles.subview}>
                <View style={styles.profileCard}>
                  <View style={[styles.profileAvatar, { backgroundColor: Colors.lavender }]}>
                    <Ionicons name="shield-checkmark" size={32} color={Colors.white} />
                  </View>
                  <Text style={styles.profileName}>{clubAdminClub.name}</Text>
                  <Text style={styles.profileEmail}>Official: {clubAdminClub.contactEmail}</Text>

                  <View style={styles.profileDetailsGrid}>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileItemLabel}>President</Text>
                      <Text style={styles.profileItemVal}>{clubAdminClub.presidentName}</Text>
                    </View>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileItemLabel}>Meeting Schedule</Text>
                      <Text style={styles.profileItemVal}>{clubAdminClub.meetingSchedule}</Text>
                    </View>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileItemLabel}>Total Roster</Text>
                      <Text style={[styles.profileItemVal, { color: Colors.teal }]}>
                        {clubAdminClub.memberCount} Students
                      </Text>
                    </View>
                    <View style={styles.profileItem}>
                      <Text style={styles.profileItemLabel}>Established</Text>
                      <Text style={styles.profileItemVal}>{clubAdminClub.establishedYear}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.authSwitchBtn}
                    onPress={() => router.push('/login')}
                  >
                    <Ionicons name="swap-horizontal" size={16} color={Colors.textSecondary} />
                    <Text style={styles.authSwitchText}>Switch Account or Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ==================== C. SYSTEM ADMIN VIEW ==================== */}
        {role === 'sys_admin' && (
          <View style={styles.roleContainer}>
            {/* System Admin Subtabs */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tabItem, sysAdminTab === 'analytics' && styles.tabItemActive]}
                onPress={() => setSysAdminTab('analytics')}
              >
                <Ionicons
                  name="stats-chart"
                  size={18}
                  color={sysAdminTab === 'analytics' ? Colors.deepNavy : Colors.textLight}
                />
                <Text style={[styles.tabLabel, sysAdminTab === 'analytics' && styles.tabLabelActive]}>
                  Analytics
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, sysAdminTab === 'users' && styles.tabItemActive]}
                onPress={() => setSysAdminTab('users')}
              >
                <Ionicons
                  name="people"
                  size={18}
                  color={sysAdminTab === 'users' ? Colors.deepNavy : Colors.textLight}
                />
                <Text style={[styles.tabLabel, sysAdminTab === 'users' && styles.tabLabelActive]}>
                  Users ({usersList.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, sysAdminTab === 'clubs' && styles.tabItemActive]}
                onPress={() => setSysAdminTab('clubs')}
              >
                <Ionicons
                  name="business"
                  size={18}
                  color={sysAdminTab === 'clubs' ? Colors.deepNavy : Colors.textLight}
                />
                <Text style={[styles.tabLabel, sysAdminTab === 'clubs' && styles.tabLabelActive]}>
                  Clubs ({clubs.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, sysAdminTab === 'events' && styles.tabItemActive]}
                onPress={() => setSysAdminTab('events')}
              >
                <Ionicons
                  name="calendar"
                  size={18}
                  color={sysAdminTab === 'events' ? Colors.deepNavy : Colors.textLight}
                />
                <Text style={[styles.tabLabel, sysAdminTab === 'events' && styles.tabLabelActive]}>
                  Events ({events.length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* TAB: ANALYTICS */}
            {sysAdminTab === 'analytics' && platformStats && (
              <View style={styles.subview}>
                <View style={styles.adminHeroCard}>
                  <View style={styles.clubPill}>
                    <Text style={styles.clubPillText}>DEAN / SYSTEM ADMINISTRATOR</Text>
                  </View>
                  <Text style={styles.adminClubTitle}>Campus Platform Oversight</Text>
                  <Text style={styles.adminClubBio}>
                    Live real-time monitoring of registered student accounts, club affiliations, and campus event capacities.
                  </Text>
                </View>

                {/* Platform KPI Grid */}
                <View style={styles.kpiGrid}>
                  <View style={styles.kpiCard}>
                    <Ionicons name="people" size={24} color={Colors.teal} />
                    <Text style={styles.kpiValue}>{platformStats.totalUsers}</Text>
                    <Text style={styles.kpiLabel}>Total Accounts</Text>
                  </View>

                  <View style={styles.kpiCard}>
                    <Ionicons name="school" size={24} color={Colors.lavender} />
                    <Text style={styles.kpiValue}>{platformStats.totalStudents}</Text>
                    <Text style={styles.kpiLabel}>Enrolled Students</Text>
                  </View>

                  <View style={styles.kpiCard}>
                    <Ionicons name="business" size={24} color={Colors.warning} />
                    <Text style={styles.kpiValue}>{platformStats.totalClubs}</Text>
                    <Text style={styles.kpiLabel}>Active Clubs</Text>
                  </View>

                  <View style={styles.kpiCard}>
                    <Ionicons name="ticket" size={24} color={Colors.info} />
                    <Text style={styles.kpiValue}>{platformStats.totalRegistrations}</Text>
                    <Text style={styles.kpiLabel}>RSVP Passes Issued</Text>
                  </View>
                </View>

                {/* Management Shortcuts */}
                <View style={styles.shortcutRow}>
                  <TouchableOpacity
                    style={styles.shortcutBtn}
                    onPress={() => setIsManageUsersVisible(true)}
                  >
                    <Ionicons name="person-add" size={18} color={Colors.deepNavy} />
                    <Text style={styles.shortcutText}>Manage Users & Roles</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.shortcutBtn}
                    onPress={() => setIsManageClubsVisible(true)}
                  >
                    <Ionicons name="pencil" size={18} color={Colors.deepNavy} />
                    <Text style={styles.shortcutText}>Supervise Clubs</Text>
                  </TouchableOpacity>
                </View>

                {/* Recent Global Events */}
                <View style={styles.countRow}>
                  <Text style={styles.countTitle}>All Monitored Campus Events</Text>
                  <Text style={styles.countSub}>Global authority to inspect and enforce</Text>
                </View>

                {events.map((evt) => (
                  <View key={evt.id} style={styles.adminEventCard}>
                    <View style={styles.adminEventTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.adminEventTitle}>{evt.title}</Text>
                        <Text style={styles.adminEventMeta}>
                          Club: {evt.clubName} • 📍 {evt.venue}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          evt.status === 'cancelled' && { backgroundColor: Colors.danger },
                        ]}
                      >
                        <Text style={styles.statusBadgeText}>{evt.status.toUpperCase()}</Text>
                      </View>
                    </View>

                    <View style={styles.adminActionsRow}>
                      <TouchableOpacity
                        style={styles.adminActionBtn}
                        onPress={() => {
                          setSelectedEvent(evt);
                          setIsParticipantsVisible(true);
                        }}
                      >
                        <Ionicons name="people" size={14} color={Colors.deepNavy} />
                        <Text style={styles.adminActionBtnText}>
                          {evt.registeredCount} RSVPs
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.adminActionBtn, { borderColor: Colors.danger }]}
                        onPress={() => handleCancelEvent(evt.id)}
                      >
                        <Ionicons name="close-circle" size={14} color={Colors.danger} />
                        <Text style={[styles.adminActionBtnText, { color: Colors.danger }]}>
                          Enforce Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* TAB: USERS */}
            {sysAdminTab === 'users' && (
              <View style={styles.subview}>
                <TouchableOpacity
                  style={styles.fullWidthCreateBtn}
                  onPress={() => setIsManageUsersVisible(true)}
                >
                  <Ionicons name="people" size={20} color={Colors.deepNavy} />
                  <Text style={styles.fullWidthCreateText}>Open Full User Directory Modal</Text>
                </TouchableOpacity>

                {usersList.map((usr) => (
                  <View key={usr.id} style={styles.sysUserRow}>
                    <View style={styles.sysAvatar}>
                      <Text style={styles.sysAvatarText}>{usr.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sysUserName}>{usr.name}</Text>
                      <Text style={styles.sysUserSub}>
                        {usr.role.toUpperCase()} • {usr.department} • {usr.rollNumber}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.sysStatusBtn,
                        usr.status === 'suspended' ? styles.sysStatusActivate : styles.sysStatusSuspend,
                      ]}
                      onPress={() => handleToggleUserStatus(usr.id)}
                    >
                      <Text
                        style={[
                          styles.sysStatusText,
                          usr.status === 'suspended' ? { color: Colors.success } : { color: Colors.danger },
                        ]}
                      >
                        {usr.status === 'suspended' ? 'Activate' : 'Suspend'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* TAB: CLUBS */}
            {sysAdminTab === 'clubs' && (
              <View style={styles.subview}>
                <TouchableOpacity
                  style={styles.fullWidthCreateBtn}
                  onPress={() => setIsManageClubsVisible(true)}
                >
                  <Ionicons name="business" size={20} color={Colors.deepNavy} />
                  <Text style={styles.fullWidthCreateText}>Open Club Supervision Manager</Text>
                </TouchableOpacity>

                {clubs.map((c) => (
                  <ClubCard
                    key={c.id}
                    club={c}
                    onPress={() => handleOpenClubDetails(c)}
                  />
                ))}
              </View>
            )}

            {/* TAB: EVENTS */}
            {sysAdminTab === 'events' && (
              <View style={styles.subview}>
                <TouchableOpacity
                  style={styles.fullWidthCreateBtn}
                  onPress={() => setIsCreateEventVisible(true)}
                >
                  <Ionicons name="add-circle" size={20} color={Colors.deepNavy} />
                  <Text style={styles.fullWidthCreateText}>Create Campus-Wide Event</Text>
                </TouchableOpacity>

                {events.map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    onPress={() => handleOpenEventDetails(evt)}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ==================== 4. MODALS ==================== */}
      {/* Event Details */}
      <EventDetailsModal
        visible={isEventDetailsVisible}
        onClose={() => setIsEventDetailsVisible(false)}
        event={selectedEvent}
        isRegistered={user?.registeredEventIds?.includes(selectedEvent?.id || '') || false}
        onRegisterPress={() => {
          if (selectedEvent) handleOpenRegistration(selectedEvent);
        }}
        onViewPassPress={() => {
          if (selectedEvent) {
            const reg = registrations.find(
              (r) => r.eventId === selectedEvent.id && r.userId === user?.id && r.status === 'confirmed'
            );
            if (reg) {
              setIsEventDetailsVisible(false);
              handleOpenDigitalPass(reg);
            }
          }
        }}
      />

      {/* Event Registration */}
      <EventRegistrationModal
        visible={isEventRegVisible}
        onClose={() => setIsEventRegVisible(false)}
        event={selectedEvent}
        user={user}
        onConfirm={handleConfirmRegistration}
      />

      {/* Digital Pass / QR Pass */}
      <DigitalPassModal
        visible={isDigitalPassVisible}
        onClose={() => setIsDigitalPassVisible(false)}
        registration={selectedPass}
        event={selectedEvent}
        onCancelRegistration={(regId) => handleCancelRegistration(regId)}
      />

      {/* Club Details */}
      <ClubDetailsModal
        visible={isClubDetailsVisible}
        onClose={() => setIsClubDetailsVisible(false)}
        club={selectedClub}
        isMember={user?.joinedClubIds?.includes(selectedClub?.id || '') || false}
        onJoinPress={handleJoinClub}
        onLeavePress={handleLeaveClub}
      />

      {/* Create Event */}
      <CreateEventModal
        visible={isCreateEventVisible}
        onClose={() => setIsCreateEventVisible(false)}
        onSubmit={handleCreateEvent}
        defaultClubName={clubAdminClub.name}
        defaultClubId={clubAdminClub.id}
      />

      {/* Edit Event */}
      <EditEventModal
        visible={isEditEventVisible}
        onClose={() => setIsEditEventVisible(false)}
        event={selectedEvent}
        onSave={handleSaveEventUpdates}
        onCancelEvent={handleCancelEvent}
      />

      {/* Event Participants Roster */}
      <EventParticipantsModal
        visible={isParticipantsVisible}
        onClose={() => setIsParticipantsVisible(false)}
        event={selectedEvent}
        registrations={registrations}
      />

      {/* Publish Announcement */}
      <PublishAnnouncementModal
        visible={isPublishNoticeVisible}
        onClose={() => setIsPublishNoticeVisible(false)}
        onSubmit={handlePublishNotice}
        authorName={user?.name || 'Administrator'}
        authorRole={role === 'sys_admin' ? 'System Administrator' : 'Club Leader'}
        clubName={role === 'club_admin' ? clubAdminClub.name : undefined}
        clubId={role === 'club_admin' ? clubAdminClub.id : undefined}
      />

      {/* Notifications */}
      <NotificationsModal
        visible={isNotificationsVisible}
        onClose={() => setIsNotificationsVisible(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Edit Profile */}
      <EditProfileModal
        visible={isEditProfileVisible}
        onClose={() => setIsEditProfileVisible(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      {/* Manage Users (System Admin) */}
      <ManageUsersModal
        visible={isManageUsersVisible}
        onClose={() => setIsManageUsersVisible(false)}
        users={usersList}
        onToggleStatus={handleToggleUserStatus}
      />

      {/* Manage Clubs (System Admin) */}
      <ManageClubsModal
        visible={isManageClubsVisible}
        onClose={() => setIsManageClubsVisible(false)}
        clubs={clubs}
        onUpdateClub={handleUpdateClub}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.deepNavy,
  },
  loadingText: {
    marginTop: 12,
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  mainScroll: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  roleContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 3,
  },
  tabItemActive: {
    backgroundColor: Colors.softTeal,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textLight,
  },
  tabLabelActive: {
    color: Colors.deepNavy,
    fontWeight: '800',
  },
  subview: {
    padding: 16,
    gap: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.deepNavy,
  },
  chipScroll: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: Colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  catChipActive: {
    backgroundColor: Colors.deepNavy,
    borderColor: Colors.deepNavy,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  catChipTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 4,
  },
  countTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.deepNavy,
  },
  countSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  hubToggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  hubToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  hubToggleBtnActive: {
    backgroundColor: Colors.softTeal,
  },
  hubToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
  },
  hubToggleTextActive: {
    color: Colors.deepNavy,
    fontWeight: '800',
  },
  myPassCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  myPassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  myPassCat: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.5,
  },
  myPassTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
    marginTop: 2,
  },
  passVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  passVerifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.white,
  },
  myPassBody: {
    padding: 16,
    gap: 6,
  },
  myPassMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  ticketCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    backgroundColor: Colors.softTeal,
    padding: 8,
    borderRadius: 8,
  },
  ticketCodeLabel: {
    fontSize: 11,
    color: Colors.teal,
    fontWeight: '600',
  },
  ticketCodeVal: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.deepNavy,
  },
  myPassFooter: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    gap: 8,
  },
  viewPassBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.teal,
    paddingVertical: 10,
    borderRadius: 10,
  },
  viewPassBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.deepNavy,
  },
  cancelPassBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.deepNavy,
  },
  emptyStateSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  actionBtn: {
    backgroundColor: Colors.deepNavy,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.deepNavy,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileAvatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.teal,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.deepNavy,
  },
  profileEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  studentIdBadge: {
    backgroundColor: Colors.softLavender,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 16,
  },
  studentIdText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.lavender,
    letterSpacing: 0.8,
  },
  profileDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
    marginBottom: 20,
  },
  profileItem: {
    flexBasis: '47%',
    backgroundColor: Colors.lightBackground,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  profileItemLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textLight,
    textTransform: 'uppercase',
  },
  profileItemVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.deepNavy,
    marginTop: 2,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.softTeal,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 10,
  },
  editProfileText: {
    color: Colors.deepNavy,
    fontSize: 14,
    fontWeight: '700',
  },
  loginPortalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.teal,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    marginBottom: 8,
  },
  loginPortalBtnText: {
    color: Colors.deepNavy,
    fontSize: 14,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    borderRadius: 10,
    width: '100%',
    marginTop: 6,
  },
  logoutBtnText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  authSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  authSwitchText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  adminHeroCard: {
    backgroundColor: Colors.deepNavy,
    borderRadius: 20,
    padding: 20,
  },
  adminHeroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clubPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  clubPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.teal,
    letterSpacing: 0.5,
  },
  presidentName: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  adminClubTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  adminClubBio: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 16,
  },
  adminStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  adminStatCard: {
    flex: 1,
    backgroundColor: '#19203D',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#263159',
  },
  adminStatNum: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
  },
  adminStatLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickCreateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.teal,
    paddingVertical: 13,
    borderRadius: 12,
  },
  quickCreateText: {
    color: Colors.deepNavy,
    fontSize: 13,
    fontWeight: '800',
  },
  quickNoticeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.deepNavy,
    paddingVertical: 13,
    borderRadius: 12,
  },
  quickNoticeText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  adminEventCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  adminEventTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  adminEventTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.deepNavy,
  },
  adminEventMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  statusBadge: {
    backgroundColor: Colors.softTeal,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.teal,
  },
  progressContainer: {
    gap: 4,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.teal,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.lightBackground,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  adminActionsRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 10,
  },
  adminActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.lightBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  adminActionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.deepNavy,
  },
  fullWidthCreateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.teal,
    paddingVertical: 14,
    borderRadius: 14,
  },
  fullWidthCreateText: {
    color: Colors.deepNavy,
    fontSize: 14,
    fontWeight: '800',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiCard: {
    flexBasis: '48%',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.deepNavy,
    marginTop: 6,
  },
  kpiLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  shortcutRow: {
    flexDirection: 'row',
    gap: 10,
  },
  shortcutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  shortcutText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.deepNavy,
  },
  sysUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  sysAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.deepNavy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sysAvatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.teal,
  },
  sysUserName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.deepNavy,
  },
  sysUserSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  sysStatusBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  sysStatusSuspend: {
    borderColor: Colors.danger,
    backgroundColor: '#FEE2E2',
  },
  sysStatusActivate: {
    borderColor: Colors.success,
    backgroundColor: '#DCFCE7',
  },
  sysStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
