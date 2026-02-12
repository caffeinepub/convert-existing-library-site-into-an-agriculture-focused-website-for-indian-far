import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '../i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sprout, LogIn, LogOut, LayoutDashboard, Home, Languages } from 'lucide-react';

interface HeaderProps {
  onAdminToggle?: () => void;
  showAdminToggle?: boolean;
  isAdminView?: boolean;
}

export default function Header({ onAdminToggle, showAdminToggle, isAdminView }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { language, setLanguage, t } = useI18n();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/assets/generated/agri-logo.dim_512x512.png" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold">{t('appName')}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Select value={language} onValueChange={(val) => setLanguage(val as 'en' | 'hi')}>
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showAdminToggle && (
            <Button
              onClick={onAdminToggle}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {isAdminView ? (
                <>
                  <Home className="h-4 w-4" />
                  {t('publicView')}
                </>
              ) : (
                <>
                  <LayoutDashboard className="h-4 w-4" />
                  {t('adminDashboard')}
                </>
              )}
            </Button>
          )}

          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
            className="gap-2"
          >
            {loginStatus === 'logging-in' ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t('loading')}
              </>
            ) : isAuthenticated ? (
              <>
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                {t('login')}
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
