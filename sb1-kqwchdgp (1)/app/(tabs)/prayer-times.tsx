import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/hooks/useSettings';
import ScreenContainer from '@/components/layout/ScreenContainer';
import PrayerTimeRow from '@/components/prayer-times/PrayerTimeRow';
import ScreenHeader from '@/components/common/ScreenHeader';
import { Bell, Clock, MapPin, Settings } from 'lucide-react-native';

export default function PrayerTimesScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { todayPrayerTimes, currentPrayer, nextPrayer, weeklyPrayerTimes } = usePrayerTimes();
  const { settings, updateSettings } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  
  const calculationMethods = [
    { id: 'MWL', name: t('muslim_world_league') },
    { id: 'ISNA', name: t('isna') },
    { id: 'Egypt', name: t('egyptian') },
    { id: 'Makkah', name: t('umm_al_qura') },
    { id: 'Karachi', name: t('karachi') },
    { id: 'Tehran', name: t('tehran') },
    { id: 'Singapore', name: t('singapore') },
  ];

  return (
    <ScreenContainer>
      <ScreenHeader 
        title={t('prayer_times')} 
        rightIcon={
          <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
            <Settings size={24} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {showSettings ? (
          <View style={styles.settingsContainer}>
            <Text style={[styles.settingsTitle, { color: theme.colors.text }]}>
              {t('prayer_settings')}
            </Text>
            
            <View style={styles.settingSection}>
              <Text style={[styles.settingSectionTitle, { color: theme.colors.primary }]}>
                {t('calculation_method')}
              </Text>
              
              {calculationMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodItem,
                    settings.calculationMethod === method.id && {
                      backgroundColor: theme.colors.primaryLight,
                    },
                  ]}
                  onPress={() => updateSettings({ 
                    ...settings, 
                    calculationMethod: method.id 
                  })}
                >
                  <Text
                    style={[
                      styles.methodText,
                      { color: theme.colors.text },
                      settings.calculationMethod === method.id && {
                        color: theme.colors.primary,
                        fontFamily: 'Roboto-Bold',
                      },
                    ]}
                  >
                    {method.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.settingSection}>
              <Text style={[styles.settingSectionTitle, { color: theme.colors.primary }]}>
                {t('notifications')}
              </Text>
              
              {todayPrayerTimes.map((prayer) => (
                <View key={prayer.name} style={styles.notificationRow}>
                  <Text style={[styles.prayerName, { color: theme.colors.text }]}>
                    {prayer.name}
                  </Text>
                  <Switch
                    value={settings.notifications[prayer.name.toLowerCase()]}
                    onValueChange={(value) =>
                      updateSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          [prayer.name.toLowerCase()]: value,
                        },
                      })
                    }
                    trackColor={{ 
                      false: theme.colors.border, 
                      true: theme.colors.primary 
                    }}
                    thumbColor={
                      settings.notifications[prayer.name.toLowerCase()]
                        ? theme.colors.white
                        : theme.colors.background
                    }
                  />
                </View>
              ))}
            </View>
            
            <View style={styles.settingSection}>
              <Text style={[styles.settingSectionTitle, { color: theme.colors.primary }]}>
                {t('adhan_settings')}
              </Text>
              
              <View style={styles.notificationRow}>
                <View style={styles.settingRow}>
                  <Bell size={18} color={theme.colors.text} />
                  <Text style={[styles.settingText, { color: theme.colors.text }]}>
                    {t('enable_adhan')}
                  </Text>
                </View>
                <Switch
                  value={settings.enableAdhan}
                  onValueChange={(value) =>
                    updateSettings({
                      ...settings,
                      enableAdhan: value,
                    })
                  }
                  trackColor={{ 
                    false: theme.colors.border, 
                    true: theme.colors.primary 
                  }}
                  thumbColor={
                    settings.enableAdhan
                      ? theme.colors.white
                      : theme.colors.background
                  }
                />
              </View>
            </View>
          </View>
        ) : (
          <>
            <View style={[styles.todayContainer, { backgroundColor: theme.colors.card }]}>
              <View style={styles.locationContainer}>
                <MapPin size={16} color={theme.colors.textLight} />
                <Text style={[styles.locationText, { color: theme.colors.textLight }]}>
                  {settings.location?.name || t('fetching_location')}
                </Text>
              </View>
              
              {currentPrayer && (
                <View style={styles.currentPrayerContainer}>
                  <Text style={[styles.currentPrayerLabel, { color: theme.colors.textLight }]}>
                    {t('current_prayer')}
                  </Text>
                  <Text style={[styles.currentPrayerName, { color: theme.colors.text }]}>
                    {currentPrayer.name}
                  </Text>
                </View>
              )}
              
              {nextPrayer && (
                <View style={styles.nextPrayerInfo}>
                  <Clock size={18} color={theme.colors.primary} />
                  <Text style={[styles.nextPrayerText, { color: theme.colors.primary }]}>
                    {t('next_prayer')}: {nextPrayer.name} - {nextPrayer.time}
                  </Text>
                </View>
              )}
              
              <View style={styles.prayerList}>
                {todayPrayerTimes.map((prayer, index) => (
                  <PrayerTimeRow
                    key={index}
                    prayer={prayer}
                    isNext={prayer.name === nextPrayer?.name}
                    isCurrent={prayer.name === currentPrayer?.name}
                  />
                ))}
              </View>
            </View>
            
            <Text style={[styles.weeklyTitle, { color: theme.colors.text }]}>
              {t('weekly_schedule')}
            </Text>
            
            <View style={[styles.weeklyContainer, { backgroundColor: theme.colors.card }]}>
              {weeklyPrayerTimes.map((day, index) => (
                <View key={index} style={styles.dayContainer}>
                  <Text style={[styles.dayName, { color: theme.colors.text }]}>
                    {day.dayName}
                  </Text>
                  
                  <View style={styles.dayPrayers}>
                    {day.prayers.map((prayer, prayerIndex) => (
                      <View key={prayerIndex} style={styles.weeklyPrayerItem}>
                        <Text style={[styles.weeklyPrayerName, { color: theme.colors.textLight }]}>
                          {prayer.name}
                        </Text>
                        <Text style={[styles.weeklyPrayerTime, { color: theme.colors.text }]}>
                          {prayer.time}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  todayContainer: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    marginLeft: 6,
  },
  currentPrayerContainer: {
    marginBottom: 16,
  },
  currentPrayerLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  currentPrayerName: {
    fontFamily: 'Roboto-Bold',
    fontSize: 28,
  },
  nextPrayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextPrayerText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  prayerList: {
    marginTop: 8,
  },
  weeklyTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  weeklyContainer: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  dayPrayers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  weeklyPrayerItem: {
    width: '30%',
    marginBottom: 12,
  },
  weeklyPrayerName: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    marginBottom: 2,
  },
  weeklyPrayerTime: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
  },
  settingsContainer: {
    padding: 16,
  },
  settingsTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    marginBottom: 16,
  },
  settingSection: {
    marginBottom: 24,
  },
  settingSectionTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginBottom: 12,
  },
  methodItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  methodText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  prayerName: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    marginLeft: 10,
  },
});