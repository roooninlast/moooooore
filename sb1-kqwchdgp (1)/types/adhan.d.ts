declare module 'adhan' {
  export class Coordinates {
    constructor(latitude: number, longitude: number);
    latitude: number;
    longitude: number;
  }

  export class CalculationParameters {
    fajrAngle: number;
    maghribAngle: number;
    ishaAngle: number;
    methodAdjustments: {
      fajr: number;
      sunrise: number;
      dhuhr: number;
      asr: number;
      maghrib: number;
      isha: number;
    };
    static NightPortions(): {
      fajr: number;
      isha: number;
    };
  }

  export class CalculationMethod {
    static MuslimWorldLeague(): CalculationParameters;
    static NorthAmerica(): CalculationParameters;
    static MoonsightingCommittee(): CalculationParameters;
    static Egypt(): CalculationParameters;
    static Karachi(): CalculationParameters;
    static UmmAlQura(): CalculationParameters;
    static Dubai(): CalculationParameters;
    static Qatar(): CalculationParameters;
    static Kuwait(): CalculationParameters;
    static Singapore(): CalculationParameters;
    static Tehran(): CalculationParameters;
  }

  export class PrayerTimes {
    constructor(coordinates: Coordinates, date: Date, params: CalculationParameters);
    fajr: Date;
    sunrise: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
    currentPrayer(): string;
    nextPrayer(): string;
  }
}