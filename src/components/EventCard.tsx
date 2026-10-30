import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { CampusEvent } from '../types';

interface EventCardProps {
  event: CampusEvent;
  onPress: () => void;
  isRegistered?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  isRegistered = false,
}) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Tech':
        return Colors.teal;
      case 'Cultural':
        return Colors.lavender;
      case 'Sports':
        return Colors.warning;
      case 'Workshop':
        return Colors.info;
      case 'Academic':
        return Colors.success;
      default:
        return Colors.teal;
    }
  };

  const categoryColor = getCategoryColor(event.category);
  const seatsLeft = Math.max(0, event.capacity - event.registeredCount);
  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Top Banner Accent */}
      <View style={[styles.topBanner, { backgroundColor: event.bannerColor || categoryColor }]}>
        <View style={styles.bannerHeader}>
          <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.92)' }]}>
            <Text style={[styles.badgeText, { color: Colors.deepNavy }]}>
              {event.category.toUpperCase()}
            </Text>
          </View>
          {isRegistered && (
            <View style={styles.registeredPill}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.white} />
              <Text style={styles.registeredText}>REGISTERED</Text>
            </View>
          )}
          {event.status === 'cancelled' && (
            <View style={[styles.registeredPill, { backgroundColor: Colors.danger }]}>
              <Text style={styles.registeredText}>CANCELLED</Text>
            </View>
          )}
        </View>

        <Text style={styles.bannerTitle} numberOfLines={2}>
          {event.title}
        </Text>
      </View>

      {/* Card Body */}
      <View style={styles.body}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={Colors.teal} />
            <Text style={styles.metaText}>{event.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={Colors.lavender} />
            <Text style={styles.metaText}>{event.time}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={[styles.metaItem, { flex: 1 }]}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {event.venue}
            </Text>
          </View>
        </View>

        <View style={styles.clubRow}>
          <Ionicons name="people-outline" size={14} color={Colors.textLight} />
          <Text style={styles.clubText} numberOfLines={1}>
            By {event.clubName}
          </Text>
        </View>

        {/* Capacity Bar */}
        <View style={styles.capacitySection}>
          <View style={styles.capacityHeader}>
            <Text style={styles.capacityLabel}>Seats Booked</Text>
            <Text style={styles.capacityCount}>
              {event.registeredCount}/{event.capacity} ({seatsLeft} left)
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${percentFilled}%`,
                  backgroundColor: percentFilled > 85 ? Colors.danger : categoryColor,
                },
              ]}
            />
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              isRegistered
                ? styles.actionBtnRegistered
                : { backgroundColor: Colors.deepNavy },
            ]}
            onPress={onPress}
          >
            <Text
              style={[
                styles.actionBtnText,
                isRegistered ? { color: Colors.teal } : { color: Colors.white },
              ]}
            >
              {isRegistered ? 'View Digital Pass 🎫' : 'View Details & Register →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  topBanner: {
    padding: 16,
    minHeight: 90,
    justifyContent: 'space-between',
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  registeredPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  registeredText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 22,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  body: {
    padding: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    marginBottom: 10,
  },
  clubText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  capacitySection: {
    marginTop: 4,
    marginBottom: 12,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  capacityLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  capacityCount: {
    fontSize: 11,
    color: Colors.deepNavy,
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#EDF1F7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionRow: {
    marginTop: 2,
  },
  actionBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnRegistered: {
    backgroundColor: Colors.softTeal,
    borderWidth: 1,
    borderColor: Colors.teal,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
