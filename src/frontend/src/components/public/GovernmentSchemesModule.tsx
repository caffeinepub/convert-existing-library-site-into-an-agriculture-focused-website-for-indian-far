import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetGovernmentSchemes } from '../../hooks/useQueries';
import { getCachedData, isOfflineError } from '../../utils/offlineCache';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import OfflineIndicator from '../OfflineIndicator';

export default function GovernmentSchemesModule() {
  const { t } = useI18n();
  const { data: schemes = [], isError, error } = useGetGovernmentSchemes();

  const cachedSchemes = getCachedData<typeof schemes>('governmentSchemes');
  const displaySchemes = isError && isOfflineError(error) && cachedSchemes ? cachedSchemes : schemes;
  const showOffline = isError && isOfflineError(error) && cachedSchemes;

  return (
    <div className="space-y-6">
      {showOffline && <OfflineIndicator />}
      
      <div>
        <h2 className="text-3xl font-bold mb-2">{t('schemesTitle')}</h2>
        <p className="text-muted-foreground">{t('schemesDesc')}</p>
      </div>

      {displaySchemes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {t('noData')}
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {displaySchemes.map((scheme) => (
            <AccordionItem key={scheme.id.toString()} value={scheme.id.toString()} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                  <h3 className="font-semibold text-lg">{scheme.name}</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{t('description')}</h4>
                    <p className="text-muted-foreground">{scheme.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('eligibility')}</h4>
                    <p className="text-muted-foreground">{scheme.eligibility}</p>
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
