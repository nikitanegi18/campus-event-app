import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { CampusEvent, EventCategory } from '../types';

interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<CampusEvent, 'id' | 'createdAt' | 'registeredCount'>) => Promise<void>;
  defaultClubName?: string;
  defaultClubId?: string;
}

const CATEGORIES: EventCategory[] = ['Tech', 'Cultural', 'Sports', 'Workshop', 'Academic'];

const COLOR_OPTIONS = [
  '#18C6B5', // Teal
  '#A99BFF', // Lavender
  '#10152B', // Deep Navy
  '#F59E0B', // Amber
  '#10B981', // Green
  '#EF4444', // Red
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  visible,
  onClose,
  onSubmit,
  defaultClubName = 'Robotics & AI Club',
  defaultClubId = 'club-2',
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Tech');
  const [date, setDate] = useState('Nov 28, 2026');
  const [time, setTime] = useState('02:00 PM - 05:00 PM');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('150');
  const [bannerColor, setBannerColor] = useState(COLOR_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter an event title.');
      return;
    }
    if (!venue.trim()) {
      Alert.alert('Required Field', 'Please enter the event venue.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Required Field', 'Please enter a description for students.');
      return;
    }

    const capNum = parseInt(capacity, 10) || 100;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        clubId: defaultClubId,
        clubName: defaultClubName,
        category,
        date,
        time,
        venue: venue.trim(),
        description: description.trim(),
        capacity: capNum,
        bannerColor,
        status: 'upcoming',
        isFeatured: false,
      });
      // Reset form
      setTitle('');
      setVenue('');
      setDescription('');
      onClose();
    } catch (e) {
      Alert.alert('Error', 'Failed to publish event. Please try again.');
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
              <Text style={styles.title}>Create Campus Event</Text>
              <Text style={styles.subtitle}>Publishing for {defaultClubName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Event Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Autonomous Drone Racing & AI Workshop"
                placeholderTextColor={Colors.textLight}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Category Select */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryRow}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          isSelected && styles.categoryChipTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Date & Time */}
            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Date *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Nov 28, 2026"
                  placeholderTextColor={Colors.textLight}
                  value={date}
                  onChangeText={setDate}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Time *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 02:00 PM - 05:00 PM"
                  placeholderTextColor={Colors.textLight}
                  value={time}
                  onChangeText={setTime}
                />
              </View>
            </View>

            {/* Venue & Capacity */}
            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 2 }]}>
                <Text style={styles.label}>Venue Location *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Main Auditorium Hall B"
                  placeholderTextColor={Colors.textLight}
                  value={venue}
                  onChangeText={setVenue}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Seat Capacity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="150"
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textLight}
                  value={capacity}
                  onChangeText={setCapacity}
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Event Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Details about the event, what students should bring, learning outcomes, rules..."
                placeholderTextColor={Colors.textLight}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Color Theme */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Banner Accent Theme</Text>
              <View style={styles.colorRow}>
                {COLOR_OPTIONS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorDot,
                      { backgroundColor: c },
                      bannerColor === c && styles.colorDotSelected,
                    ]}
                    onPress={() => setBannerColor(c)}
                    activeOpacity={0.8}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              <Ionicons name="sparkles" size={18} color={Colors.deepNavy} />
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Publishing Event...' : 'Publish Campus Event'}
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
    maxHeight: '90%',
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
    height: 80,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: Colors.lightBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  categoryChipSelected: {
    backgroundColor: Colors.deepNavy,
    borderColor: Colors.deepNavy,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryChipTextSelected: {
    color: Colors.white,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: Colors.deepNavy,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  submitBtn: {
    backgroundColor: Colors.teal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  submitBtnText: {
    color: Colors.deepNavy,
    fontSize: 15,
    fontWeight: '800',
  },
});

