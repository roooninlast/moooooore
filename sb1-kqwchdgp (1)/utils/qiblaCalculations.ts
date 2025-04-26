// Constants for Kaaba coordinates
const KAABA_LATITUDE = 21.422487;
const KAABA_LONGITUDE = 39.826206;

/**
 * Converts degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Converts radians to degrees
 */
const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

/**
 * Calculates the qibla direction in degrees from true north
 * @param latitude User's latitude
 * @param longitude User's longitude
 * @returns Qibla direction in degrees from true north
 */
export const calculateQiblaDirection = (latitude: number, longitude: number): number => {
  // Convert all coordinates to radians
  const lat1 = toRadians(latitude);
  const lon1 = toRadians(longitude);
  const lat2 = toRadians(KAABA_LATITUDE);
  const lon2 = toRadians(KAABA_LONGITUDE);
  
  // Calculate the qibla direction using the spherical cosine formula
  let qiblaRad = Math.atan2(
    Math.sin(lon2 - lon1),
    Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(lon2 - lon1)
  );
  
  // Convert to degrees and normalize to 0-360
  let qiblaDeg = toDegrees(qiblaRad);
  qiblaDeg = (qiblaDeg + 360) % 360;
  
  return qiblaDeg;
};