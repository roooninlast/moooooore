import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { useSettings } from '@/hooks/useSettings';

type LocationContextType = {
  location: {
    latitude: number;
    longitude: number;
    name?: string;
  } | null;
  loading: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
};

const LocationContext = createContext<LocationContextType>({
  location: null,
  loading: true,
  error: null,
  refreshLocation: async () => {},
});

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    name?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings, updateSettings } = useSettings();
  
  const getLocationName = async (latitude: number, longitude: number) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (reverseGeocode && reverseGeocode.length > 0) {
        const { city, region, country } = reverseGeocode[0];
        return city 
          ? `${city}, ${country}` 
          : region 
          ? `${region}, ${country}` 
          : country;
      }
      return null;
    } catch (error) {
      console.error('Error getting location name:', error);
      return null;
    }
  };
  
  const refreshLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we should use auto-location or use saved location
      if (settings.useAutoLocation) {
        // Get the current location
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setLoading(false);
          return;
        }
        
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        const { latitude, longitude } = position.coords;
        const name = await getLocationName(latitude, longitude);
        
        const locationData = { latitude, longitude, name: name || 'Current Location' };
        setLocation(locationData);
        
        // Save location to settings
        updateSettings({ 
          location: locationData
        });
      } else if (settings.location) {
        // Use saved location from settings
        setLocation(settings.location);
      } else {
        // Default location if none is available (Mecca)
        const defaultLocation = {
          latitude: 21.422487,
          longitude: 39.826206,
          name: 'Mecca, Saudi Arabia',
        };
        setLocation(defaultLocation);
        updateSettings({ location: defaultLocation });
      }
    } catch (error) {
      setError('Could not get location. Please try again.');
      console.error('Error getting location:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial location fetch
  useEffect(() => {
    refreshLocation();
  }, [settings.useAutoLocation]);
  
  return (
    <LocationContext.Provider value={{ location, loading, error, refreshLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);