import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetSoilReports, useAddSoilReport } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { TestTube, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function SoilHealthModule() {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const { data: reports = [] } = useGetSoilReports();
  const addReport = useAddSoilReport();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [ph, setPh] = useState('');
  const [nutrients, setNutrients] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const handleSubmit = async () => {
    if (!identity) {
      toast.error('Please login to add a soil report');
      return;
    }

    if (!ph || !nutrients || !recommendations) {
      toast.error('Please fill in all fields');
      return;
    }

    const phNum = parseFloat(ph);
    if (isNaN(phNum) || phNum < 0 || phNum > 14) {
      toast.error('Please enter a valid pH level (0-14)');
      return;
    }

    try {
      await addReport.mutateAsync({
        ph: phNum,
        nutrients: nutrients.trim(),
        recommendations: recommendations.trim(),
      });
      toast.success('Soil report added successfully');
      setShowAddDialog(false);
      setPh('');
      setNutrients('');
      setRecommendations('');
    } catch (error) {
      toast.error('Failed to add soil report');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">{t('soilHealthTitle')}</h2>
          <p className="text-muted-foreground">{t('soilHealthDesc')}</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('addReport')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('addReport')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ph">{t('phLevel')}</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  placeholder="7.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nutrients">{t('nutrients')}</Label>
                <Textarea
                  id="nutrients"
                  value={nutrients}
                  onChange={(e) => setNutrients(e.target.value)}
                  placeholder="N: 120 kg/ha, P: 60 kg/ha, K: 40 kg/ha"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recommendations">{t('recommendations')}</Label>
                <Textarea
                  id="recommendations"
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="Add organic matter, apply lime..."
                  rows={3}
                />
              </div>
              <Button onClick={handleSubmit} disabled={addReport.isPending} className="w-full">
                {addReport.isPending ? t('loading') : t('submit')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {identity ? 'No soil reports yet. Add your first report!' : 'Please login to view and add soil reports'}
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {reports.map((report) => (
            <AccordionItem key={report.id.toString()} value={report.id.toString()} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <TestTube className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Soil Report #{report.id.toString()}</h3>
                    <Badge variant="outline" className="mt-1">pH: {report.ph}</Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{t('nutrients')}</h4>
                    <p className="text-muted-foreground">{report.nutrients}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('recommendations')}</h4>
                    <p className="text-muted-foreground">{report.recommendations}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
