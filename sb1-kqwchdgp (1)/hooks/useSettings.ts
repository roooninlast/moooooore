import { useSettingsContext } from '@/contexts/SettingsContext';

export const useSettings = () => {
  return useSettingsContext();
};