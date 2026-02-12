import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetExpertQueries, useRespondToExpertQuery } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { ExpertQuery, QueryId } from '../../backend';

export default function ExpertQueriesManagement() {
  const { t } = useI18n();
  const { data: queries = [] } = useGetExpertQueries();
  const respondToQuery = useRespondToExpertQuery();

  const [showDialog, setShowDialog] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<ExpertQuery | null>(null);
  const [response, setResponse] = useState('');

  const openRespondDialog = (query: ExpertQuery) => {
    setSelectedQuery(query);
    setResponse(query.response || '');
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!selectedQuery || !response.trim()) {
      toast.error('Please enter a response');
      return;
    }

    try {
      await respondToQuery.mutateAsync({
        id: selectedQuery.id,
        response: response.trim(),
      });
      toast.success('Response submitted successfully');
      setShowDialog(false);
    } catch (error) {
      toast.error('Failed to submit response');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('manageQueries')}</CardTitle>
      </CardHeader>
      <CardContent>
        {queries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t('noData')}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>{t('question')}</TableHead>
                <TableHead>Attachment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queries.map((query) => (
                <TableRow key={query.id.toString()}>
                  <TableCell>
                    <Badge variant={query.response ? 'default' : 'secondary'} className="flex items-center gap-1 w-fit">
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
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2">{query.question}</p>
                  </TableCell>
                  <TableCell>
                    {query.attachment ? (
                      <img src={query.attachment} alt="Attachment" className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRespondDialog(query)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {query.response ? t('view') : t('respondToQuery')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('respondToQuery')}</DialogTitle>
            </DialogHeader>
            {selectedQuery && (
              <div className="space-y-4">
                <div>
                  <Label className="font-semibold">{t('question')}</Label>
                  <p className="text-muted-foreground mt-1">{selectedQuery.question}</p>
                </div>
                {selectedQuery.attachment && (
                  <div>
                    <Label className="font-semibold">Attachment</Label>
                    <img
                      src={selectedQuery.attachment}
                      alt="Query attachment"
                      className="mt-2 w-full max-h-64 object-contain rounded-lg border"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="response">{t('response')}</Label>
                  <Textarea
                    id="response"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Provide your expert advice..."
                    rows={6}
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={respondToQuery.isPending}
                  className="w-full"
                >
                  {respondToQuery.isPending ? t('loading') : t('submit')}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
