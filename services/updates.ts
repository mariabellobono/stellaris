import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export const UpdateService = {
  isSupported(): boolean {
    return Updates.isEnabled && !__DEV__;
  },

  getAppVersion(): string {
    return '1.0.0';
  },

  getChannel(): string {
    return Updates.channel || (Updates.isEnabled ? 'production' : 'development');
  },

  async checkForUpdate(interactive = true): Promise<boolean> {
    try {
      if (!Updates.isEnabled || __DEV__) {
        if (interactive) {
          Alert.alert(
            'Aggiornamenti App ✦',
            'Stellaris v1.0.0 è all\'ultima versione.\n\nIl motore di aggiornamento Over-The-Air (EAS Update) è configurato e attivo per scaricare automaticamente nuove patch di produzione senza dover passare dagli store.'
          );
        }
        return false;
      }

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        if (interactive) {
          Alert.alert(
            'Aggiornamento Disponibile! 🚀',
            'È disponibile una nuova versione di Stellaris. Vuoi scaricarla e riavviare l\'app adesso per applicarla?',
            [
              { text: 'Più tardi', style: 'cancel' },
              {
                text: 'Aggiorna e Riavvia',
                onPress: async () => {
                  try {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync();
                  } catch (e: any) {
                    Alert.alert('Errore download', e?.message || 'Riprova più tardi.');
                  }
                },
              },
            ]
          );
        }
        return true;
      } else {
        if (interactive) {
          Alert.alert(
            'App Aggiornata ✓',
            'Stai già utilizzando l\'ultima versione disponibile di Stellaris!'
          );
        }
        return false;
      }
    } catch (error: any) {
      if (interactive) {
        Alert.alert(
          'Controllo Aggiornamenti',
          'Nessun aggiornamento disponibile o connessione non riuscita: ' +
            (error?.message || 'Riprova più tardi.')
        );
      }
      return false;
    }
  },
};
