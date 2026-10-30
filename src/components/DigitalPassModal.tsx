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
import { EventRegistration, CampusEvent } from '../types';

interface DigitalPassModalProps {
  visible: boolean;
  onClose: () => void;
  registration: EventRegistration | null;
  event: CampusEvent | null;
  onCancelRegistration?: (regId: string) => void;
}

export const DigitalPassModal: React.FC<DigitalPassModalProps> = ({
  visible,
  onClose,
  registration,
  event,
  onCancelRegistration,
}) => {
  if (!registration || !event) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <View style={styles.headerLeft}>
              <Ionicons name="ticket" size={20} color={Colors.teal} />
              <Text style={styles.headerTitle}>Digital Event Pass</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Ticket Card */}
            <View style={styles.ticketCard}>
              {/* Ticket Top */}
              <View style={[styles.ticketTop, { backgroundColor: event.bannerColor || Colors.deepNavy }]}>
                <View style={styles.topHeader}>
                  <Text style={styles.passType}>OFFICIAL ENTRY PASS</Text>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusText}>VERIFIED</Text>
                  </View>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.clubName}>Organized by {event.clubName}</Text>
              </View>

              {/* Jagged / Perforated Divider */}
              <View style={styles.dividerContainer}>
                <View style={[styles.halfCircle, styles.circleLeft]} />
                <View style={styles.dashedLine} />
                <View style={[styles.halfCircle, styles.circleRight]} />
              </View>

              {/* Ticket Bottom Details */}
              <View style={styles.ticketBottom}>
                <View style={styles.detailGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>ATTENDEE</Text>
                    <Text style={styles.detailValue}>{registration.userName}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>ROLL NUMBER</Text>
                    <Text style={styles.detailValue}>{registration.rollNumber}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>DEPARTMENT</Text>
                    <Text style={styles.detailValue}>{registration.department}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>DATE & TIME</Text>
                    <Text style={styles.detailValue}>
                      {event.date} · {event.time.split('-')[0]}
                    </Text>
                  </View>
                </View>

                <View style={styles.venueSection}>
                  <Ionicons name="location" size={15} color={Colors.teal} />
                  <Text style={styles.venueText} numberOfLines={2}>
                    {event.venue}
                  </Text>
                </View>

                {/* QR Code Visual Simulation */}
                <View style={styles.qrContainer}>
                  <View style={styles.qrGrid}>
                    <View style={styles.qrCorner} />
                    <View style={styles.qrCenter}>
                      <Ionicons name="qr-code-outline" size={80} color={Colors.deepNavy} />
                    </View>
                    <View style={styles.qrCorner} />
                  </View>
                  <Text style={styles.ticketCode}>{registration.ticketCode}</Text>
                  <Text style={styles.qrHint}>Scan at entrance gate for validation</Text>
                </View>
              </View>
            </View>

            {/* Bottom Actions */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
                <Text style={styles.doneBtnText}>Close Pass</Text>
              </TouchableOpacity>

              {onCancelRegistration && (
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => {
                    onCancelRegistration(registration.id);
                    onClose();
                  }}
                >
                  <Text style={styles.cancelBtnText}>Cancel Registration</Text>
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
    backgroundColor: 'rgba(16, 21, 43, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: Colors.lightBackground,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.deepNavy,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  ticketTop: {
    padding: 18,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  passType: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
  },
  statusPill: {
    backgroundColor: Colors.teal,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    color: Colors.deepNavy,
    fontSize: 9,
    fontWeight: '800',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
    lineHeight: 22,
  },
  clubName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  dividerContainer: {
    height: 24,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  halfCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.lightBackground,
    position: 'absolute',
  },
  circleLeft: {
    left: -10,
  },
  circleRight: {
    right: -10,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginHorizontal: 16,
  },
  ticketBottom: {
    padding: 18,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
    marginBottom: 14,
  },
  detailItem: {
    width: '50%',
  },
  detailLabel: {
    fontSize: 10,
    color: Colors.textLight,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.deepNavy,
    fontWeight: '700',
  },
  venueSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.softTeal,
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  venueText: {
    fontSize: 12,
    color: Colors.deepNavy,
    fontWeight: '600',
    flex: 1,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F4F9',
  },
  qrGrid: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCenter: {},
  qrCorner: {},
  ticketCode: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.deepNavy,
    letterSpacing: 1.5,
    marginTop: 6,
  },
  qrHint: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 4,
  },
  buttonRow: {
    marginTop: 16,
    gap: 10,
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
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
});
