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
import { User, UserRole } from '../types';

interface ManageUsersModalProps {
  visible: boolean;
  onClose: () => void;
  users: User[];
  onToggleStatus: (userId: string) => Promise<void>;
}

export const ManageUsersModal: React.FC<ManageUsersModalProps> = ({
  visible,
  onClose,
  users,
  onToggleStatus,
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase()) ||
      u.rollNumber.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'student':
        return { label: 'Student', bg: Colors.softTeal, text: Colors.teal };
      case 'club_admin':
        return { label: 'Club Admin', bg: Colors.softNavy, text: Colors.deepNavy };
      case 'sys_admin':
        return { label: 'System Admin', bg: Colors.softLavender, text: Colors.lavender };
    }
  };

  const handleToggle = (user: User) => {
    const action = user.status === 'active' ? 'Suspend' : 'Activate';
    Alert.alert(
      `${action} Account?`,
      `Are you sure you want to ${action.toLowerCase()} account for ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action,
          style: user.status === 'active' ? 'destructive' : 'default',
          onPress: () => onToggleStatus(user.id),
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
              <Text style={styles.title}>Manage Campus Users</Text>
              <Text style={styles.subtitle}>Total registered: {users.length} accounts</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Search & Filter */}
          <View style={styles.filterSection}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={16} color={Colors.textLight} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, roll no, department..."
                placeholderTextColor={Colors.textLight}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={16} color={Colors.textLight} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.roleFilterRow}>
              {(['all', 'student', 'club_admin', 'sys_admin'] as const).map((r) => {
                const isSelected = roleFilter === r;
                const label =
                  r === 'all'
                    ? 'All Roles'
                    : r === 'student'
                    ? 'Students'
                    : r === 'club_admin'
                    ? 'Club Admins'
                    : 'Sys Admins';
                return (
                  <TouchableOpacity
                    key={r}
                    style={[styles.roleChip, isSelected && styles.roleChipSelected]}
                    onPress={() => setRoleFilter(r)}
                  >
                    <Text
                      style={[
                        styles.roleChipText,
                        isSelected && styles.roleChipTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* List */}
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const roleInfo = getRoleBadge(item.role);
              const isSuspended = item.status === 'suspended';

              return (
                <View style={[styles.userCard, isSuspended && styles.userCardSuspended]}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitial}>{item.name.charAt(0)}</Text>
                  </View>

                  <View style={styles.userInfo}>
                    <View style={styles.userNameRow}>
                      <Text style={styles.userName}>{item.name}</Text>
                      <View style={[styles.badge, { backgroundColor: roleInfo.bg }]}>
                        <Text style={[styles.badgeText, { color: roleInfo.text }]}>
                          {roleInfo.label}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.userDetail}>
                      {item.rollNumber} • {item.department}
                    </Text>
                    <Text style={styles.userEmail}>{item.email}</Text>

                    {item.clubName && (
                      <Text style={styles.clubLeadText}>Lead: {item.clubName}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.statusToggleBtn,
                      isSuspended ? styles.statusBtnActivate : styles.statusBtnSuspend,
                    ]}
                    onPress={() => handleToggle(item)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.statusToggleText,
                        isSuspended ? { color: Colors.success } : { color: Colors.danger },
                      ]}
                    >
                      {isSuspended ? 'Activate' : 'Suspend'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />

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
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.deepNavy,
  },
  roleFilterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  roleChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: Colors.lightBackground,
  },
  roleChipSelected: {
    backgroundColor: Colors.deepNavy,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  roleChipTextSelected: {
    color: Colors.white,
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: Colors.lightBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  userCardSuspended: {
    opacity: 0.6,
    borderColor: Colors.danger,
    backgroundColor: '#FFF1F2',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.deepNavy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.deepNavy,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  userDetail: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  userEmail: {
    fontSize: 11,
    color: Colors.textLight,
  },
  clubLeadText: {
    fontSize: 10,
    color: Colors.teal,
    fontWeight: '700',
    marginTop: 2,
  },
  statusToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBtnSuspend: {
    borderColor: Colors.danger,
    backgroundColor: '#FEE2E2',
  },
  statusBtnActivate: {
    borderColor: Colors.success,
    backgroundColor: '#DCFCE7',
  },
  statusToggleText: {
    fontSize: 11,
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

