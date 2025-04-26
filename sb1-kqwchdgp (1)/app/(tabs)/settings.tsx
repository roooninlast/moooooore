import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/hooks/useTranslation';
import ScreenContainer from '@/components/layout/ScreenContainer';
import ScreenHeader from '@/components/common/ScreenHeader';
import { Moon, Sun, Globe as Globe2, BookOpen } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();

  const toggleLanguage = () => {
    updateSettings({
      ...settings,
      language: settings.language === 'en' ? 'ar' : 'en',
    });
  };

  return (
    <ScreenContainer>
      <ScreenHeader title={t('settings')} />
      <ScrollView style={styles.container}>
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('appearance')}
          </Text>
          
          <TouchableOpacity
            style={styles.option}
            onPress={toggleTheme}
          >
            <View style={styles.optionContent}>
              {isDark ? (
                <Moon size={24} color={theme.colors.text} />
              ) : (
                <Sun size={24} color={theme.colors.text} />
              )}
              <Text style={[styles.optionText, { color: theme.colors.text }]}>
                {isDark ? t('dark_mode') : t('light_mode')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('language')}
          </Text>
          
          <TouchableOpacity
            style={styles.option}
            onPress={toggleLanguage}
          >
            <View style={styles.optionContent}>
              <Globe2 size={24} color={theme.colors.text} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>
                {settings.language === 'en' ? 'English' : 'العربية'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('adkar')}
          </Text>
          
          <TouchableOpacity
            style={styles.option}
            onPress={() => {}}
          >
            <View style={styles.optionContent}>
              <BookOpen size={24} color={theme.colors.text} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>
                {t('morning_evening_adhkar')}
              </Text>
            </View>
          </TouchableOpacity>
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
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    marginBottom: 16,
  },
  option: {
    paddingVertical: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
});