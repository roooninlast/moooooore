import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useHijriDate } from '@/hooks/useHijriDate';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/contexts/ThemeContext';
import ScreenContainer from '@/components/layout/ScreenContainer';
import PrayerTimeCard from '@/components/prayer-times/PrayerTimeCard';
import { Bell, Compass, BookHeart } from 'lucide-react-native';
import DailyContent from '@/components/home/DailyContent';
import SectionHeader from '@/components/common/SectionHeader';
import { useCountdown } from '@/hooks/useCountdown';
import { useSettings } from '@/hooks/useSettings';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { requestLocationPermission, hasLocationPermission } = useLocationPermission();
  const { todayPrayerTimes, currentPrayer, nextPrayer } = usePrayerTimes();
  const { formattedHijriDate } = useHijriDate();
  const { hours, minutes, seconds } = useCountdown(nextPrayer?.time);
  const { settings, updateSettings } = useSettings();

  React.useEffect(() => {
    if (!hasLocationPermission) {
      requestLocationPermission();
    }
  }, [hasLocationPermission, requestLocationPermission]);

  const toggleNotifications = (prayer: string) => {
    updateSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [prayer.toLowerCase()]: !settings.notifications[prayer.toLowerCase()],
      },
    });
  };

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Hijri date */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.hijriDate, { color: theme.colors.white }]}>
            {formattedHijriDate}
          </Text>
          <View style={styles.headerContent}>
            <Text style={[styles.welcomeText, { color: theme.colors.white }]}>
              {t('welcome_message')}
            </Text>
          </View>
        </View>

        {/* Next prayer section */}
        <View style={[styles.nextPrayerContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.nextPrayerLabel, { color: theme.colors.text }]}>
            {t('next_prayer')}
          </Text>
          <Text style={[styles.nextPrayerName, { color: theme.colors.primary }]}>
            {nextPrayer?.name}
          </Text>
          <Text style={[styles.nextPrayerTime, { color: theme.colors.text }]}>
            {nextPrayer?.time}
          </Text>
          {nextPrayer && (
            <Text style={[styles.countdown, { color: theme.colors.textLight }]}>
              {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
            </Text>
          )}
        </View>

        {/* Quick actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: theme.colors.card }]}
            onPress={() => router.push('/(tabs)/prayer-times')}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
              <Bell size={24} color={theme.colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
              {t('notifications')}
            </Text>
            <Switch
              value={settings.notifications[currentPrayer?.name.toLowerCase()]}
              onValueChange={() => toggleNotifications(currentPrayer?.name)}
              trackColor={{ 
                false: theme.colors.border, 
                true: theme.colors.primary 
              }}
              thumbColor={theme.colors.white}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: theme.colors.card }]}
            onPress={() => router.push('/(tabs)/qibla')}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
              <Compass size={24} color={theme.colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
              {t('qibla')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: theme.colors.card }]}
            onPress={() => router.push('/(tabs)/adhkar')}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
              <BookHeart size={24} color={theme.colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
              {t('adhkar')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Daily content section */}
        <SectionHeader title={t('daily_content')} />
        <DailyContent />

        {/* Today's prayer times */}
        <SectionHeader title={t('todays_prayers')} />
        <View style={styles.prayerTimesContainer}>
          {todayPrayerTimes.map((prayer, index) => (
            <PrayerTimeCard
              key={index}
              name={prayer.name}
              time={prayer.time}
              isNext={prayer.name === nextPrayer?.name}
              isCurrent={prayer.name === currentPrayer?.name}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  hijriDate: {
    fontFamily: 'ScheherazadeNew-Regular',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 22,
    textAlign: 'center',
  },
  nextPrayerContainer: {
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  nextPrayerLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
  nextPrayerName: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    marginVertical: 5,
  },
  nextPrayerTime: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
  },
  countdown: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginTop: 5,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 30,
  },
  quickAction: {
    width: '30%',
    height: 100,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  prayerTimesContainer: {
    marginHorizontal: 20,
  },
});