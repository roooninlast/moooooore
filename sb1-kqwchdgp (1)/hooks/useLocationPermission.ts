import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

export const useLocationPermission = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  
  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }, []);
  
  return {
    hasLocationPermission,
    requestLocationPermission,
  };
};