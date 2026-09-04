import { useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Updates from 'expo-updates';

export function useAppUpdates() {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<string>(
    'Verifica disponibilità nuova versione...'
  );

  const checkForUpdatesAndApply = useCallback(async () => {
    // In modalità dev o Expo Go, Updates non scarica pacchetti OTA
    if (!Updates.isEnabled || __DEV__) {
      return;
    }

    try {
      const check = await Updates.checkForUpdateAsync();

      if (check.isAvailable) {
        // Mostra il modal/schermata "Sto aggiornando..."
        setIsUpdating(true);
        setUpdateStatus('Scaricamento nuova versione...');

        await Updates.fetchUpdateAsync();
        setUpdateStatus('Aggiornamento completato! Riavvio sulla Home...');

        // Breve pausa per mostrare il messaggio di completamento
        setTimeout(async () => {
          try {
            await Updates.reloadAsync();
          } catch (reloadErr) {
            console.warn('Errore riavvio app dopo update:', reloadErr);
            setIsUpdating(false);
          }
        }, 1000);
      }
    } catch (error) {
      console.warn('Errore controllo aggiornamenti automatici:', error);
      setIsUpdating(false);
    }
  }, []);

  useEffect(() => {
    // 1. Controllo automatico immediato ad ogni apertura dell'app
    checkForUpdatesAndApply();

    // 2. Controllo automatico ogni volta che l'app torna attiva in primo piano (foreground)
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          checkForUpdatesAndApply();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [checkForUpdatesAndApply]);

  return {
    isUpdating,
    updateStatus,
  };
}
