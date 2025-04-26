import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { 
  Amiri_400Regular, 
  Amiri_700Bold 
} from '@expo-google-fonts/amiri';
import { 
  ScheherazadeNew_400Regular, 
  ScheherazadeNew_700Bold 
} from '@expo-google-fonts/scheherazade-new';
import { 
  Roboto_400Regular, 
  Roboto_500Medium, 
  Roboto_700Bold 
} from '@expo-google-fonts/roboto';
import { ActivityIndicator, View } from 'react-native';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { LocationProvider } from '@/contexts/LocationContext';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Amiri-Regular': Amiri_400Regular,
    'Amiri-Bold': Amiri_700Bold,
    'ScheherazadeNew-Regular': ScheherazadeNew_400Regular,
    'ScheherazadeNew-Bold': ScheherazadeNew_700Bold,
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-Bold': Roboto_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0A5F38" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SettingsProvider>
        <LocationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
          </Stack>
          <StatusBar style="auto" />
        </LocationProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}