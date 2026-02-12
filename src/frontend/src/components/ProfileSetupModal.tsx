import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useI18n } from '../i18n/I18nProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [landSize, setLandSize] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim() || !landSize.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const landSizeNum = parseFloat(landSize);
    if (isNaN(landSizeNum) || landSizeNum <= 0) {
      toast.error('Please enter a valid land size');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        location: location.trim(),
        landSize: landSizeNum,
        preferredLanguage,
      });
      toast.success('Profile created successfully');
    } catch (error) {
      toast.error('Failed to create profile');
      console.error(error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('profileSetupTitle')}</DialogTitle>
          <DialogDescription>
            {t('profileSetupDesc')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('name')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">{t('location')}</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('location')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="landSize">{t('landSize')}</Label>
            <Input
              id="landSize"
              type="number"
              step="0.1"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              placeholder="10"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">{t('preferredLanguage')}</Label>
            <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? t('loading') : t('createProfile')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
