import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface PrayerTimeCardProps {
  name: string;
  time: string;
  isNext?: boolean;
  isCurrent?: boolean;
}

export default function PrayerTimeCard({ name, time, isNext, isCurrent }: PrayerTimeCardProps) {
  const { theme } = useTheme();
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: isCurrent 
            ? theme.colors.primary 
            : isNext 
            ? theme.colors.primaryLight 
            : theme.colors.card 
        }
      ]}
    >
      <Text 
        style={[
          styles.name, 
          { 
            color: isCurrent 
              ? theme.colors.white 
              : theme.colors.text 
          }
        ]}
      >
        {name}
      </Text>
      
      <Text 
        style={[
          styles.time, 
          { 
            color: isCurrent 
              ? theme.colors.white 
              : isNext 
              ? theme.colors.primary 
              : theme.colors.text 
          }
        ]}
      >
        {time}
      </Text>
      
      {(isNext || isCurrent) && (
        <View 
          style={[
            styles.indicator, 
            { 
              backgroundColor: isCurrent 
                ? theme.colors.white 
                : theme.colors.primary 
            }
          ]}
        >
          <Text 
            style={[
              styles.indicatorText, 
              { 
                color: isCurrent 
                  ? theme.colors.primary 
                  : theme.colors.white 
              }
            ]}
          >
            {isCurrent ? 'Now' : 'Next'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  name: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  time: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  indicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    top: -8,
    right: 10,
  },
  indicatorText: {
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
  },
});