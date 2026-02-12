import { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetMandiPrices } from '../../hooks/useQueries';
import { getCachedData, isOfflineError } from '../../utils/offlineCache';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp } from 'lucide-react';
import OfflineIndicator from '../OfflineIndicator';
import type { MandiPrice } from '../../backend';

export default function MandiPricesModule() {
  const { t } = useI18n();
  const { data: prices = [], isError, error } = useGetMandiPrices();
  const [searchTerm, setSearchTerm] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedPrices, setSelectedPrices] = useState<MandiPrice[]>([]);

  const cachedPrices = getCachedData<typeof prices>('mandiPrices');
  const displayPrices = isError && isOfflineError(error) && cachedPrices ? cachedPrices : prices;
  const showOffline = isError && isOfflineError(error) && cachedPrices;

  const filteredPrices = displayPrices.filter(
    (price) =>
      price.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCompare = (price: MandiPrice) => {
    if (selectedPrices.find((p) => p.id === price.id)) {
      setSelectedPrices(selectedPrices.filter((p) => p.id !== price.id));
    } else if (selectedPrices.length < 3) {
      setSelectedPrices([...selectedPrices, price]);
    }
  };

  return (
    <div className="space-y-6">
      {showOffline && <OfflineIndicator />}
      
      <div>
        <h2 className="text-3xl font-bold mb-2">{t('mandiPricesTitle')}</h2>
        <p className="text-muted-foreground">{t('mandiPricesDesc')}</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${t('search')} ${t('crop')} or ${t('location')}...`}
            className="pl-10"
          />
        </div>
        <Button
          variant={compareMode ? 'default' : 'outline'}
          onClick={() => {
            setCompareMode(!compareMode);
            if (compareMode) setSelectedPrices([]);
          }}
        >
          {t('comparePrice')}
        </Button>
      </div>

      {compareMode && selectedPrices.length > 0 && (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Comparing {selectedPrices.length} prices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {selectedPrices.map((price) => (
                <Card key={price.id.toString()}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{price.crop}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">₹{price.price.toString()}/quintal</p>
                    <p className="text-sm text-muted-foreground mt-1">{price.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredPrices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {searchTerm ? 'No prices found' : t('noData')}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrices.map((price) => (
            <Card
              key={price.id.toString()}
              className={`cursor-pointer transition-all ${
                selectedPrices.find((p) => p.id === price.id)
                  ? 'ring-2 ring-primary'
                  : 'hover:shadow-md'
              }`}
              onClick={() => compareMode && toggleCompare(price)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{price.crop}</CardTitle>
                  {compareMode && (
                    <Badge variant={selectedPrices.find((p) => p.id === price.id) ? 'default' : 'outline'}>
                      {selectedPrices.find((p) => p.id === price.id) ? 'Selected' : 'Select'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <p className="text-3xl font-bold text-primary">₹{price.price.toString()}</p>
                  <span className="text-sm text-muted-foreground">/quintal</span>
                </div>
                <p className="text-sm text-muted-foreground">{price.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
