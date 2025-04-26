import { useState, useEffect } from 'react';

// Mock data for daily content
const quranVerses = [
  {
    id: 1,
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    translation: 'Indeed, actions are judged by intentions, and for every person is what he intended.',
    source: 'Surah Al-Baqarah, 2:155'
  },
  {
    id: 2,
    arabic: 'وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ وَبَشِّرِ الصَّابِرِينَ',
    translation: 'And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient.',
    source: 'Surah Al-Baqarah, 2:155'
  }
];

const hadiths = [
  {
    id: 1,
    text: 'The best among you are those who have the best manners and character.',
    narrator: 'Bukhari',
    source: 'Sahih Bukhari, Volume 8, Book, Number 73, Number 56'
  },
  {
    id: 2,
    text: 'None of you truly believes until he loves for his brother what he loves for himself.',
    narrator: 'Bukhari and Muslim',
    source: 'Forty Hadith, Number 13'
  }
];

export const useDailyContent = () => {
  const [dailyVerse, setDailyVerse] = useState(null);
  const [dailyHadith, setDailyHadith] = useState(null);
  
  useEffect(() => {
    // Select a random verse and hadith for the day
    // In a real app, this could be based on the current date
    // or fetched from an API
    const randomVerseIndex = Math.floor(Math.random() * quranVerses.length);
    const randomHadithIndex = Math.floor(Math.random() * hadiths.length);
    
    setDailyVerse(quranVerses[randomVerseIndex]);
    setDailyHadith(hadiths[randomHadithIndex]);
  }, []);
  
  return {
    dailyVerse,
    dailyHadith,
  };
};