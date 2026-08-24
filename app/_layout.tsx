import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGullakFonts } from '@/constants/fonts';
import { AuthProvider } from '@/context/auth-context';
import { PortfolioProvider } from '@/context/portfolio-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useGullakFonts();

  // Keep splash screen until fonts are ready (Expo handles this automatically)
  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <PortfolioProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="sign-in" options={{ headerShown: false }} />
              <Stack.Screen name="sign-up" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="ai-coach" options={{ headerShown: false }} />
              <Stack.Screen name="notifications" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="light" />
          </ThemeProvider>
        </PortfolioProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
