import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { CampusEvent, EventRegistration } from '../types';

interface EventParticipantsModalProps {
  visible: boolean;
  onClose: () => void;
  event: CampusEvent | null;
  registrations: EventRegistration[];
}

export const EventParticipantsModal: React.FC<EventParticipantsModalProps> = ({
  visible,
  onClose,
  event,
  registrations,
}) => {
  if (!event) return null;

  const eventAttendees = registrations.filter(
    (r) => r.eventId === event.id && r.status === 'confirmed'
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Event Attendee Roster</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {event.title}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Metrics summary */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{eventAttendees.length}</Text>
              <Text style={styles.summaryLabel}>Confirmed Registrations</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{event.capacity}</Text>
              <Text style={styles.summaryLabel}>Total Seat Capacity</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: Colors.teal }]}>
                {Math.round((eventAttendees.length / event.capacity) * 100)}%
              </Text>
              <Text style={styles.summaryLabel}>Occupancy Rate</Text>
            </View>
          </View>

          {/* List */}
          {eventAttendees.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>No registrations yet</Text>
              <Text style={styles.emptySubtitle}>
                Students will appear here as soon as they claim their digital pass.
              </Text>
            </View>
          ) : (
            <FlatList
              data={eventAttendees}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item, index }) => (
                <View style={styles.attendeeCard}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitial}>{item.userName.charAt(0)}</Text>
                  </View>

                  <View style={styles.attendeeInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.attendeeName}>{item.userName}</Text>
                      <View style={styles.ticketPill}>
                        <Text style={styles.ticketPillText}>{item.ticketCode}</Text>
                      </View>
                    </View>

                    <Text style={styles.subDetail}>
                      {item.rollNumber} • {item.department}
                    </Text>
                    <Text style={styles.emailDetail}>{item.userEmail}</Text>
                  </View>
                </View>
              )}
            />
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.doneBtnText}>Close Roster</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 21, 43, 0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.deepNavy,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: Colors.lightBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.cardBorder,
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.deepNavy,
  },
  summaryLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  attendeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.lightBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.softLavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: Colors.lavender,
    fontWeight: '800',
    fontSize: 16,
  },
  attendeeInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  attendeeName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.deepNavy,
  },
  ticketPill: {
    backgroundColor: Colors.softTeal,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ticketPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.teal,
  },
  subDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  emailDetail: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 1,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.deepNavy,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  doneBtn: {
    backgroundColor: Colors.deepNavy,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

