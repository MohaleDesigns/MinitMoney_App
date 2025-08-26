import { useAuth } from '@/utils/AuthContext';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();

  // Don't redirect here - let the root layout handle routing
  if (isLoading) {
    return null; // Show loading while checking auth
  }

  // If user is authenticated, don't render auth screens
  if (user) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
