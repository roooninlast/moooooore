import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import ScreenContainer from '@/components/layout/ScreenContainer';
import ScreenHeader from '@/components/common/ScreenHeader';
import {
  BookHeart,
  Share2,
  Heart,
  Sun,
  Moon,
  HandHelping as PrayingHands,
  Coffee,
  BedDouble,
  Sparkles,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AdhkarItem = {
  id: string;
  arabic: string;
  translation: string;
  repetitions: number;
  source: string;
};

type AdhkarCategory = {
  id: string;
  title: string;
  icon: React.ReactNode;
  adhkar: AdhkarItem[];
};

const ADHKAR_CATEGORIES: AdhkarCategory[] = [
  {
    id: 'morning',
    title: 'Morning Adhkar',
    icon: <Sun size={20} />,
    adhkar: [
      {
        id: 'm1',
        arabic:
          'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَعَلَى كَلِمَةِ الْإِخْلَاصِ',
        translation:
          'We have reached the morning upon the fitrah of Islam and upon the word of sincerity.',
        repetitions: 1,
        source: 'Hisnul Muslim',
      },
      {
        id: 'm2',
        arabic:
          'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ',
        translation:
          'We have reached the morning and at this very time all sovereignty belongs to Allah, and all praise is for Allah; there is no god but Allah.',
        repetitions: 1,
        source: 'Muslim',
      },
      {
        id: 'm3',
        arabic:
          'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا',
        translation:
          'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening and by Your leave we live.',
        repetitions: 1,
        source: 'Bukhari',
      },
      {
        id: 'm4',
        arabic:
          'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ',
        translation:
          'O Allah, whatever blessing has been received by me this morning is from You alone, without partner.',
        repetitions: 1,
        source: 'Tirmidhi',
      },
      {
        id: 'm5',
        arabic:
          'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
        translation:
          'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.',
        repetitions: 1,
        source: 'Ahmad',
      },
      {
        id: 'm6',
        arabic:
          'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        translation:
          'All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.',
        repetitions: 1,
        source: 'Bukhari',
      },
      {
        id: 'm7',
        arabic:
          'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
        translation:
          'Glory be to Allah and praise be to Him; Glory be to Allah the Magnificent.',
        repetitions: 100,
        source: 'Muslim',
      },
      {
        id: 'm8',
        arabic:
          'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
        translation:
          'I seek forgiveness from Allah and turn to Him in repentance.',
        repetitions: 3,
        source: 'Abu Dawud',
      },
      {
        id: 'm9',
        arabic:
          'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        translation:
          'There is no god but Allah alone; He has no partner.',
        repetitions: 10,
        source: 'Apostle ﷺ (collected)',
      },
      {
        id: 'm10',
        arabic:
          'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا',
        translation:
          'O Allah, I ask You for beneficial knowledge.',
        repetitions: 1,
        source: 'Tirmidhi',
      },
    ],
  },
  {
    id: 'evening',
    title: 'Evening Adhkar',
    icon: <Moon size={20} />,
    adhkar: [
      {
        id: 'e1',
        arabic:
          'أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَعَلَى كَلِمَةِ الْإِخْلَاصِ',
        translation:
          'We have reached the evening upon the fitrah of Islam and upon the word of sincerity.',
        repetitions: 1,
        source: 'Hisnul Muslim',
      },
      {
        id: 'e2',
        arabic:
          'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
        translation:
          'We have reached the evening and at this very time all sovereignty belongs to Allah, and all praise is for Allah.',
        repetitions: 1,
        source: 'Muslim',
      },
      {
        id: 'e3',
        arabic:
          'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا',
        translation:
          'O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning and by Your leave we live.',
        repetitions: 1,
        source: 'Bukhari',
      },
      {
        id: 'e4',
        arabic:
          'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ',
        translation:
          'O Allah, whatever blessing has been received by me this evening is from You alone, without partner.',
        repetitions: 1,
        source: 'Tirmidhi',
      },
      {
        id: 'e5',
        arabic:
          'رَضِيتُ بِاللَّهِ رَبًّا وَبِالإِسْلَامِ دِينًا',
        translation:
          'I am pleased with Allah as my Lord and with Islam as my religion.',
        repetitions: 1,
        source: 'Ahmad',
      },
      {
        id: 'e6',
        arabic:
          'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        translation:
          'Glory be to Allah and praise be to Him.',
        repetitions: 100,
        source: 'Muslim',
      },
      {
        id: 'e7',
        arabic:
          'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
        translation:
          'I seek forgiveness from Allah and turn to Him in repentance.',
        repetitions: 3,
        source: 'Abu Dawud',
      },
      {
        id: 'e8',
        arabic:
          'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        translation:
          'There is no god but Allah alone; He has no partner.',
        repetitions: 10,
        source: 'Apostle ﷺ (collected)',
      },
      {
        id: 'e9',
        arabic:
          'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي',
        translation:
          'O Allah, I seek refuge in You from the evil of my own soul.',
        repetitions: 1,
        source: 'Bukhari',
      },
      {
        id: 'e10',
        arabic:
          'اللَّهُمَّ أَصْبِحْنَا عَلَى أَمَانِيِكَ',
        translation:
          'O Allah, let us reach the morning in Your security.',
        repetitions: 1,
        source: 'Ibn Majah',
      },
    ],
  },
  {
    id: 'after-prayer',
    title: 'After Prayer',
    icon: <PrayingHands size={20} />,
    adhkar: [
      {
        id: 'p1',
        arabic:
          'أَسْتَغْفِرُ اللَّهَ',
        translation:
          'I seek forgiveness of Allah.',
        repetitions: 3,
        source: 'Bukhari',
      },
      {
        id: 'p2',
        arabic:
          'لَا إِلَهَ إِلَّا اللَّهُ',
        translation:
          'There is no god but Allah.',
        repetitions: 1,
        source: 'Muslim',
      },
      {
        id: 'p3',
        arabic:
          'سُبْحَانَ اللَّهِ',
        translation:
          'Glory be to Allah.',
        repetitions: 33,
        source: 'Bukhari',
      },
      {
        id: 'p4',
        arabic:
          'الْحَمْدُ لِلَّهِ',
        translation:
          'All praise is for Allah.',
        repetitions: 33,
        source: 'Bukhari',
      },
      {
        id: 'p5',
        arabic:
          'اللَّهُ أَكْبَرُ',
        translation:
          'Allah is the Greatest.',
        repetitions: 34,
        source: 'Bukhari',
      },
      {
        id: 'p6',
        arabic:
          'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
        translation:
          'Sufficient for us is Allah, and He is the best Disposer of affairs.',
        repetitions: 7,
        source: 'Tirmidhi',
      },
      {
        id: 'p7',
        arabic:
          'اللَّهُمَّ اهْدِنِي وَثَبِّتْنِي',
        translation:
          'O Allah, guide me and keep me steadfast.',
        repetitions: 1,
        source: 'Muslim',
      },
      {
        id: 'p8',
        arabic:
          'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ العَلِيمُ',
        translation:
          'Our Lord, accept from us; indeed You are the Hearing, the Knowing.',
        repetitions: 1,
        source: 'Quran 2:127',
      },
    ],
  },
  {
    id: 'before-sleep',
    title: 'Before Sleep',
    icon: <BedDouble size={20} />,
    adhkar: [
      {
        id: 's1',
        arabic:
          'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        translation:
          'In Your name, O Allah, I die and I live.',
        repetitions: 1,
        source: 'Bukhari',
      },
      {
        id: 's2',
        arabic:
          'اللَّهُمَّ بِاسْمِكَ وَضَعْتُ جَنْبِي',
        translation:
          'O Allah, in Your name I lay down my side.',
        repetitions: 1,
        source: 'Muslim',
      },
      {
        id: 's3',
        arabic:
          'سُبْحَانَ اللَّهِ',
        translation:
          'Glory be to Allah.',
        repetitions: 33,
        source: 'Bukhari',
      },
      {
        id: 's4',
        arabic:
          'الْحَمْدُ لِلَّهِ',
        translation:
          'All praise is for Allah.',
        repetitions: 33,
        source: 'Bukhari',
      },
      {
        id: 's5',
        arabic:
          'اللَّهُ أَكْبَرُ',
        translation:
          'Allah is the Greatest.',
        repetitions: 34,
        source: 'Bukhari',
      },
      {
        id: 's6',
        arabic:
          'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ',
        translation:
          'I take refuge in the perfect words of Allah.',
        repetitions: 3,
        source: 'Muslim',
      },
      {
        id: 's7',
        arabic:
          'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        translation:
          'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
        repetitions: 1,
        source: 'Tirmidhi',
      },
      {
        id: 's8',
        arabic:
          'اللَّهُمَّ أَنْتَ خَالِقِي وَأَنْتَ رَبِّي',
        translation:
          'O Allah, You are my Creator and You are my Lord.',
        repetitions: 1,
        source: 'Ahmad',
      },
      {
        id: 's9',
        arabic:
          'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي',
        translation:
          'O Allah, forgive me and have mercy on me.',
        repetitions: 1,
        source: 'Bukhari',
      },
      {
        id: 's10',
        arabic:
          'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبْثِ وَالْخَبَائِثِ',
        translation:
          'O Allah, I seek refuge in You from male and female devils.',
        repetitions: 1,
        source: 'Muslim',
      },
    ],
  },
  {
    id: 'waking',
    title: 'Upon Waking',
    icon: <Coffee size={20} />,
    adhkar: [
      {
        id: 'w1',
        arabic:
          'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا',
        translation:
          'All praise is for Allah who gave us life.',
        repetitions: 1,
        source: 'Bukhari',
      },
      {
        id: 'w2',
        arabic:
          'أَصْبَحْتُ أُشْهِدُكَ',
        translation:
          'I have reached the morning calling You to witness.',
        repetitions: 4,
        source: 'Muslim',
      },
      {
        id: 'w3',
        arabic:
          'رَضِيتُ بِاللَّهِ رَبًّا',
        translation:
          'I am pleased with Allah as my Lord.',
        repetitions: 1,
        source: 'Tirmidhi',
      },
    ],
  },
  {
    id: 'general',
    title: 'General Adhkar',
    icon: <Sparkles size={20} />,
    adhkar: [
      {
        id: 'g1',
        arabic:
          'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        translation:
          'Glory be to Allah and praise be to Him.',
        repetitions: 100,
        source: 'Muslim',
      },  
      {
        id: 'g2',
        arabic:
          'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        translation:
          'There is no power and no strength except with Allah.',
        repetitions: 1,
        source: 'Bukhari',
      },
    ],
  },
];

export default function AdhkarScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        if (stored) setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    })();
  }, []);

  const toggleFavorite = async (id: string) => {
    try {
      const updated = favorites.includes(id)
        ? favorites.filter(f => f !== id)
        : [...favorites, id];
      setFavorites(updated);
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving favorite:', e);
    }
  };

  const shareAdhkar = (item: AdhkarItem) => {
    Share.share({
      message: `${item.arabic}\n\n${item.translation}\n\nSource: ${item.source}`,
    });
  };

  const renderAdhkar = () => {
    const cat = ADHKAR_CATEGORIES.find(c => c.id === selectedCategory);
    if (!cat) return null;
    return cat.adhkar.map(item => (
      <View
        key={item.id}
        style={[styles.card, { backgroundColor: theme.colors.card }]}
      >
        <View style={styles.header}>
          <Text style={[styles.arabic, { color: theme.colors.text }]}>
            {item.arabic}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Heart
                size={20}
                fill={favorites.includes(item.id) ? theme.colors.primary : 'none'}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => shareAdhkar(item)}
              style={{ marginLeft: 8 }}
            >
              <Share2 size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.translation, { color: theme.colors.text }]}>
          {item.translation}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.reps, { color: theme.colors.primary }]}>
            Repeat {item.repetitions}
          </Text>
          <Text style={[styles.source, { color: theme.colors.textLight }]}>
            Source: {item.source}
          </Text>
        </View>
      </View>
    ));
  };

  return (
    <ScreenContainer>
      <ScreenHeader title={t('adhkar')} />
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
          contentContainerStyle={styles.tabsContent}
        >
          {ADHKAR_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    selectedCategory === cat.id
                      ? theme.colors.primary
                      : theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              {React.cloneElement(cat.icon as React.ReactElement, {
                color:
                  selectedCategory === cat.id
                    ? theme.colors.white
                    : theme.colors.text,
                size: 20,
              })}
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      selectedCategory === cat.id
                        ? theme.colors.white
                        : theme.colors.text,
                  },
                ]}
              >
                {cat.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {selectedCategory ? (
            renderAdhkar()
          ) : (
            <View style={styles.placeholder}>
              <BookHeart size={64} color={theme.colors.primary} />
              <Text style={[styles.placeholderText, { color: theme.colors.textLight }]}>
                Select a category
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: {
    maxHeight: 90,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tabsContent: { padding: 16, paddingBottom: 20 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingTop: 8 },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  placeholderText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginTop: 24,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  arabic: {
    fontSize: 26,
    fontFamily: 'ScheherazadeNew-Regular',
    textAlign: 'right',
    flex: 1,
    lineHeight: 40,
  },
  actions: { flexDirection: 'row', marginLeft: 12 },
  translation: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
    fontFamily: 'Roboto-Regular',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  reps: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
  },
  source: {
    fontFamily: 'Roboto-Italic',
    fontSize: 12,
  },
});
