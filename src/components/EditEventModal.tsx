import React, { useState, useEffect } from 'react';
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
import { CampusEvent } from '../types';

interface EditEventModalProps {
  visible: boolean;
  onClose: () => void;
  event: CampusEvent | null;
  onSave: (eventId: string, updates: Partial<CampusEvent>) => Promise<void>;
  onCancelEvent: (eventId: string) => Promise<void>;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  visible,
  onClose,
  event,
  onSave,
  onCancelEvent,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<CampusEvent['status']>('upcoming');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setTime(event.time);
      setVenue(event.venue);
      setCapacity(event.capacity.toString());
      setDescription(event.description);
      setStatus(event.status);
    }
  }, [event, visible]);

  if (!event) return null;

  const handleSave = async () => {
    if (!title.trim() || !venue.trim()) {
      Alert.alert('Required Fields', 'Title and venue are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(event.id, {
        title: title.trim(),
        date: date.trim(),
        time: time.trim(),
        venue: venue.trim(),
        capacity: parseInt(capacity, 10) || event.capacity,
        description: description.trim(),
        status,
      });
      onClose();
    } catch (e) {
      Alert.alert('Error', 'Failed to update event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPress = () => {
    Alert.alert(
      'Cancel Event?',
      'Are you sure you want to mark this event as cancelled? Registered students will see the cancellation notice.',
      [
        { text: 'Keep Active', style: 'cancel' },
        {
          text: 'Confirm Cancellation',
          style: 'destructive',
          onPress: async () => {
            setIsSubmitting(true);
            try {
              await onCancelEvent(event.id);
              onClose();
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Edit Campus Event</Text>
              <Text style={styles.subtitle}>{event.clubName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Event Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  placeholder="Date"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Time</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={setTime}
                  placeholder="Time"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 2 }]}>
                <Text style={styles.label}>Venue</Text>
                <TextInput
                  style={styles.input}
                  value={venue}
                  onChangeText={setVenue}
                  placeholder="Venue"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Capacity</Text>
                <TextInput
                  style={styles.input}
                  value={capacity}
                  onChangeText={setCapacity}
                  keyboardType="numeric"
                  placeholder="Capacity"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusRow}>
                {(['upcoming', 'ongoing', 'completed', 'cancelled'] as CampusEvent['status'][]).map(
                  (st) => (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.statusChip,
                        status === st && styles.statusChipSelected,
                      ]}
                      onPress={() => setStatus(st)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          status === st && styles.statusChipTextSelected,
                        ]}
                      >
                        {st.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelEventBtn}
              onPress={handleCancelPress}
              disabled={isSubmitting || event.status === 'cancelled'}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle-outline" size={16} color={Colors.danger} />
              <Text style={styles.cancelEventText}>Cancel Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>Save Updates</Text>
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
    height: 70,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.lightBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statusChipSelected: {
    backgroundColor: Colors.deepNavy,
    borderColor: Colors.deepNavy,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  statusChipTextSelected: {
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    gap: 12,
  },
  cancelEventBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 14,
  },
  cancelEventText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1.5,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  saveBtnText: {
    color: Colors.deepNavy,
    fontSize: 15,
    fontWeight: '800',
  },
});

