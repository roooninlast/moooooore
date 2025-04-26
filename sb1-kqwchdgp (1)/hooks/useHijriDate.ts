import { useState, useEffect } from 'react';
import { convertToHijri } from '@/utils/dateConverters';

export const useHijriDate = () => {
  const [hijriDate, setHijriDate] = useState(null);
  const [formattedHijriDate, setFormattedHijriDate] = useState('');
  
  useEffect(() => {
    const today = new Date();
    const hijri = convertToHijri(today);
    setHijriDate(hijri);
    
    // Format the Hijri date
    const monthNames = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ];
    
    const formattedDate = `${hijri.day} ${monthNames[hijri.month - 1]} ${hijri.year} AH`;
    setFormattedHijriDate(formattedDate);
  }, []);
  
  return {
    hijriDate,
    formattedHijriDate,
  };
};