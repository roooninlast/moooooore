import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface PrayerTimeRowProps {
  prayer: {
    name: string;
    time: string;
    isNext?: boolean;
  };
  isNext?: boolean;
  isCurrent?: boolean;
}

export default function PrayerTimeRow({ prayer, isNext, isCurrent }: PrayerTimeRowProps) {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.prayerName, { color: theme.colors.text }]}>
          {prayer.name}
        </Text>
        
        {(isNext || isCurrent) && (
          <View 
            style={[
              styles.statusIndicator, 
              { 
                backgroundColor: isCurrent 
                  ? theme.colors.primary 
                  : theme.colors.secondary 
              }
            ]}
          >
            <Text style={[styles.statusText, { color: theme.colors.white }]}>
              {isCurrent ? 'Current' : 'Next'}
            </Text>
          </View>
        )}
      </View>
      
      <Text 
        style={[
          styles.prayerTime, 
          { 
            color: isCurrent 
              ? theme.colors.primary 
              : isNext 
              ? theme.colors.secondary 
              : theme.colors.text 
          },
          (isCurrent || isNext) && styles.highlightedTime
        ]}
      >
        {prayer.time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  prayerName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  prayerTime: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  highlightedTime: {
    fontFamily: 'Roboto-Bold',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
  },
});