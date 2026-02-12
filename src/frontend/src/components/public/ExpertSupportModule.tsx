import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetExpertQueries, useSubmitExpertQuery } from '../../hooks/useQueries';
import { validateImageFile, fileToBase64 } from '../../utils/imageAttachment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Upload, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function ExpertSupportModule() {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const { data: queries = [] } = useGetExpertQueries();
  const submitQuery = useSubmitExpertQuery();
  
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [question, setQuestion] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleSubmit = async () => {
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">{t('expertSupportTitle')}</h2>
          <p className="text-muted-foreground">{t('expertSupportDesc')}</p>
        </div>
        <Dialog open={showQueryDialog} onOpenChange={setShowQueryDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <MessageCircle className="h-4 w-4" />
              {t('submitQuery')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('submitQuery')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">{t('question')}</Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask your agriculture question..."
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
              <Button onClick={handleSubmit} disabled={submitQuery.isPending} className="w-full">
                {submitQuery.isPending ? t('loading') : t('submit')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {queries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {identity ? 'No queries yet. Submit your first question!' : 'Please login to submit and view queries'}
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {queries.map((query) => (
            <AccordionItem key={query.id.toString()} value={query.id.toString()} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3 text-left">
                    <MessageCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <h3 className="font-semibold text-lg line-clamp-1">{query.question}</h3>
                  </div>
                  <Badge variant={query.response ? 'default' : 'secondary'} className="flex items-center gap-1">
                    {query.response ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        {t('resolved')}
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" />
                        {t('pending')}
                      </>
                    )}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{t('question')}</h4>
                    <p className="text-muted-foreground">{query.question}</p>
                  </div>
                  {query.attachment && (
                    <div>
                      <h4 className="font-semibold mb-2">Attachment</h4>
                      <img src={query.attachment} alt="Query attachment" className="w-full max-w-md h-48 object-cover rounded-lg" />
                    </div>
                  )}
                  {query.response && (
                    <div>
                      <h4 className="font-semibold mb-2">{t('response')}</h4>
                      <p className="text-muted-foreground">{query.response}</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
