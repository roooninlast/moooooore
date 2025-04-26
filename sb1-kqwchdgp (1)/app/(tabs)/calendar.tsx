import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import ScreenContainer from '@/components/layout/ScreenContainer';
import ScreenHeader from '@/components/common/ScreenHeader';
import { convertToHijri } from '@/utils/dateConverters';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

export default function CalendarScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const hijriDate = convertToHijri(selectedDate);

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(current => 
      direction === 'prev' ? subDays(current, 1) : addDays(current, 1)
    );
  };

  return (
    <ScreenContainer>
      <ScreenHeader title={t('islamic_calendar')} />
      <ScrollView style={styles.container}>
        <View style={[styles.calendarCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.dateNavigation}>
            <TouchableOpacity 
              onPress={() => navigateDate('prev')}
              style={[styles.navButton, { backgroundColor: theme.colors.primaryLight }]}
            >
              <ChevronLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            
            <View style={styles.dateInfo}>
              <Text style={[styles.gregorianDate, { color: theme.colors.text }]}>
                {format(selectedDate, 'MMMM d, yyyy')}
              </Text>
              <Text style={[styles.hijriDate, { color: theme.colors.primary }]}>
                {`${hijriDate.day} ${hijriDate.monthName} ${hijriDate.year} AH`}
              </Text>
            </View>
            
            <TouchableOpacity 
              onPress={() => navigateDate('next')}
              style={[styles.navButton, { backgroundColor: theme.colors.primaryLight }]}
            >
              <ChevronRight size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  calendarCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateInfo: {
    alignItems: 'center',
  },
  gregorianDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    marginBottom: 4,
  },
  hijriDate: {
    fontFamily: 'ScheherazadeNew-Regular',
    fontSize: 20,
  },
});