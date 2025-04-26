import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightIcon?: ReactNode;
}

export default function ScreenHeader({ 
  title, 
  showBackButton = false, 
  rightIcon 
}: ScreenHeaderProps) {
  const { theme } = useTheme();
  const router = useRouter();
  
  return (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {title}
      </Text>
      
      <View style={styles.rightContainer}>
        {rightIcon}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
});