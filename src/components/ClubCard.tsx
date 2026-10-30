import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Club } from '../types';

interface ClubCardProps {
  club: Club;
  onPress: () => void;
  isMember?: boolean;
}

export const ClubCard: React.FC<ClubCardProps> = ({
  club,
  onPress,
  isMember = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.accentStrip, { backgroundColor: club.accentColor || Colors.teal }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{club.category}</Text>
          </View>
          {isMember ? (
            <View style={styles.memberBadge}>
              <Ionicons name="checkmark-circle" size={13} color={Colors.teal} />
              <Text style={styles.memberBadgeText}>JOINED</Text>
            </View>
          ) : (
            <View style={styles.countBadge}>
              <Ionicons name="people" size={13} color={Colors.textSecondary} />
              <Text style={styles.countText}>{club.memberCount} members</Text>
            </View>
          )}
        </View>

        <Text style={styles.clubName}>{club.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {club.description}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.leadInfo}>
            <Ionicons name="person-circle-outline" size={16} color={Colors.textLight} />
            <Text style={styles.leadText}>Lead: {club.presidentName}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              isMember ? styles.actionButtonJoined : styles.actionButtonPrimary,
            ]}
            onPress={onPress}
          >
            <Text
              style={[
                styles.actionButtonText,
                isMember ? { color: Colors.textSecondary } : { color: Colors.white },
              ]}
            >
              {isMember ? 'Joined' : 'Explore'}
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
    borderRadius: 14,
    marginVertical: 7,
    marginHorizontal: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  accentStrip: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: Colors.softNavy,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.deepNavy,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.softTeal,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  memberBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.teal,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  clubName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F4F9',
    paddingTop: 8,
  },
  leadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  leadText: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '500',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  actionButtonPrimary: {
    backgroundColor: Colors.deepNavy,
  },
  actionButtonJoined: {
    backgroundColor: Colors.lightBackground,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
