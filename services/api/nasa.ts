import { NasaApod } from '../../types';
import { StorageService } from '../storage';

const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';

const FALLBACK_APOD: NasaApod = {
  title: 'La Nebulosa della Carena in Alta Definizione',
  date: new Date().toISOString().split('T')[0],
  explanation:
    'Nel cuore di una delle regioni più brillanti e dinamiche della Via Lattea sorge la Nebulosa della Carena (NGC 3372). Questa immensa fucina stellare ospita stelle colossali che emettono venti di radiazione capaci di modellare nubi di gas e polveri cosmiche in sculture gigantesche, visibili anche a occhio nudo nel cielo australe.',
  url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  media_type: 'image',
  copyright: 'NASA / ESA / Hubblesite',
};

export async function fetchNasaApod(): Promise<NasaApod> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(NASA_APOD_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const apod: NasaApod = {
        title: data.title || 'Astronomy Picture of the Day',
        date: data.date || new Date().toISOString().split('T')[0],
        explanation: data.explanation || '',
        url: data.url || FALLBACK_APOD.url,
        hdurl: data.hdurl,
        media_type: data.media_type === 'video' ? 'video' : 'image',
        copyright: data.copyright,
      };
      await StorageService.saveCachedApod(apod);
      return apod;
    }
  } catch (error) {
    console.warn('Impossibile scaricare APOD dalla rete, uso cache o fallback:', error);
  }

  const cached = await StorageService.getCachedApod();
  return cached || FALLBACK_APOD;
}
