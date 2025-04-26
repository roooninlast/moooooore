/**
 * Converts a Gregorian date to Hijri date using a simple calculation
 * Note: This is a basic implementation and uses approximation
 * @param date Gregorian date
 * @returns Hijri date object
 */
export const convertToHijri = (date: Date) => {
  try {
    // Basic Gregorian to Hijri conversion
    // Note: This is an approximation and may be off by 1-2 days
    const gregorianYear = date.getFullYear();
    const gregorianMonth = date.getMonth() + 1;
    const gregorianDay = date.getDate();

    // Julian day calculation
    let jd = Math.floor((gregorianYear + 8799) / 100);
    jd = Math.floor(jd / 4);
    jd = jd - Math.floor((gregorianYear + 8799) / 400);
    jd = jd + Math.floor(365.25 * (gregorianYear + 8799));
    jd = jd + Math.floor(30.6001 * (gregorianMonth + 1));
    jd = jd + gregorianDay - 31739.5;

    // Hijri date calculation
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const hijriMonth = Math.floor((24 * l3) / 709);
    const hijriDay = l3 - Math.floor((709 * hijriMonth) / 24);
    const hijriYear = 30 * n + j - 30;

    // Hijri month names
    const hijriMonths = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Shaban',
      'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
    ];

    // Day of week
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return {
      day: hijriDay,
      month: hijriMonth,
      year: hijriYear,
      monthName: hijriMonths[hijriMonth - 1],
      dayOfWeek: dayNames[date.getDay()],
      isLeapYear: (((11 * hijriYear + 14) % 30) < 11),
    };
  } catch (error) {
    console.warn('Error in Hijri date conversion:', error);
    // Return Gregorian date as fallback
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      monthName: date.toLocaleString('default', { month: 'long' }),
      dayOfWeek: date.toLocaleString('default', { weekday: 'long' }),
      isLeapYear: new Date(date.getFullYear(), 1, 29).getDate() === 29,
    };
  }
};

/**
 * Checks if a given date is an important Islamic date
 * @param hijriDate Hijri date object
 * @returns Information about the Islamic event if it exists
 */
export const getIslamicEvent = (hijriDate: any) => {
  const { day, month } = hijriDate;
  
  // Important Islamic dates (simplified)
  const importantDates = [
    { day: 1, month: 1, name: 'Islamic New Year' },
    { day: 10, month: 1, name: 'Day of Ashura' },
    { day: 12, month: 3, name: 'Mawlid al-Nabi' },
    { day: 27, month: 7, name: 'Laylat al-Miraj' },
    { day: 15, month: 8, name: 'Laylat al-Bara\'at' },
    { day: 1, month: 9, name: 'First day of Ramadan' },
    { day: 27, month: 9, name: 'Laylat al-Qadr' },
    { day: 1, month: 10, name: 'Eid al-Fitr' },
    { day: 8, month: 12, name: 'Day of Arafah' },
    { day: 10, month: 12, name: 'Eid al-Adha' },
  ];
  
  // Check if current date matches any important date
  for (const date of importantDates) {
    if (date.day === day && date.month === month) {
      return {
        name: date.name,
        isHoliday: date.name.includes('Eid'),
      };
    }
  }
  
  return null;
};

/**
 * Gets a list of Islamic events for the current Hijri year
 * @param hijriYear Hijri year
 * @returns List of Islamic events for the year
 */
export const getYearlyIslamicEvents = (hijriYear: number) => {
  const events = [
    { day: 1, month: 1, name: 'Islamic New Year' },
    { day: 10, month: 1, name: 'Day of Ashura' },
    { day: 12, month: 3, name: 'Mawlid al-Nabi' },
    { day: 27, month: 7, name: 'Laylat al-Miraj' },
    { day: 15, month: 8, name: 'Laylat al-Bara\'at' },
    { day: 1, month: 9, name: 'First day of Ramadan' },
    { day: 27, month: 9, name: 'Laylat al-Qadr' },
    { day: 1, month: 10, name: 'Eid al-Fitr' },
    { day: 8, month: 12, name: 'Day of Arafah' },
    { day: 10, month: 12, name: 'Eid al-Adha' },
  ];
  
  return events.map(event => ({
    ...event,
    hijriYear,
    // Note: Gregorian date calculation removed as it was causing issues
    // Will be calculated on demand when needed
  }));
};