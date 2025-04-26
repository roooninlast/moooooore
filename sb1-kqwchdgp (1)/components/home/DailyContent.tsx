import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { BookOpen, Share2 } from 'lucide-react-native';
import { useDailyContent } from '@/hooks/useDailyContent';

export default function DailyContent() {
  const { theme } = useTheme();
  const { dailyVerse, dailyHadith } = useDailyContent();
  
  const shareContent = async (content: string, source: string) => {
    try {
      await Share.share({
        message: `${content}\n\n${source}`,
      });
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      {dailyVerse && (
        <View style={[styles.contentCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
              <BookOpen size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>
              Daily Quranic Verse
            </Text>
          </View>
          
          <Text style={[styles.arabicText, { color: theme.colors.text }]}>
            {dailyVerse.arabic}
          </Text>
          
          <Text style={[styles.translationText, { color: theme.colors.text }]}>
            {dailyVerse.translation}
          </Text>
          
          <Text style={[styles.sourceText, { color: theme.colors.textLight }]}>
            {dailyVerse.source}
          </Text>
          
          <TouchableOpacity 
            style={styles.shareButton} 
            onPress={() => shareContent(
              `${dailyVerse.arabic}\n\n${dailyVerse.translation}`, 
              dailyVerse.source
            )}
          >
            <Share2 size={16} color={theme.colors.primary} />
            <Text style={[styles.shareText, { color: theme.colors.primary }]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {dailyHadith && (
        <View style={[styles.contentCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
              <BookOpen size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>
              Daily Hadith
            </Text>
          </View>
          
          <Text style={[styles.hadithText, { color: theme.colors.text }]}>
            {dailyHadith.text}
          </Text>
          
          <Text style={[styles.narratorText, { color: theme.colors.textLight }]}>
            Narrator: {dailyHadith.narrator}
          </Text>
          
          <Text style={[styles.sourceText, { color: theme.colors.textLight }]}>
            {dailyHadith.source}
          </Text>
          
          <TouchableOpacity 
            style={styles.shareButton} 
            onPress={() => shareContent(
              dailyHadith.text, 
              `${dailyHadith.narrator} - ${dailyHadith.source}`
            )}
          >
            <Share2 size={16} color={theme.colors.primary} />
            <Text style={[styles.shareText, { color: theme.colors.primary }]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  contentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  arabicText: {
    fontFamily: 'ScheherazadeNew-Regular',
    fontSize: 22,
    textAlign: 'right',
    marginBottom: 12,
    lineHeight: 36,
  },
  translationText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
  },
  hadithText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
  },
  narratorText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    marginBottom: 4,
  },
  sourceText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    marginBottom: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 8,
  },
  shareText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    marginLeft: 6,
  },
});