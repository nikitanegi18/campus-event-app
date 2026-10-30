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
import { Club } from '../types';

interface ClubDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  club: Club | null;
  isMember: boolean;
  onJoinPress: () => void;
  onLeavePress: () => void;
}

export const ClubDetailsModal: React.FC<ClubDetailsModalProps> = ({
  visible,
  onClose,
  club,
  isMember,
  onJoinPress,
  onLeavePress,
}) => {
  if (!club) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header Banner */}
          <View style={[styles.banner, { backgroundColor: club.accentColor || Colors.deepNavy }]}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={Colors.white} />
            </TouchableOpacity>

            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{club.category.toUpperCase()}</Text>
            </View>

            <Text style={styles.clubName}>{club.name}</Text>
            <Text style={styles.establishedText}>Established {club.establishedYear}</Text>
          </View>

          {/* Body Content */}
          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {/* Quick Stats Grid */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Ionicons name="people" size={20} color={Colors.teal} />
                <Text style={styles.statNum}>{club.memberCount}</Text>
                <Text style={styles.statLabel}>Active Members</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.lavender} />
                <Text style={styles.statNum}>{club.status.toUpperCase()}</Text>
                <Text style={styles.statLabel}>Campus Status</Text>
              </View>
            </View>

            {/* About Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About the Club</Text>
              <Text style={styles.sectionBody}>{club.description}</Text>
            </View>

            {/* Leadership & Schedule Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Club Leadership & Schedule</Text>

              <View style={styles.infoRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="person" size={16} color={Colors.deepNavy} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Club President</Text>
                  <Text style={styles.infoValue}>{club.presidentName}</Text>
                  <Text style={styles.infoSubtext}>{club.presidentEmail}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="time" size={16} color={Colors.teal} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Meeting Schedule</Text>
                  <Text style={styles.infoValue}>{club.meetingSchedule}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="mail" size={16} color={Colors.lavender} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Official Contact</Text>
                  <Text style={styles.infoValue}>{club.contactEmail}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Action Bar */}
          <View style={styles.footer}>
            {isMember ? (
              <View style={styles.memberActionContainer}>
                <View style={styles.joinedBadge}>
                  <Ionicons name="checkmark-circle" size={18} color={Colors.teal} />
                  <Text style={styles.joinedBadgeText}>You are an active club member</Text>
                </View>
                <TouchableOpacity
                  style={styles.leaveBtn}
                  onPress={onLeavePress}
                  activeOpacity={0.8}
                >
                  <Text style={styles.leaveBtnText}>Leave Club</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.joinBtn}
                onPress={onJoinPress}
                activeOpacity={0.85}
              >
                <Ionicons name="add-circle" size={20} color={Colors.deepNavy} />
                <Text style={styles.joinBtnText}>Join This Club</Text>
              </TouchableOpacity>
            )}
          </View>
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
    maxHeight: '85%',
    overflow: 'hidden',
  },
  banner: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryPillText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  clubName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  establishedText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  body: {
    padding: 20,
    paddingBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.deepNavy,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.deepNavy,
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.deepNavy,
    marginTop: 1,
  },
  infoSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    backgroundColor: Colors.white,
  },
  joinBtn: {
    backgroundColor: Colors.teal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  joinBtnText: {
    color: Colors.deepNavy,
    fontSize: 15,
    fontWeight: '800',
  },
  memberActionContainer: {
    gap: 10,
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.softTeal,
    paddingVertical: 8,
    borderRadius: 10,
  },
  joinedBadgeText: {
    color: Colors.teal,
    fontWeight: '700',
    fontSize: 13,
  },
  leaveBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  leaveBtnText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
});

