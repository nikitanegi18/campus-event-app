import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Announcement, AnnouncementPriority } from '../types';

interface PublishAnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Announcement, 'id' | 'date'>) => Promise<void>;
  authorName: string;
  authorRole: string;
  clubName?: string;
  clubId?: string;
}

const PRIORITIES: { key: AnnouncementPriority; label: string; color: string }[] = [
  { key: 'general', label: 'General Info', color: Colors.teal },
  { key: 'important', label: 'Important Notice', color: Colors.warning },
  { key: 'urgent', label: 'Urgent Alert', color: Colors.danger },
];

export const PublishAnnouncementModal: React.FC<PublishAnnouncementModalProps> = ({
  visible,
  onClose,
  onSubmit,
  authorName,
  authorRole,
  clubName,
  clubId,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('important');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter an announcement title.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Required', 'Please enter the announcement body message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        authorName,
        authorRole,
        clubId,
        clubName,
        priority,
      });
      setTitle('');
      setContent('');
      onClose();
    } catch (e) {
      Alert.alert('Error', 'Failed to publish announcement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Publish Announcement</Text>
              <Text style={styles.subtitle}>Broadcast to students & campus members</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* Priority Selector */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Broadcast Priority</Text>
              <View style={styles.priorityRow}>
                {PRIORITIES.map((p) => {
                  const isSelected = priority === p.key;
                  return (
                    <TouchableOpacity
                      key={p.key}
                      style={[
                        styles.priorityChip,
                        isSelected && { borderColor: p.color, backgroundColor: p.color + '15' },
                      ]}
                      onPress={() => setPriority(p.key)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.priorityDot,
                          { backgroundColor: p.color },
                        ]}
                      />
                      <Text
                        style={[
                          styles.priorityText,
                          isSelected && { color: p.color, fontWeight: '800' },
                        ]}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Announcement Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Venue Change for CloudCon Hackathon"
                placeholderTextColor={Colors.textLight}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Content */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Message Body *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write the full campus broadcast notice here..."
                placeholderTextColor={Colors.textLight}
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Author Attribution */}
            <View style={styles.attributionBox}>
              <Ionicons name="megaphone-outline" size={18} color={Colors.deepNavy} />
              <Text style={styles.attributionText}>
                Posting as <Text style={{ fontWeight: '800' }}>{authorName}</Text> ({clubName || authorRole})
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.publishBtn, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              <Ionicons name="send" size={16} color={Colors.deepNavy} />
              <Text style={styles.publishBtnText}>
                {isSubmitting ? 'Publishing...' : 'Broadcast Announcement'}
              </Text>
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
    fontSize: 12,
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
  },
  body: {
    padding: 20,
    gap: 14,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.deepNavy,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.lightBackground,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.lightBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.deepNavy,
  },
  textArea: {
    height: 100,
  },
  attributionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.softLavender,
    padding: 10,
    borderRadius: 10,
  },
  attributionText: {
    fontSize: 12,
    color: Colors.deepNavy,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  publishBtn: {
    backgroundColor: Colors.teal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  publishBtnText: {
    color: Colors.deepNavy,
    fontSize: 15,
    fontWeight: '800',
  },
});

