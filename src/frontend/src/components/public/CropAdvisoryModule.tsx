import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCropAdvisories, useSubmitExpertQuery } from '../../hooks/useQueries';
import { getCachedData, isOfflineError } from '../../utils/offlineCache';
import { validateImageFile, fileToBase64 } from '../../utils/imageAttachment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Upload, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import OfflineIndicator from '../OfflineIndicator';

export default function CropAdvisoryModule() {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const { data: advisories = [], isError, error } = useGetCropAdvisories();
  const submitQuery = useSubmitExpertQuery();
  
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [question, setQuestion] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const cachedAdvisories = getCachedData<typeof advisories>('cropAdvisories');
  const displayAdvisories = isError && isOfflineError(error) && cachedAdvisories ? cachedAdvisories : advisories;
  const showOffline = isError && isOfflineError(error) && cachedAdvisories;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmitQuery = async () => {
    if (!identity) {
      toast.error('Please login to submit a query');
      return;
    }

    if (!question.trim()) {
      toast.error('Please enter your question');
      return;
    }

    try {
      let attachment: string | null = null;
      if (imageFile) {
        attachment = await fileToBase64(imageFile);
      }

      await submitQuery.mutateAsync({ question: question.trim(), attachment });
      toast.success('Query submitted successfully');
      setShowQueryDialog(false);
      setQuestion('');
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      toast.error('Failed to submit query');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {showOffline && <OfflineIndicator />}
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">{t('cropAdvisoryTitle')}</h2>
          <p className="text-muted-foreground">{t('cropAdvisoryDesc')}</p>
        </div>
        <Dialog open={showQueryDialog} onOpenChange={setShowQueryDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <MessageCircle className="h-4 w-4" />
              {t('askExpert')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('askExpert')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">{t('question')}</Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Describe your crop issue..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">{t('uploadPhoto')} (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageSelect}
                    className="flex-1"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                )}
              </div>
              <Button onClick={handleSubmitQuery} disabled={submitQuery.isPending} className="w-full">
                {submitQuery.isPending ? t('loading') : t('submit')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {displayAdvisories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {t('noData')}
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {displayAdvisories.map((advisory) => (
            <AccordionItem key={advisory.id.toString()} value={advisory.id.toString()} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <div>
                    <h3 className="font-semibold text-lg">{advisory.crop}</h3>
                    <Badge variant="outline" className="mt-1">{advisory.season}</Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-4 space-y-2">
                  <p className="text-muted-foreground whitespace-pre-wrap">{advisory.guidance}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
