import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/utils/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ totalSent: 1250.50, totalReceived: 800.25, totalTransactions: 12 });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const navigateToFeature = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <ThemedText type="title" style={styles.welcomeText}>
            Welcome back, {user?.name || 'User'}! 👋
          </ThemedText>
          <ThemedText style={styles.subtitleText}>
            Ready to send money? Choose an option below
          </ThemedText>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={colors.tint} />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={[styles.balanceCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
        <ThemedText style={styles.balanceLabel}>Current Balance</ThemedText>
        <ThemedText type="title" style={[styles.balanceAmount, { color: colors.tint }]}>
          ${user?.balance?.toFixed(2) || '0.00'}
        </ThemedText>
      </View>

      {/* Feature Cards */}
      <View style={styles.featuresContainer}>
        <TouchableOpacity 
          style={[styles.featureCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}
          onPress={() => navigateToFeature('/(tabs)/send-money')}
        >
          <View style={styles.featureIcon}>
            <ThemedText style={styles.featureEmoji}>💸</ThemedText>
          </View>
          <View style={styles.featureContent}>
            <ThemedText type="subtitle" style={styles.featureTitle}>
              Send Money
            </ThemedText>
            <ThemedText style={styles.featureDescription}>
              Transfer money to friends and family instantly
            </ThemedText>
          </View>
          <ThemedText style={[styles.arrowText, { color: colors.tint }]}>→</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.featureCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}
          onPress={() => navigateToFeature('/(tabs)/transaction-history')}
        >
          <View style={styles.featureIcon}>
            <ThemedText style={styles.featureEmoji}>📊</ThemedText>
          </View>
          <View style={styles.featureContent}>
            <ThemedText type="subtitle" style={styles.featureTitle}>
              Transaction History
            </ThemedText>
            <ThemedText style={styles.featureDescription}>
              View all your past money transfers
            </ThemedText>
          </View>
          <ThemedText style={[styles.arrowText, { color: colors.tint }]}>→</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <ThemedText type="subtitle" style={styles.statsTitle}>
          Quick Stats
        </ThemedText>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
            <ThemedText style={styles.statNumber}>{stats.totalTransactions}</ThemedText>
            <ThemedText style={styles.statLabel}>Transactions</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
            <ThemedText style={styles.statNumber}>${stats.totalSent.toFixed(2)}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Sent</ThemedText>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
            <ThemedText style={styles.statNumber}>${stats.totalReceived.toFixed(2)}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Received</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}>
            <ThemedText style={styles.statNumber}>
              ${((stats.totalReceived - stats.totalSent) + (user?.balance || 0)).toFixed(2)}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Net Position</ThemedText>
          </View>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <ThemedText style={styles.appInfoText}>
          MinitMoney - Fast, secure money transfers
        </ThemedText>
        <ThemedText style={styles.appVersion}>
          Version 1.0.0
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 20,
  },
  userInfo: {
    flex: 1,
    marginRight: 16,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  welcomeText: {
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    opacity: 0.8,
  },

  balanceCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsTitle: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 32,
  },
  appInfoText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 12,
    opacity: 0.4,
  },
});
