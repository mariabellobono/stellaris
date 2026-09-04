import { WeatherCondition } from '../../types';
import { StorageService } from '../storage';

export async function fetchNightWeather(
  latitude: number = 41.9028,
  longitude: number = 12.4964,
  cityName: string = 'Roma'
): Promise<WeatherCondition> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=cloudcover,temperature_2m,weathercode&current_weather=true&timezone=auto`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const currentTemp = Math.round(data.current_weather?.temperature ?? 18);

      const hourlyTimes: string[] = data.hourly?.time || [];
      const hourlyCloudCover: number[] = data.hourly?.cloudcover || [];

      // Filtra le ore notturne (dalle 21:00 in poi)
      const nightIndices: number[] = [];
      hourlyTimes.forEach((t, index) => {
        const hour = parseInt(t.split('T')[1]?.split(':')[0] || '-1', 10);
        if (hour >= 21 || hour <= 2) {
          if (nightIndices.length < 5) {
            nightIndices.push(index);
          }
        }
      });

      let avgCloudCover = 20;
      if (nightIndices.length > 0) {
        const sum = nightIndices.reduce(
          (acc, idx) => acc + (hourlyCloudCover[idx] ?? 20),
          0
        );
        avgCloudCover = Math.round(sum / nightIndices.length);
      }

      const visibility = Math.max(0, Math.min(100, 100 - avgCloudCover));

      let skyStatus: WeatherCondition['skyStatus'] = 'Ottimale';
      if (visibility >= 80) skyStatus = 'Ottimale';
      else if (visibility >= 60) skyStatus = 'Buono';
      else if (visibility >= 30) skyStatus = 'Parzialmente Nuvoloso';
      else skyStatus = 'Coperto';

      const condition: WeatherCondition = {
        city: cityName,
        temperature: currentTemp,
        cloudCover: avgCloudCover,
        visibilityPercentage: visibility,
        skyStatus,
        time: 'Notte (dalle 21:00)',
        isNightTime: true,
      };

      await StorageService.saveCachedWeather(condition);
      return condition;
    }
  } catch (error) {
    console.warn('Errore Open-Meteo, ricaduta su cache:', error);
  }

  const cached = await StorageService.getCachedWeather();
  if (cached) {
    return cached;
  }

  return {
    city: cityName,
    temperature: 19,
    cloudCover: 15,
    visibilityPercentage: 85,
    skyStatus: 'Ottimale',
    time: 'Notte (dalle 21:00)',
    isNightTime: true,
  };
}
