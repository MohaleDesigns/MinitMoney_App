import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/utils/AuthContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import minit_money_logo from '../../assets/images/minit_money_logo.png';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<any[]>([]);

  const { login } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {// Check if fetched users contain a matching user
      const matchingUser = users.find(user => {
        const emailMatch = user.email === email.trim();
        const passwordMatch = user.passwordHash === password;
        return emailMatch && passwordMatch;
      });
      
      if (matchingUser) {
        // Create user data from the matched user
        const userData = {
          id: matchingUser.id || '1',
          email: matchingUser.email,
          name: matchingUser.fullName || matchingUser.email.split('@')[0],
          token: 'auth-token-' + Date.now(),
          balance: matchingUser.balance || 0
        };
        
        await login(userData);
        router.replace('/(tabs)') 
      } else {
        Alert.alert('Error', 'Invalid credentials. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    
    try {
      // Demo account
      const userData = {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        token: 'demo-token-' + Date.now(),
        balance: 2500.75
      };
      
      await login(userData);
      
      Alert.alert(
        'Demo Login!', 
        'Welcome to the demo account!',
        [
          { 
            text: 'Continue', 
            onPress: () => router.replace('/(tabs)') 
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', 'Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS}:8081/api/user`);

      const data = await response.json();

      setUsers(data);
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        "Error",
        error.message || "Failed to fetch users. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image
              source={minit_money_logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: colors.text }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
              Sign in to your MinitMoney account
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              disabled={!email.trim() || !password.trim()}
              style={styles.loginButton}
            />

            {/* <Button
              title="Try Demo Account"
              onPress={handleDemoLogin}
              loading={loading}
              variant="outline"
              style={styles.demoButton}
            /> */}

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.tabIconDefault }]}>
                Don&apos;t have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/register' as any)}>
                <Text style={[styles.linkText, { color: colors.tint }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    width: '70%',
    height: 100,
    marginBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  loginButton: {
    marginBottom: 16,
  },
  demoButton: {
    marginBottom: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
