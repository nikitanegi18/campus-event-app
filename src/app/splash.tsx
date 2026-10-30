import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export default function SplashScreen() {
  const router = useRouter();
  const { demoLogin } = useAuth();

  const handleDemo = async (role: UserRole) => {
    await demoLogin(role);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Logo & Branding */}
        <View style={styles.heroSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={44} color={Colors.teal} />
          </View>
          <View style={styles.universityBadge}>
            <Text style={styles.universityBadgeText}>DEVI AHILYA VISHWAVIDYALAYA (DAVV)</Text>
          </View>
          <Text style={styles.title}>SCSIT Campus Event & Club Management</Text>
          <Text style={styles.subtitle}>
            School of Computer Science & Information Technology • DAVV Indore
          </Text>
        </View>

        {/* Value Highlights */}
        <View style={styles.featuresCard}>
          <View style={styles.featureRow}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.softTeal }]}>
              <Ionicons name="ticket" size={20} color={Colors.teal} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Digital QR Passes</Text>
              <Text style={styles.featureDesc}>1-tap RSVPs with unique barcode passes for door entry.</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.softLavender }]}>
              <Ionicons name="people" size={20} color={Colors.lavender} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Campus Societies & Clubs</Text>
              <Text style={styles.featureDesc}>Join tech teams, cultural bands, athletics, and debate groups.</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.softAmber }]}>
              <Ionicons name="megaphone" size={20} color={Colors.warning} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Real-Time Campus Broadcasts</Text>
              <Text style={styles.featureDesc}>Urgent room notices and society updates delivered instantly.</Text>
            </View>
          </View>
        </View>

        {/* Demo Roles Quick Launch */}
        <View style={styles.demoSection}>
          <Text style={styles.demoHeader}>DEMO VIVA ROLES (ONE-TAP LAUNCH):</Text>

          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={[styles.roleBtn, { borderColor: Colors.teal }]}
              onPress={() => handleDemo('student')}
              activeOpacity={0.8}
            >
              <Text style={styles.roleBtnEmoji}>🎓</Text>
              <Text style={styles.roleBtnTitle}>Student</Text>
              <Text style={styles.roleBtnSub}>Nikita Negi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, { borderColor: Colors.lavender }]}
              onPress={() => handleDemo('club_admin')}
              activeOpacity={0.8}
            >
              <Text style={styles.roleBtnEmoji}>⚡</Text>
              <Text style={styles.roleBtnTitle}>Club Admin</Text>
              <Text style={styles.roleBtnSub}>Priya Sharma</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, { borderColor: Colors.warning }]}
              onPress={() => handleDemo('sys_admin')}
              activeOpacity={0.8}
            >
              <Text style={styles.roleBtnEmoji}>🛡️</Text>
              <Text style={styles.roleBtnTitle}>Sys Admin</Text>
              <Text style={styles.roleBtnSub}>Dr. Vance</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Standard Auth Buttons */}
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.replace('/')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Enter Campus Application</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.deepNavy} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/login')}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryBtnText}>Sign In / Register New Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.deepNavy,
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#19203D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.teal,
    marginBottom: 14,
    shadowColor: Colors.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  universityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  universityBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.teal,
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  featuresCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.deepNavy,
  },
  featureDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  demoSection: {
    backgroundColor: '#19203D',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#263159',
  },
  demoHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.lavender,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    backgroundColor: Colors.deepNavy,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  roleBtnEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  roleBtnTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.white,
  },
  roleBtnSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  footerButtons: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: Colors.teal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    width: '100%',
  },
  primaryBtnText: {
    color: Colors.deepNavy,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  secondaryBtnText: {
    color: Colors.lavender,
    fontSize: 13,
    fontWeight: '600',
  },
});

