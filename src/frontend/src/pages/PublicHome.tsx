import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { useGetCropAdvisories, useGetMandiPrices, useGetGovernmentSchemes } from '../hooks/useQueries';
import { getCachedData, isOfflineError } from '../utils/offlineCache';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Cloud, Sprout, TrendingUp, FileText, TestTube, MessageCircle } from 'lucide-react';
import OfflineIndicator from '../components/OfflineIndicator';
import CropAdvisoryModule from '../components/public/CropAdvisoryModule';
import MandiPricesModule from '../components/public/MandiPricesModule';
import GovernmentSchemesModule from '../components/public/GovernmentSchemesModule';
import SoilHealthModule from '../components/public/SoilHealthModule';
import ExpertSupportModule from '../components/public/ExpertSupportModule';
import WeatherModule from '../components/public/WeatherModule';

export default function PublicHome() {
  const { t } = useI18n();
  const [activeModule, setActiveModule] = useState<string>('weather');

  const advisoriesQuery = useGetCropAdvisories();
  const pricesQuery = useGetMandiPrices();
  const schemesQuery = useGetGovernmentSchemes();

  const showOfflineIndicator = 
    (advisoriesQuery.isError && isOfflineError(advisoriesQuery.error)) ||
    (pricesQuery.isError && isOfflineError(pricesQuery.error)) ||
    (schemesQuery.isError && isOfflineError(schemesQuery.error));

  const modules = [
    { id: 'weather', icon: Cloud, label: t('weather') },
    { id: 'advisory', icon: Sprout, label: t('cropAdvisory') },
    { id: 'prices', icon: TrendingUp, label: t('mandiPrices') },
    { id: 'schemes', icon: FileText, label: t('governmentSchemes') },
    { id: 'soil', icon: TestTube, label: t('soilHealth') },
    { id: 'expert', icon: MessageCircle, label: t('expertSupport') },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold tracking-tight">
                {t('appName')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('tagline')}
              </p>
              <div className="flex flex-wrap gap-4">
                {modules.slice(0, 3).map((module) => (
                  <Button
                    key={module.id}
                    size="lg"
                    variant="outline"
                    onClick={() => setActiveModule(module.id)}
                    className="gap-2"
                  >
                    <module.icon className="h-5 w-5" />
                    {module.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/assets/generated/farm-hero.dim_1600x900.jpg"
                alt="Farm landscape"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-16">
        <div className="container">
          {showOfflineIndicator && <OfflineIndicator />}
          
          <Tabs value={activeModule} onValueChange={setActiveModule} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-2">
              {modules.map((module) => (
                <TabsTrigger
                  key={module.id}
                  value={module.id}
                  className="flex flex-col items-center gap-2 py-3"
                >
                  <module.icon className="h-5 w-5" />
                  <span className="text-xs">{module.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="weather">
              <WeatherModule />
            </TabsContent>

            <TabsContent value="advisory">
              <CropAdvisoryModule />
            </TabsContent>

            <TabsContent value="prices">
              <MandiPricesModule />
            </TabsContent>

            <TabsContent value="schemes">
              <GovernmentSchemesModule />
            </TabsContent>

            <TabsContent value="soil">
              <SoilHealthModule />
            </TabsContent>

            <TabsContent value="expert">
              <ExpertSupportModule />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Empowering Farmers with Technology</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access real-time information, expert guidance, and government schemes all in one place
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <img
              src="/assets/generated/farmers-using-app.dim_800x600.jpg"
              alt="Farmers using technology"
              className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
            />
            <div className="space-y-4">
              {modules.map((module) => (
                <Card key={module.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <module.icon className="h-5 w-5 text-primary" />
                      {module.label}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
