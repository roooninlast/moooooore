import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { useLocation } from '@/contexts/LocationContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/contexts/ThemeContext';
import ScreenContainer from '@/components/layout/ScreenContainer';
import ScreenHeader from '@/components/common/ScreenHeader';
import { CircleAlert as AlertCircle, Compass, Navigation, RotateCw } from 'lucide-react-native';
import { calculateQiblaDirection } from '@/utils/qiblaCalculations';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function QiblaScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { location } = useLocation();
  const [subscription, setSubscription] = useState(null);
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const [heading, setHeading] = useState(0);
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [accuracy, setAccuracy] = useState('unknown');
  
  const needleRotation = useSharedValue(0);
  const compassRotation = useSharedValue(0);
  
  // Calculate qibla direction when location changes
  useEffect(() => {
    if (location) {
      const angle = calculateQiblaDirection(location.latitude, location.longitude);
      setQiblaAngle(angle);
    }
  }, [location]);
  
  // Handle magnetometer subscription - only on native platforms
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web fallback - simulate compass rotation
      const interval = setInterval(() => {
        const newHeading = (heading + 1) % 360;
        setHeading(newHeading);
        
        const compassAngle = 360 - newHeading;
        compassRotation.value = withSpring(compassAngle, { 
          stiffness: 90,
          damping: 20
        });
        
        const needleAngle = (qiblaAngle - newHeading + 360) % 360;
        needleRotation.value = withSpring(needleAngle, { 
          stiffness: 90,
          damping: 20
        });
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      const subscribe = async () => {
        Magnetometer.setUpdateInterval(100);
        const subscriber = Magnetometer.addListener(data => {
          setMagnetometerData(data);
          
          // Calculate heading from magnetometer data
          const angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
          const normalizedAngle = (angle + 360) % 360;
          setHeading(normalizedAngle);
          
          // Determine accuracy
          const fieldStrength = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
          if (fieldStrength < 10) {
            setAccuracy('low');
          } else if (fieldStrength < 25) {
            setAccuracy('medium');
          } else {
            setAccuracy('high');
          }

          // Update rotations
          const compassAngle = 360 - normalizedAngle;
          compassRotation.value = withSpring(compassAngle, { 
            stiffness: 90,
            damping: 20
          });
          
          const needleAngle = (qiblaAngle - normalizedAngle + 360) % 360;
          needleRotation.value = withSpring(needleAngle, { 
            stiffness: 90,
            damping: 20
          });
          
          // Trigger haptic feedback when aligned with Qibla
          if (Math.abs(needleAngle - 0) < 5 || Math.abs(needleAngle - 360) < 5) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        });
        
        setSubscription(subscriber);
      };
      
      subscribe();
      
      return () => {
        subscription && subscription.remove();
      };
    }
  }, [qiblaAngle, heading]);
  
  const calibrateCompass = () => {
    setIsCalibrating(true);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Simulating calibration process
    setTimeout(() => {
      setIsCalibrating(false);
    }, 3000);
  };
  
  const needleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${needleRotation.value}deg` }],
    };
  });
  
  const compassStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${compassRotation.value}deg` }],
    };
  });
  
  return (
    <ScreenContainer>
      <ScreenHeader title={t('qibla_compass')} />
      
      <View style={styles.container}>
        {!location ? (
          <View style={styles.noLocationContainer}>
            <AlertCircle size={50} color={theme.colors.error} />
            <Text style={[styles.noLocationText, { color: theme.colors.text }]}>
              {t('location_required')}
            </Text>
            <Text style={[styles.noLocationSubtext, { color: theme.colors.textLight }]}>
              {t('enable_location_services')}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.compassContainer}>
              <Animated.View style={[styles.compassBackground, compassStyle]}>
                <Image 
                  source={{ 
                    uri: 'https://images.pexels.com/photos/9934462/pexels-photo-9934462.jpeg?w=1000'
                  }}
                  style={styles.compassImage}
                />
              </Animated.View>
              
              <View style={styles.compassCenter}>
                <Text style={[styles.headingText, { color: theme.colors.primary }]}>
                  {Math.round(heading)}°
                </Text>
              </View>
              
              <Animated.View style={[styles.qiblaIndicator, needleStyle]}>
                <Navigation size={40} color="#D4AF37" style={styles.qiblaIcon} />
              </Animated.View>
              
              <View style={styles.kaabaMark}>
                <Text style={styles.kaabaEmoji}>🕋</Text>
              </View>
            </View>
            
            <View style={styles.infoContainer}>
              <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>
                    {t('qibla_direction')}:
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                    {Math.round(qiblaAngle)}°
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>
                    {t('current_heading')}:
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                    {Math.round(heading)}°
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textLight }]}>
                    {t('accuracy')}:
                  </Text>
                  <View style={[
                    styles.accuracyIndicator, 
                    { backgroundColor: accuracy === 'high' 
                      ? theme.colors.success 
                      : accuracy === 'medium' 
                      ? theme.colors.warning 
                      : theme.colors.error 
                    }
                  ]} />
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                    {Platform.OS === 'web' ? t('simulated') : t(accuracy)}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={[styles.calibrateButton, { backgroundColor: theme.colors.primary }]}
                onPress={calibrateCompass}
                disabled={isCalibrating}
              >
                {isCalibrating ? (
                  <Text style={[styles.calibrateText, { color: theme.colors.white }]}>
                    {t('calibrating')}...
                  </Text>
                ) : (
                  <>
                    <RotateCw size={20} color={theme.colors.white} />
                    <Text style={[styles.calibrateText, { color: theme.colors.white }]}>
                      {t('calibrate_compass')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              
              {Platform.OS === 'web' && (
                <View style={[styles.webNotice, { backgroundColor: theme.colors.warning }]}>
                  <AlertCircle size={20} color={theme.colors.white} />
                  <Text style={[styles.webNoticeText, { color: theme.colors.white }]}>
                    {t('web_compass_notice')}
                  </Text>
                </View>
              )}
              
              <View style={styles.instructionsContainer}>
                <Text style={[styles.instructionsTitle, { color: theme.colors.primary }]}>
                  {t('calibration_instructions')}
                </Text>
                <Text style={[styles.instructionsText, { color: theme.colors.text }]}>
                  {t('calibration_step_1')}
                </Text>
                <Text style={[styles.instructionsText, { color: theme.colors.text }]}>
                  {t('calibration_step_2')}
                </Text>
                <Text style={[styles.instructionsText, { color: theme.colors.text }]}>
                  {t('calibration_step_3')}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  compassContainer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  compassBackground: {
    width: 280,
    height: 280,
    borderRadius: 140,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  compassImage: {
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  compassCenter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10,
  },
  headingText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
  },
  qiblaIndicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
    zIndex: 5,
  },
  qiblaIcon: {
    position: 'absolute',
    top: 15,
  },
  kaabaMark: {
    position: 'absolute',
    top: 5,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  kaabaEmoji: {
    fontSize: 20,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  infoCard: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    marginRight: 8,
  },
  infoValue: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  accuracyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  calibrateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  calibrateText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  webNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  webNoticeText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  instructionsContainer: {
    width: '100%',
  },
  instructionsTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  instructionsText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    marginBottom: 8,
  },
  noLocationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noLocationText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noLocationSubtext: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: '80%',
  },
});