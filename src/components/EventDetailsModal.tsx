import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { CampusEvent } from '../types';

interface EventDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  event: CampusEvent | null;
  isRegistered: boolean;
  onRegisterPress: () => void;
  onViewPassPress: () => void;
  onCancelPress?: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  visible,
  onClose,
  event,
  isRegistered,
  onRegisterPress,
  onViewPassPress,
  onCancelPress,
}) => {
  if (!event) return null;

  const seatsLeft = Math.max(0, event.capacity - event.registeredCount);
  const isFull = seatsLeft === 0;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Top Banner */}
          <View style={[styles.banner, { backgroundColor: event.bannerColor || Colors.deepNavy }]}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={Colors.white} />
            </TouchableOpacity>

            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{event.category.toUpperCase()}</Text>
            </View>

            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.clubSubtitle}>Hosted by {event.clubName}</Text>
          </View>

          {/* Details Scroll */}
          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {/* Quick Info Grid */}
            <View style={styles.infoGrid}>
              <View style={styles.infoBox}>
                <Ionicons name="calendar" size={18} color={Colors.teal} />
                <Text style={styles.infoBoxLabel}>DATE</Text>
                <Text style={styles.infoBoxValue}>{event.date}</Text>
              </View>

              <View style={styles.infoBox}>
                <Ionicons name="time" size={18} color={Colors.lavender} />
                <Text style={styles.infoBoxLabel}>TIME</Text>
                <Text style={styles.infoBoxValue}>{event.time}</Text>
              </View>

              <View style={styles.infoBox}>
                <Ionicons name="location" size={18} color={Colors.warning} />
                <Text style={styles.infoBoxLabel}>VENUE</Text>
                <Text style={styles.infoBoxValue} numberOfLines={2}>
                  {event.venue}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Ionicons name="people" size={18} color={Colors.info} />
                <Text style={styles.infoBoxLabel}>CAPACITY</Text>
                <Text style={styles.infoBoxValue}>
                  {event.registeredCount}/{event.capacity} ({seatsLeft} left)
                </Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About This Event</Text>
              <Text style={styles.descriptionText}>{event.description}</Text>
            </View>

            {/* Event Highlights / Requirements */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Event Highlights</Text>
              <View style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.teal} />
                <Text style={styles.bulletText}>Official certificate of participation</Text>
              </View>
              <View style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.teal} />
                <Text style={styles.bulletText}>Refreshments and networking session</Text>
              </View>
              <View style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.teal} />
                <Text style={styles.bulletText}>Bring your college ID card for QR scanning</Text>
              </View>
            </View>

            {/* Action Area */}
            <View style={styles.actionContainer}>
              {isRegistered ? (
                <View style={styles.registeredArea}>
                  <TouchableOpacity
                    style={styles.viewPassBtn}
                    onPress={() => {
                      onClose();
                      onViewPassPress();
                    }}
                  >
                    <Ionicons name="ticket" size={18} color={Colors.white} />
                    <Text style={styles.viewPassBtnText}>View My Digital Pass</Text>
                  </TouchableOpacity>

                  {onCancelPress && (
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => {
                        onClose();
                        onCancelPress();
                      }}
                    >
                      <Text style={styles.cancelBtnText}>Cancel Registration</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.registerBtn,
                    (isFull || event.status === 'cancelled') && styles.registerBtnDisabled,
                  ]}
                  disabled={isFull || event.status === 'cancelled'}
                  onPress={() => {
                    onClose();
                    onRegisterPress();
                  }}
                >
                  <Text style={styles.registerBtnText}>
                    {event.status === 'cancelled'
                      ? 'Event Cancelled'
                      : isFull
                      ? 'Sold Out / Full Capacity'
                      : 'Register for Event (Free) 🚀'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 21, 43, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  banner: {
    padding: 20,
    paddingTop: 16,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.deepNavy,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 25,
    marginBottom: 4,
  },
  clubSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  body: {
    padding: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  infoBox: {
    width: '48%',
    backgroundColor: Colors.lightBackground,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  infoBoxLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textLight,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  infoBoxValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.deepNavy,
    marginTop: 2,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.deepNavy,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  bulletText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  actionContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  registerBtn: {
    backgroundColor: Colors.deepNavy,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  registerBtnDisabled: {
    backgroundColor: Colors.textLight,
  },
  registerBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  registeredArea: {
    gap: 8,
  },
  viewPassBtn: {
    backgroundColor: Colors.teal,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    gap: 6,
  },
  viewPassBtnText: {
    color: Colors.deepNavy,
    fontSize: 14,
    fontWeight: '800',
  },
  cancelBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
});
