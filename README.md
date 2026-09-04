# 🔭 Stellaris - Osservatorio Mobile del Cielo Notturno

Applicazione mobile astronomica sviluppata con **React Native**, **Expo SDK 57** e **TypeScript**, concepita specificamente per l'osservazione notturna degli eventi celesti.

---

## 🎨 Design System
* **Dark Mode Esclusiva:** Interfaccia studiata per evitare l'affaticamento visivo e preservare la dilatazione pupillare durante l'osservazione (`#0B0D17` sfondo, `#151821` card, `#E63946` accento rosso astronomico).

---

## 📱 Architettura delle Schermate

1. **🌌 Tab 1: Home (Dashboard)**
   - **Header Meteo Notturno:** Visibilità del cielo dalle 21:00 in poi calcolata tramite Open-Meteo (`100% - Copertura Nuvole`) con geolocalizzazione GPS automatica.
   - **Hero NASA APOD:** Foto astronomica del giorno ufficiale con spiegazione scientifica interattiva.
   - **Carosello Prossimi Eventi:** FlatList orizzontale degli eventi in arrivo.
   - **Tracker ISS Live:** Coordinate (latitudine, longitudine, altitudine e velocità orbitale) della Stazione Spaziale Internazionale aggiornate ogni 10 secondi.

2. **🔭 Tab 2: Esplora (Eventi)**
   - Ricerca istantanea per testo e chip di categoria (*Sciami Meteorici, Eclissi, Congiunzioni, Luna & Pianeti*).
   - Lista cronologica completa.

3. **⭐ Schermata Dettaglio Evento**
   - Immagine ad alta risoluzione, orario del picco, direzione bussola e strumento consigliato.
   - **Pulsanti d'azione:**
     - ❤️ *Salva nei Preferiti*
     - 🌟 *L'ho visto!* (Passaporto dell'osservatore)
     - 📅 *Aggiungi al Calendario* (creazione promemoria nel calendario nativo del dispositivo con `expo-calendar`).

4. **👤 Tab 3: Profilo & Area Personale**
   - Rilevamento dello stato di connessione con banner condizionale offline (*"Sei offline. Dati salvati in locale."*).
   - Gestione preferiti e statistiche del passaporto osservazioni.
   - Autenticazione e sincronizzazione Supabase (con fallback locale offline-first).

---

## 🚀 Avvio Rapido

```bash
# Installa dipendenze (se necessario)
npm install

# Avvia il server di sviluppo Expo
npm start
```
