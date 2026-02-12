import { useI18n } from '../../i18n/I18nProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Droplets, Wind, Thermometer } from 'lucide-react';

export default function WeatherModule() {
  const { t } = useI18n();

  // Mock weather data - in production, this would come from a weather API
  const weatherData = {
    current: {
      temperature: 28,
      humidity: 65,
      rainfall: 0,
      windSpeed: 12,
    },
    forecast: [
      { day: 'Mon', temp: 29, condition: 'Sunny' },
      { day: 'Tue', temp: 27, condition: 'Cloudy' },
      { day: 'Wed', temp: 26, condition: 'Rainy' },
      { day: 'Thu', temp: 28, condition: 'Sunny' },
      { day: 'Fri', temp: 30, condition: 'Sunny' },
      { day: 'Sat', temp: 29, condition: 'Partly Cloudy' },
      { day: 'Sun', temp: 27, condition: 'Cloudy' },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t('weatherTitle')}</h2>
        <p className="text-muted-foreground">{t('weatherDesc')}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Thermometer className="h-5 w-5 text-orange-500" />
              {t('temperature')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{weatherData.current.temperature}°C</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Droplets className="h-5 w-5 text-blue-500" />
              {t('humidity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{weatherData.current.humidity}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Cloud className="h-5 w-5 text-gray-500" />
              {t('rainfall')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{weatherData.current.rainfall} mm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wind className="h-5 w-5 text-teal-500" />
              {t('windSpeed')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{weatherData.current.windSpeed} km/h</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weatherData.forecast.map((day, idx) => (
              <div key={idx} className="text-center p-3 rounded-lg bg-muted/50">
                <p className="font-semibold text-sm mb-2">{day.day}</p>
                <p className="text-2xl font-bold mb-1">{day.temp}°</p>
                <p className="text-xs text-muted-foreground">{day.condition}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
