import { WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '../i18n/I18nProvider';

export default function OfflineIndicator() {
  const { t } = useI18n();
  
  return (
    <Alert className="mb-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
      <WifiOff className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800 dark:text-orange-200">
        {t('offlineMode')}
      </AlertDescription>
    </Alert>
  );
}
