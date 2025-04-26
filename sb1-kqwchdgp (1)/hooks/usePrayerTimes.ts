import { useState, useEffect } from 'react';
import { getPrayerTimes, getWeeklyPrayerTimes } from '@/utils/prayerTimeCalculations';
import { useSettingsContext } from '@/contexts/SettingsContext';

export const usePrayerTimes = () => {
  const [todayPrayerTimes, setTodayPrayerTimes] = useState<any[]>([]);
  const [weeklyPrayerTimes, setWeeklyPrayerTimes] = useState<any[]>([]);
  const [currentPrayer, setCurrentPrayer] = useState<any>(null);
  const [nextPrayer, setNextPrayer] = useState<any>(null);
  
  const { settings } = useSettingsContext();
  
  useEffect(() => {
    if (!settings.location) {
      return;
    }

    try {
      const { latitude, longitude } = settings.location;
      const prayers = getPrayerTimes(
        latitude,
        longitude,
        settings.calculationMethod,
        settings.adjustments
      );
      
      setTodayPrayerTimes(prayers.prayerTimes);
      setCurrentPrayer(prayers.currentPrayer);
      setNextPrayer(prayers.nextPrayer);
      
      const weekly = getWeeklyPrayerTimes(
        latitude,
        longitude,
        settings.calculationMethod,
        settings.adjustments
      );
      setWeeklyPrayerTimes(weekly);
    } catch (error) {
      console.error('Error in usePrayerTimes hook:', error);
      setTodayPrayerTimes([]);
      setWeeklyPrayerTimes([]);
      setCurrentPrayer(null);
      setNextPrayer(null);
    }
  }, [settings.location, settings.calculationMethod, settings.adjustments]);
  
  return {
    todayPrayerTimes,
    weeklyPrayerTimes,
    currentPrayer,
    nextPrayer,
  };
};