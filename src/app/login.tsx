import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export default function LoginScreen() {
  const router = useRouter();
  const { login, register, demoLogin } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('Nikita Negi');
  const [department, setDepartment] = useState('School of Computer Science & IT (SCSIT)');
  const [rollNumber, setRollNumber] = useState('DAVV-SCSIT-2024-042');
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert('Required', 'Please enter your registered campus email (e.g. nikita@davv.ac.in).');
      return;
    }
    setIsLoading(true);
    const result = await login(email.trim());
    setIsLoading(false);
    if (result.success) {
      router.replace('/');
    } else {
      Alert.alert('Sign In Failed', result.message);
    }
  };

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !department.trim() || !rollNumber.trim()) {
      Alert.alert('Required Fields', 'Please fill in all account fields.');
      return;
    }
    setIsLoading(true);
    const result = await register({
      name: name.trim(),
      email: email.trim(),
      role,
      department: department.trim(),
      rollNumber: rollNumber.trim(),
    });
    setIsLoading(false);
    if (result.success) {
      router.replace('/');
    } else {
      Alert.alert('Registration Failed', result.message);
    }
  };

  const handleDemo = async (targetRole: UserRole) => {
    setIsLoading(true);
    await demoLogin(targetRole);
    setIsLoading(false);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Top Bar with Back Button */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.replace('/')}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.teal} />
              <Text style={styles.backBtnText}>Back to Campus App</Text>
            </TouchableOpacity>
            <View style={styles.univBadge}>
              <Text style={styles.univBadgeText}>DAVV • INDORE</Text>
            </View>
          </View>

          {/* Hero Header */}
          <View style={styles.heroSection}>
            <View style={styles.logoBadge}>
              <Ionicons name="school" size={32} color={Colors.teal} />
            </View>
            <Text style={styles.appTitle}>DAVV - SCSIT Connect</Text>
            <Text style={styles.appSubtitle}>
              School of Computer Science & Information Technology
            </Text>
            <Text style={styles.appUniv}>Devi Ahilya Vishwavidyalaya, Indore</Text>
          </View>

          {/* Quick Demo Login Section */}
          <View style={styles.demoBox}>
            <View style={styles.demoHeader}>
              <Ionicons name="flash" size={16} color={Colors.teal} />
              <Text style={styles.demoTitle}>DEMO PRESENTATION ONE-TAP LOGIN</Text>
            </View>
            <Text style={styles.demoDesc}>
              Instantly switch into any of the 3 roles for project evaluation:
            </Text>

            <View style={styles.demoBtnRow}>
              <TouchableOpacity
                style={[styles.demoCard, { borderColor: Colors.teal }]}
                onPress={() => handleDemo('student')}
                activeOpacity={0.8}
              >
                <Text style={styles.demoEmoji}>🎓</Text>
                <Text style={styles.demoRoleName}>Student</Text>
                <Text style={styles.demoUserName}>Nikita Negi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoCard, { borderColor: Colors.lavender }]}
                onPress={() => handleDemo('club_admin')}
                activeOpacity={0.8}
              >
                <Text style={styles.demoEmoji}>⚡</Text>
                <Text style={styles.demoRoleName}>Club Admin</Text>
                <Text style={styles.demoUserName}>Priya Sharma</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoCard, { borderColor: Colors.warning }]}
                onPress={() => handleDemo('sys_admin')}
                activeOpacity={0.8}
              >
                <Text style={styles.demoEmoji}>🛡️</Text>
                <Text style={styles.demoRoleName}>Sys Admin</Text>
                <Text style={styles.demoUserName}>Dr. Vance</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Mode Toggle */}
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeBtn, mode === 'signin' && styles.modeBtnActive]}
                onPress={() => setMode('signin')}
              >
                <Text style={[styles.modeText, mode === 'signin' && styles.modeTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeBtn, mode === 'signup' && styles.modeBtnActive]}
                onPress={() => setMode('signup')}
              >
                <Text style={[styles.modeText, mode === 'signup' && styles.modeTextActive]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {mode === 'signin' ? (
              <View style={styles.inputsContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Campus Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. nikita@davv.ac.in"
                    placeholderTextColor={Colors.textLight}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                {/* Quick Hint */}
                <TouchableOpacity
                  style={styles.quickFillHint}
                  onPress={() => setEmail('nikita@davv.ac.in')}
                >
                  <Text style={styles.quickFillText}>
                    💡 Quick Fill: <Text style={{ textDecorationLine: 'underline' }}>nikita@davv.ac.in</Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryBtn, isLoading && { opacity: 0.6 }]}
                  onPress={handleSignIn}
                  disabled={isLoading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>
                    {isLoading ? 'Verifying Account...' : 'Sign In to SCSIT DAVV'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inputsContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Full Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Nikita Negi"
                    placeholderTextColor={Colors.textLight}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>DAVV Email *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. nikita@davv.ac.in"
                    placeholderTextColor={Colors.textLight}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1.4 }]}>
                    <Text style={styles.label}>Department</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="School of Computer Science & IT"
                      placeholderTextColor={Colors.textLight}
                      value={department}
                      onChangeText={setDepartment}
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 0.9 }]}>
                    <Text style={styles.label}>Roll No</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="DAVV-SCSIT-042"
                      placeholderTextColor={Colors.textLight}
                      value={rollNumber}
                      onChangeText={setRollNumber}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Account Role</Text>
                  <View style={styles.roleSelectRow}>
                    {(['student', 'club_admin'] as UserRole[]).map((r) => (
                      <TouchableOpacity
                        key={r}
                        style={[styles.roleSelectBtn, role === r && styles.roleSelectBtnActive]}
                        onPress={() => setRole(r)}
                      >
                        <Text
                          style={[
                            styles.roleSelectText,
                            role === r && styles.roleSelectTextActive,
                          ]}
                        >
                          {r === 'student' ? 'Student' : 'Club Leader'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.primaryBtn, isLoading && { opacity: 0.6 }]}
                  onPress={handleSignUp}
                  disabled={isLoading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>
                    {isLoading ? 'Creating Account...' : 'Complete Registration'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.deepNavy,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  backBtnText: {
    color: Colors.teal,
    fontSize: 13,
    fontWeight: '700',
  },
  univBadge: {
    backgroundColor: '#19203D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263159',
  },
  univBadgeText: {
    color: Colors.lavender,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#19203D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.teal,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 12,
    color: Colors.teal,
    marginTop: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
  appUniv: {
    fontSize: 11,
    color: Colors.lavender,
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center',
  },
  demoBox: {
    backgroundColor: '#19203D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#263159',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.teal,
    letterSpacing: 0.5,
  },
  demoDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },
  demoBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoCard: {
    flex: 1,
    backgroundColor: Colors.deepNavy,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  demoEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  demoRoleName: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.white,
  },
  demoUserName: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.lightBackground,
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeBtnActive: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modeTextActive: {
    color: Colors.deepNavy,
    fontWeight: '800',
  },
  inputsContainer: {
    gap: 12,
  },
  formGroup: {
    gap: 5,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    fontSize: 11,
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
    fontSize: 13,
    color: Colors.deepNavy,
  },
  quickFillHint: {
    alignSelf: 'flex-start',
    marginTop: -4,
  },
  quickFillText: {
    fontSize: 11,
    color: Colors.teal,
    fontWeight: '600',
  },
  roleSelectRow: {
    flexDirection: 'row',
    gap: 10,
  },
  roleSelectBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: Colors.lightBackground,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  roleSelectBtnActive: {
    backgroundColor: Colors.deepNavy,
    borderColor: Colors.deepNavy,
  },
  roleSelectText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  roleSelectTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: Colors.teal,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    color: Colors.deepNavy,
    fontSize: 15,
    fontWeight: '800',
  },
});
