import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { CampusEvent, User } from '../types';
import { useAuth } from '../context/AuthContext';

interface EventRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  event: CampusEvent | null;
  onConfirm?: (regDetails: { department: string; rollNumber: string }) => void;
  onSuccess?: (regDetails: { department: string; rollNumber: string }) => void;
  user?: User | null;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  visible,
  onClose,
  event,
  onConfirm,
  onSuccess,
  user: userProp,
}) => {
  const { user: authUser } = useAuth();
  const currentUser = userProp || authUser;
  const [department, setDepartment] = useState(currentUser?.department || 'School of Computer Science & IT (SCSIT)');
  const [rollNumber, setRollNumber] = useState(currentUser?.rollNumber || 'DAVV-SCSIT-2024-042');
  const [specialNote, setSpecialNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!event) return null;

  const handleSubmit = () => {
    if (!rollNumber.trim()) {
      setError('Please provide your college roll number.');
      return;
    }
    if (!department.trim()) {
      setError('Please provide your academic department.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (onConfirm) {
        onConfirm({ department, rollNumber });
      } else if (onSuccess) {
        onSuccess({ department, rollNumber });
      }
    }, 200);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Event Registration</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {event.title}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.body}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.field}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={currentUser?.name || 'Nikita Negi'}
                editable={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={currentUser?.email || 'nikita@davv.ac.in'}
                editable={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>DEPARTMENT / MAJOR</Text>
              <TextInput
                style={styles.input}
                value={department}
                onChangeText={setDepartment}
                placeholder="e.g. Electrical & Electronics"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>COLLEGE ROLL NUMBER</Text>
              <TextInput
                style={styles.input}
                value={rollNumber}
                onChangeText={setRollNumber}
                placeholder="e.g. DAVV-SCSIT-042"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>SPECIAL REQUIREMENTS (OPTIONAL)</Text>
              <TextInput
                style={styles.input}
                value={specialNote}
                onChangeText={setSpecialNote}
                placeholder="e.g. Vegetarian meal, laptop table"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.guaranteeBox}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.teal} />
              <Text style={styles.guaranteeText}>
                Your seat and QR boarding pass will be generated instantly.
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitBtn}
                disabled={isSubmitting}
                onPress={handleSubmit}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.submitBtnText}>Confirm Registration</Text>
                )}
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  container: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.lightBackground,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.deepNavy,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    maxWidth: 240,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 18,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    backgroundColor: Colors.softRose,
    padding: 8,
    borderRadius: 8,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.deepNavy,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.lightBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: Colors.deepNavy,
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    color: Colors.textSecondary,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.softTeal,
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  guaranteeText: {
    fontSize: 11,
    color: Colors.deepNavy,
    fontWeight: '600',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  cancelBtnText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: Colors.deepNavy,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  submitBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
