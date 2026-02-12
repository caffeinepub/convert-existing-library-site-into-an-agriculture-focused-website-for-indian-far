import { useI18n } from '../i18n/I18nProvider';
import { useGetCropAdvisories, useGetMandiPrices, useGetGovernmentSchemes, useGetExpertQueries } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sprout, TrendingUp, FileText, MessageCircle } from 'lucide-react';
import CropAdvisoriesManagement from '../components/admin/CropAdvisoriesManagement';
import MandiPricesManagement from '../components/admin/MandiPricesManagement';
import GovernmentSchemesManagement from '../components/admin/GovernmentSchemesManagement';
import ExpertQueriesManagement from '../components/admin/ExpertQueriesManagement';

export default function AdminDashboard() {
  const { t } = useI18n();
  const { data: advisories = [] } = useGetCropAdvisories();
  const { data: prices = [] } = useGetMandiPrices();
  const { data: schemes = [] } = useGetGovernmentSchemes();
  const { data: queries = [] } = useGetExpertQueries();

  const pendingQueries = queries.filter((q) => !q.response).length;

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t('adminTitle')}</h1>
          <p className="text-muted-foreground">Manage agriculture content and support farmers</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Crop Advisories</CardTitle>
              <Sprout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{advisories.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mandi Prices</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prices.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Government Schemes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schemes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Queries</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingQueries}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="advisories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="advisories">{t('manageCropAdvisories')}</TabsTrigger>
            <TabsTrigger value="prices">{t('manageMandiPrices')}</TabsTrigger>
            <TabsTrigger value="schemes">{t('manageSchemes')}</TabsTrigger>
            <TabsTrigger value="queries">
              {t('manageQueries')}
              {pendingQueries > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {pendingQueries}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="advisories">
            <CropAdvisoriesManagement />
          </TabsContent>

          <TabsContent value="prices">
            <MandiPricesManagement />
          </TabsContent>

          <TabsContent value="schemes">
            <GovernmentSchemesManagement />
          </TabsContent>

          <TabsContent value="queries">
            <ExpertQueriesManagement />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
