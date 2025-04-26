import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Chrome as Home, BookHeart, Compass, HandHelping as PrayingHands, Settings } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';

export default function TabLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const iconSize = 24;
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontFamily: 'Roboto-Medium',
          fontSize: 12,
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => (
            <Home size={iconSize} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer-times"
        options={{
          title: t('prayers'),
          tabBarIcon: ({ color }) => (
            <PrayingHands size={iconSize} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="qibla"
        options={{
          title: t('qibla'),
          tabBarIcon: ({ color }) => (
            <Compass size={iconSize} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="adhkar"
        options={{
          title: t('adhkar'),
          tabBarIcon: ({ color }) => (
            <BookHeart size={iconSize} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color }) => (
            <Settings size={iconSize} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 64,
    paddingBottom: 8,
  },
});