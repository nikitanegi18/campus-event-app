import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Club } from '../types';

interface ManageClubsModalProps {
  visible: boolean;
  onClose: () => void;
  clubs: Club[];
  onUpdateClub: (clubId: string, updates: Partial<Club>) => Promise<void>;
}

export const ManageClubsModal: React.FC<ManageClubsModalProps> = ({
  visible,
  onClose,
  clubs,
  onUpdateClub,
}) => {
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [editPresident, setEditPresident] = useState('');
  const [editSchedule, setEditSchedule] = useState('');
  const [editContact, setEditContact] = useState('');

  const handleStartEdit = (club: Club) => {
    setEditingClub(club);
    setEditPresident(club.presidentName);
    setEditSchedule(club.meetingSchedule);
    setEditContact(club.contactEmail);
  };

  const handleSaveEdit = async () => {
    if (!editingClub) return;
    try {
      await onUpdateClub(editingClub.id, {
        presidentName: editPresident.trim(),
        meetingSchedule: editSchedule.trim(),
        contactEmail: editContact.trim(),
      });
      setEditingClub(null);
      Alert.alert('Success', 'Club details updated successfully.');
    } catch (e) {
      Alert.alert('Error', 'Failed to update club.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Manage Campus Clubs</Text>
              <Text style={styles.subtitle}>Supervision and verified status</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Edit submodal or list */}
          {editingClub ? (
            <View style={styles.editForm}>
              <View style={styles.editHeaderRow}>
                <Text style={styles.editClubTitle}>Editing {editingClub.name}</Text>
                <TouchableOpacity onPress={() => setEditingClub(null)}>
                  <Text style={styles.cancelEditText}>Cancel</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>President Name</Text>
                <TextInput
                  style={styles.input}
                  value={editPresident}
                  onChangeText={setEditPresident}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Meeting Schedule</Text>
                <TextInput
                  style={styles.input}
                  value={editSchedule}
                  onChangeText={setEditSchedule}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Contact Email</Text>
                <TextInput
                  style={styles.input}
                  value={editContact}
                  onChangeText={setEditContact}
                />
              </View>

              <TouchableOpacity style={styles.saveEditBtn} onPress={handleSaveEdit}>
                <Text style={styles.saveEditText}>Save Club Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={clubs}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <View style={styles.clubCard}>
                  <View style={[styles.colorStrip, { backgroundColor: item.accentColor }]} />
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.clubName}>{item.name}</Text>
                      <View style={styles.statusPill}>
                        <Text style={styles.statusPillText}>{item.status.toUpperCase()}</Text>
                      </View>
                    </View>

                    <Text style={styles.presidentDetail}>
                      President: <Text style={{ fontWeight: '700' }}>{item.presidentName}</Text>
                    </Text>
                    <Text style={styles.metaDetail}>
                      {item.memberCount} members • {item.category}
                    </Text>
                    <Text style={styles.scheduleDetail} numberOfLines={1}>
                      📅 {item.meetingSchedule}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => handleStartEdit(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="pencil" size={16} color={Colors.deepNavy} />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.doneBtnText}>Close Manager</Text>
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
    maxHeight: '88%',
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
  listContent: {
    padding: 16,
    gap: 10,
  },
  clubCard: {
    flexDirection: 'row',
    backgroundColor: Colors.lightBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    alignItems: 'center',
  },
  colorStrip: {
    width: 6,
    alignSelf: 'stretch',
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clubName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.deepNavy,
    flex: 1,
  },
  statusPill: {
    backgroundColor: Colors.softTeal,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.teal,
  },
  presidentDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  metaDetail: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 1,
  },
  scheduleDetail: {
    fontSize: 11,
    color: Colors.deepNavy,
    marginTop: 4,
  },
  editBtn: {
    padding: 14,
  },
  editForm: {
    padding: 20,
    gap: 12,
  },
  editHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  editClubTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.deepNavy,
  },
  cancelEditText: {
    fontSize: 13,
    color: Colors.danger,
    fontWeight: '600',
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.deepNavy,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Colors.lightBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
  },
  saveEditBtn: {
    backgroundColor: Colors.teal,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  saveEditText: {
    color: Colors.deepNavy,
    fontSize: 14,
    fontWeight: '700',
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

