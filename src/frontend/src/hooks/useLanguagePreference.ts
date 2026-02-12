import { useEffect } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './useQueries';
import { useInternetIdentity } from './useInternetIdentity';

export function useLanguagePreference() {
  const { language, setLanguage } = useI18n();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  useEffect(() => {
    if (identity && userProfile && userProfile.preferredLanguage !== language) {
      saveProfile.mutate({
        name: userProfile.name,
        location: userProfile.location,
        landSize: userProfile.landSize,
        preferredLanguage: language,
      });
    }
  }, [language, identity, userProfile]);

  useEffect(() => {
    if (userProfile && userProfile.preferredLanguage) {
      const profileLang = userProfile.preferredLanguage === 'hi' ? 'hi' : 'en';
      if (profileLang !== language) {
        setLanguage(profileLang);
      }
    }
  }, [userProfile]);

  return { language, setLanguage };
}
