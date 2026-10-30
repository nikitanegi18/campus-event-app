import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const RoleSwitcherBar: React.FC = () => {
  const router = useRouter();
  const { role, switchRole } = useAuth();

  const roles: { key: UserRole; label: string; icon: string }[] = [
    { key: 'student', label: 'Student (Nikita)', icon: '🎓' },
    { key: 'club_admin', label: 'Club Admin', icon: '⚡' },
    { key: 'sys_admin', label: 'Sys Admin', icon: '🛡️' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerLabel}>DAVV • SCSIT PRESENTATION ROLE SWITCHER:</Text>
        <TouchableOpacity
          style={styles.loginLinkBtn}
          onPress={() => router.push('/login')}
          activeOpacity={0.8}
        >
          <Ionicons name="log-in-outline" size={13} color={Colors.teal} />
          <Text style={styles.loginLinkText}>Login Page</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        {roles.map((r) => {
          const isActive = role === r.key;
          return (
            <TouchableOpacity
              key={r.key}
              style={[
                styles.roleBtn,
                isActive && styles.roleBtnActive,
              ]}
              onPress={() => switchRole(r.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.roleIcon}>{r.icon}</Text>
              <Text
                style={[
                  styles.roleBtnText,
                  isActive && styles.roleBtnTextActive,
                ]}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.deepNavy,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#222B52',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.lavender,
    letterSpacing: 0.5,
  },
  loginLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(24, 198, 181, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(24, 198, 181, 0.3)',
  },
  loginLinkText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.teal,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 6,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#19203D',
    borderWidth: 1,
    borderColor: '#263159',
    gap: 5,
  },
  roleBtnActive: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },
  roleIcon: {
    fontSize: 13,
  },
  roleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  roleBtnTextActive: {
    color: Colors.deepNavy,
    fontWeight: '800',
  },
});
