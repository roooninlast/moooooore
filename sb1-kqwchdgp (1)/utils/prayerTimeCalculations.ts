import { CalculationMethod, Coordinates, PrayerTimes } from 'adhan';
import { format } from 'date-fns';

// Maps calculation method strings to adhan calculation methods
const getCalculationMethod = (method: string): CalculationMethod => {
  try {
    const methods: Record<string, () => CalculationMethod> = {
      MWL: () => CalculationMethod.MuslimWorldLeague(),
      ISNA: () => CalculationMethod.NorthAmerica(),
      Egypt: () => CalculationMethod.MuslimWorldLeague(), // Always fallback to MWL for Egypt
      Makkah: () => CalculationMethod.UmmAlQura(),
      Karachi: () => CalculationMethod.Karachi(),
      Tehran: () => CalculationMethod.Tehran(),
      Singapore: () => CalculationMethod.Singapore(),
    };

    const selectedMethod = methods[method];
    if (!selectedMethod) {
      console.warn(`Calculation method ${method} not found, using MuslimWorldLeague as default.`);
      return CalculationMethod.MuslimWorldLeague();
    }

    return selectedMethod();
  } catch (error) {
    console.warn(`Error getting calculation method: ${error}. Using MuslimWorldLeague as default.`);
    return CalculationMethod.MuslimWorldLeague();
  }
};

export const getPrayerTimes = (
  latitude: number = 0,
  longitude: number = 0,
  calculationMethod: string = 'MWL',
  adjustments: Record<string, number> = {}
) => {
  try {
    if (!isFinite(latitude) || !isFinite(longitude)) {
      throw new Error('Invalid coordinates');
    }

    // Create coordinates and calculation parameters
    const coordinates = new Coordinates(latitude, longitude);
    const params = getCalculationMethod(calculationMethod);
    
    // Apply adjustments if provided
    if (adjustments) {
      Object.entries(adjustments).forEach(([prayer, adjustment]) => {
        if (params.adjustments && typeof adjustment === 'number') {
          (params.adjustments as any)[prayer] = adjustment;
        }
      });
    }
    
    // Get prayer times for today
    const date = new Date();
    const prayerTimes = new PrayerTimes(coordinates, date, params);
    
    // Format times for display
    const formattedPrayerTimes = [
      { name: 'Fajr', time: format(prayerTimes.fajr, 'h:mm a') },
      { name: 'Sunrise', time: format(prayerTimes.sunrise, 'h:mm a') },
      { name: 'Dhuhr', time: format(prayerTimes.dhuhr, 'h:mm a') },
      { name: 'Asr', time: format(prayerTimes.asr, 'h:mm a') },
      { name: 'Maghrib', time: format(prayerTimes.maghrib, 'h:mm a') },
      { name: 'Isha', time: format(prayerTimes.isha, 'h:mm a') },
    ];
    
    // Determine current and next prayer
    const now = new Date();
    let currentPrayer = null;
    let nextPrayer = null;
    
    const prayerTimesArray = [
      { name: 'Fajr', time: prayerTimes.fajr },
      { name: 'Sunrise', time: prayerTimes.sunrise },
      { name: 'Dhuhr', time: prayerTimes.dhuhr },
      { name: 'Asr', time: prayerTimes.asr },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isha', time: prayerTimes.isha },
    ];
    
    // Find current and next prayer
    if (now < prayerTimesArray[0].time) {
      // Before Fajr
      nextPrayer = {
        name: prayerTimesArray[0].name,
        time: format(prayerTimesArray[0].time, 'h:mm a'),
      };
    } else if (now > prayerTimesArray[prayerTimesArray.length - 1].time) {
      // After Isha (next is tomorrow's Fajr)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowPrayerTimes = new PrayerTimes(coordinates, tomorrow, params);
      
      nextPrayer = {
        name: 'Fajr',
        time: format(tomorrowPrayerTimes.fajr, 'h:mm a'),
      };
      
      currentPrayer = {
        name: 'Isha',
        time: format(prayerTimesArray[prayerTimesArray.length - 1].time, 'h:mm a'),
      };
    } else {
      // During the day
      for (let i = 0; i < prayerTimesArray.length - 1; i++) {
        if (now >= prayerTimesArray[i].time && now < prayerTimesArray[i + 1].time) {
          currentPrayer = {
            name: prayerTimesArray[i].name,
            time: format(prayerTimesArray[i].time, 'h:mm a'),
          };
          
          nextPrayer = {
            name: prayerTimesArray[i + 1].name,
            time: format(prayerTimesArray[i + 1].time, 'h:mm a'),
          };
          
          break;
        }
      }
    }
    
    return {
      prayerTimes: formattedPrayerTimes,
      currentPrayer,
      nextPrayer,
    };
  } catch (error) {
    console.error('Error calculating prayer times:', error);
    return {
      prayerTimes: [],
      currentPrayer: null,
      nextPrayer: null,
    };
  }
};

export const getWeeklyPrayerTimes = (
  latitude: number = 0,
  longitude: number = 0,
  calculationMethod: string = 'MWL',
  adjustments: Record<string, number> = {}
) => {
  try {
    if (!isFinite(latitude) || !isFinite(longitude)) {
      throw new Error('Invalid coordinates');
    }

    const coordinates = new Coordinates(latitude, longitude);
    const params = getCalculationMethod(calculationMethod);
    
    // Apply adjustments if provided
    if (adjustments) {
      Object.entries(adjustments).forEach(([prayer, adjustment]) => {
        if (params.adjustments && typeof adjustment === 'number') {
          (params.adjustments as any)[prayer] = adjustment;
        }
      });
    }
    
    const weeklySchedule = [];
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Generate prayer times for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      try {
        const prayerTimes = new PrayerTimes(coordinates, date, params);
        
        weeklySchedule.push({
          date: format(date, 'yyyy-MM-dd'),
          dayName: dayNames[date.getDay()],
          prayers: [
            { name: 'Fajr', time: format(prayerTimes.fajr, 'h:mm a') },
            { name: 'Dhuhr', time: format(prayerTimes.dhuhr, 'h:mm a') },
            { name: 'Asr', time: format(prayerTimes.asr, 'h:mm a') },
            { name: 'Maghrib', time: format(prayerTimes.maghrib, 'h:mm a') },
            { name: 'Isha', time: format(prayerTimes.isha, 'h:mm a') },
          ],
        });
      } catch (error) {
        console.warn(`Error calculating prayer times for ${format(date, 'yyyy-MM-dd')}:`, error);
      }
    }
    
    return weeklySchedule;
  } catch (error) {
    console.error('Error calculating weekly prayer times:', error);
    return [];
  }
};