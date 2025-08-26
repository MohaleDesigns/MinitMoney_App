import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/utils/AuthContext';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();

  console.log('RootLayoutNav: Rendering with user:', user ? 'logged in' : 'not logged in', 'isLoading:', isLoading);

  if (isLoading) {
    console.log('RootLayoutNav: Showing loading state');
    return null; // Show loading while checking auth
  }

  if (user) {
    console.log('RootLayoutNav: User authenticated, showing tabs');
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    );
  } else {
    console.log('RootLayoutNav: User not authenticated, showing auth');
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    );
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
