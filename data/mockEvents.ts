import { AstroEvent } from '../types';

export const INITIAL_ASTRONOMICAL_EVENTS: AstroEvent[] = [
  {
    id: 'e1001-perseids',
    title: 'Sciame Meteorico delle Perseidi',
    category: 'Sciami Meteorici',
    event_date: '2026-08-12T21:30:00Z',
    instrument: 'Occhio nudo',
    direction: 'Nord-Est (Costellazione di Perseo)',
    description_tips:
      'Uno dei più spettacolari sciami di meteore dell\'anno, generate dalla cometa Swift-Tuttle. Fino a 100 meteore l\'ora ("stelle cadenti"). Consigliata una postazione al buio lontano dall\'inquinamento luminoso, stendersi a terra su un telo e guardare verso lo zenit.',
    image_url:
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'e1002-lunar-eclipse',
    title: 'Eclissi Lunare Totale ("Luna di Sangue")',
    category: 'Eclissi',
    event_date: '2026-09-07T20:15:00Z',
    instrument: 'Occhio nudo o Binocolo',
    direction: 'Sud-Est (Bassa sull\'orizzonte)',
    description_tips:
      'La Terra si interpone tra il Sole e la Luna, proiettando il proprio cono d\'ombra sul nostro satellite. Durante la totalità, la luce solare filtrata dall\'atmosfera terrestre conferisce alla Luna una drammatica tonalità rosso cupo rame.',
    image_url:
      'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'e1003-jupiter-saturn',
    title: 'Congiunzione Stretta Giove-Saturno',
    category: 'Congiunzioni',
    event_date: '2026-10-18T19:45:00Z',
    instrument: 'Binocolo o Telescopio',
    direction: 'Sud-Ovest',
    description_tips:
      'I due giganti gassosi del sistema solare si troveranno a meno di 0.5 gradi di distanza angolare apparente. Con un piccolo telescopio (70mm+) sarà possibile osservare contemporaneamente i 4 satelliti medicei di Giove e gli anelli maestosi di Saturno nel medesimo campo visivo.',
    image_url:
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'e1004-supermoon',
    title: 'Superluna Piena al Perigeo',
    category: 'Luna & Pianeti',
    event_date: '2026-11-24T22:00:00Z',
    instrument: 'Occhio nudo',
    direction: 'Est / Zenit',
    description_tips:
      'La Luna piena coincide quasi perfettamente con il perigeo orbitale (minima distanza dalla Terra, circa 357.000 km). Appare il 14% più grande e fino al 30% più luminosa di una luna piena ordinaria all\'apogeo. Ottima occasione per fotografare il sorgere della luna con elementi paesaggistici in silhouette.',
    image_url:
      'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'e1005-geminids',
    title: 'Sciame Meteorico delle Geminidi',
    category: 'Sciami Meteorici',
    event_date: '2026-12-14T23:00:00Z',
    instrument: 'Occhio nudo',
    direction: 'Est / Nord-Est (Gemelli)',
    description_tips:
      'Considerato dagli astronomi lo sciame più ricco e costante dell\'inverno. Generato dall\'asteroide 3200 Phaethon, produce meteore luminose, dense e spesso multicolori (sfumature gialle e verdi). Vestirsi a strati termici e adattare la vista al buio per almeno 25 minuti.',
    image_url:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'e1006-mars-opposition',
    title: 'Grande Opposizione di Marte',
    category: 'Luna & Pianeti',
    event_date: '2027-02-19T21:00:00Z',
    instrument: 'Telescopio (100mm+)',
    direction: 'Sud (Altissimo nel cielo)',
    description_tips:
      'Marte si trova alla minima distanza dalla Terra, completamente illuminato dal Sole e visibile per l\'intera notte con una vivida tonalità arancione ruggine. Con un telescopio e Seeing calmo è possibile distinguere la calotta polare e le vaste formazioni scure come Syrtis Major.',
    image_url:
      'https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?auto=format&fit=crop&w=1200&q=80',
  },
];
