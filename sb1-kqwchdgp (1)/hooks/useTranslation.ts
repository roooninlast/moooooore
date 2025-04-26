import { useCallback } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { translations } from '@/utils/translations';

export const useTranslation = () => {
  const { settings } = useSettings();
  
  const t = useCallback(
    (key: string, params?: Record<string, string>) => {
      const currentTranslations = translations[settings.language] || translations.en;
      let translation = currentTranslations[key] || key;
      
      // Replace parameters if provided
      if (params) {
        Object.keys(params).forEach(param => {
          translation = translation.replace(`{{${param}}}`, params[param]);
        });
      }
      
      return translation;
    },
    [settings.language]
  );
  
  return { t };
};