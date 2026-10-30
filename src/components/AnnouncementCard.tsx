import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Announcement } from '../types';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { bg: Colors.softRose, text: Colors.danger, label: 'URGENT' };
      case 'important':
        return { bg: Colors.softAmber, text: Colors.warning, label: 'IMPORTANT' };
      default:
        return { bg: Colors.softTeal, text: Colors.teal, label: 'CAMPUS UPDATE' };
    }
  };

  const priorityStyle = getPriorityStyle(announcement.priority);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.priorityPill, { backgroundColor: priorityStyle.bg }]}>
          <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
            {priorityStyle.label}
          </Text>
        </View>
        <Text style={styles.dateText}>{announcement.date}</Text>
      </View>

      <Text style={styles.title}>{announcement.title}</Text>
      <Text style={styles.content}>{announcement.content}</Text>

      <View style={styles.authorRow}>
        <Ionicons name="megaphone-outline" size={13} color={Colors.teal} />
        <Text style={styles.authorText}>
          {announcement.authorName} · {announcement.authorRole}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textLight,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.deepNavy,
    marginBottom: 6,
    lineHeight: 20,
  },
  content: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderTopWidth: 1,
    borderTopColor: '#F1F4F9',
    paddingTop: 8,
  },
  authorText: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '600',
  },
});
