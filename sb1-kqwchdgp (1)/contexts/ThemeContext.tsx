import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useSettings } from '@/hooks/useSettings';

// Define theme colors
const lightTheme = {
  colors: {
    primary: '#0A5F38',
    primaryLight: '#E6F2ED',
    secondary: '#D4AF37',
    secondaryLight: '#F9F3E0',
    accent: '#9C27B0',
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textLight: '#757575',
    border: '#E0E0E0',
    notification: '#FF9500',
    error: '#FF3B30',
    warning: '#FF9500',
    success: '#34C759',
    white: '#FFFFFF',
    black: '#000000',
  },
};

const darkTheme = {
  colors: {
    primary: '#2F9E6F',
    primaryLight: '#1A3D30',
    secondary: '#E6C55A',
    secondaryLight: '#3C3523',
    accent: '#BB86FC',
    background: '#121212',
    card: '#1E1E1E',
    text: '#F5F5F5',
    textLight: '#AAAAAA',
    border: '#333333',
    notification: '#FF9F0A',
    error: '#FF453A',
    warning: '#FF9F0A',
    success: '#30D158',
    white: '#FFFFFF',
    black: '#000000',
  },
};

type ThemeType = {
  colors: {
    primary: string;
    primaryLight: string;
    secondary: string;
    secondaryLight: string;
    accent: string;
    background: string;
    card: string;
    text: string;
    textLight: string;
    border: string;
    notification: string;
    error: string;
    warning: string;
    success: string;
    white: string;
    black: string;
  };
};

type ThemeContextType = {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  const [theme, setTheme] = useState<ThemeType>(isDark ? darkTheme : lightTheme);
  const { settings } = useSettings();
  
  // Update theme based on system preference or user setting
  useEffect(() => {
    if (settings?.themeMode === 'system') {
      setIsDark(colorScheme === 'dark');
    } else if (settings?.themeMode === 'dark') {
      setIsDark(true);
    } else if (settings?.themeMode === 'light') {
      setIsDark(false);
    }
  }, [colorScheme, settings?.themeMode]);
  
  // Update theme object when isDark changes
  useEffect(() => {
    setTheme(isDark ? darkTheme : lightTheme);
  }, [isDark]);
  
  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);