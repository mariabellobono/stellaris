import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AstroEvent } from '../types';
import { StorageService } from '../services/storage';
import { SupabaseService, supabase, isSupabaseConfigured } from '../services/supabase';

export type ProfileSubTab = 'favorites' | 'observed';
export type AuthMode = 'login' | 'signup' | 'otp';

export function useProfile() {
  const router = useRouter();

  // Sub-tabs & Event lists state
  const [activeTab, setActiveTab] = useState<ProfileSubTab>('favorites');
  const [allEvents, setAllEvents] = useState<AstroEvent[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [observedIds, setObservedIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Authentication state
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthMode, setIsAuthMode] = useState<AuthMode>('login');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [showAuthCard, setShowAuthCard] = useState<boolean>(false);

  // Load events, user preferences and cloud sync
  const loadProfileData = useCallback(async () => {
    let [events, favs, obs] = await Promise.all([
      SupabaseService.getEvents(),
      StorageService.getFavorites(),
      StorageService.getObserved(),
    ]);

    // Controlla sessione utente Supabase persistita in AsyncStorage
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user =
        sessionData?.session?.user ||
        (await supabase.auth.getUser()).data?.user;

      if (user?.email) {
        setUserEmail(user.email);

        // Se l'utente è autenticato, sincronizza dal cloud Supabase
        const remoteStates = await SupabaseService.getUserEvents(user.id);
        if (remoteStates && remoteStates.length > 0) {
          const remoteFavs = remoteStates
            .filter((s) => s.is_favorite)
            .map((s) => s.event_id);
          const remoteObs = remoteStates
            .filter((s) => s.is_observed)
            .map((s) => s.event_id);

          favs = Array.from(new Set([...favs, ...remoteFavs]));
          obs = Array.from(new Set([...obs, ...remoteObs]));

          await Promise.all([
            StorageService.saveFavorites(favs),
            StorageService.saveObserved(obs),
          ]);
        }
      } else {
        setUserEmail(null);
      }
    } catch {
      setUserEmail(null);
    }

    setAllEvents(events);
    setFavoriteIds(favs);
    setObservedIds(obs);
  }, []);

  // Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

  // Auth State Listener
  useEffect(() => {
    loadProfileData();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [loadProfileData]);

  // Handle Login & Signup
  const handleAuth = async () => {
    if (!emailInput || !passwordInput) {
      Alert.alert('Campi obbligatori', 'Inserisci sia email che password.');
      return;
    }

    if (!isSupabaseConfigured()) {
      Alert.alert(
        'Supabase non configurato',
        'Stai usando l\'app in modalità Locale/Offline. Per abilitare il cloud inserisci le tue chiavi Supabase in .env.'
      );
      return;
    }

    setAuthLoading(true);
    try {
      if (isAuthMode === 'login') {
        const { error, data } = await supabase.auth.signInWithPassword({
          email: emailInput,
          password: passwordInput,
        });
        if (error) throw error;
        setUserEmail(data.user?.email || emailInput);
        setShowAuthCard(false);
        Alert.alert('Accesso riuscito!', `Benvenuto, ${data.user?.email}`);
      } else {
        const { error, data } = await supabase.auth.signUp({
          email: emailInput,
          password: passwordInput,
        });
        if (error) throw error;

        if (data.session) {
          setUserEmail(data.user?.email || emailInput);
          setShowAuthCard(false);
          Alert.alert('Accesso riuscito!', `Benvenuto in Stellaris, ${data.user?.email}`);
        } else {
          setIsAuthMode('otp');
          Alert.alert(
            'Email di verifica inviata!',
            'Controlla l\'email: se contiene un codice numerico, inseriscilo qui sotto per confermare all\'istante senza cliccare nessun link.'
          );
        }
      }
      setEmailInput('');
      setPasswordInput('');
    } catch (err: any) {
      Alert.alert('Errore Autenticazione', err.message || 'Si è verificato un errore.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (!emailInput || !otpInput) {
      Alert.alert('Campi obbligatori', 'Inserisci sia la tua email che il codice ricevuto.');
      return;
    }

    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: emailInput.trim(),
        token: otpInput.trim(),
        type: 'signup',
      });
      if (error) throw error;

      setUserEmail(data.user?.email || emailInput.trim());
      setShowAuthCard(false);
      setOtpInput('');
      Alert.alert('Email confermata!', `Accesso effettuato come ${data.user?.email}`);
    } catch (err: any) {
      Alert.alert('Errore Codice', err.message || 'Codice non valido o scaduto.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserEmail(null);
      Alert.alert('Disconnesso', 'Sei tornato in modalità Ospite locale.');
    } catch (e) {
      console.warn('Errore logout:', e);
    }
  };

  // Navigate to event detail
  const handleOpenDetail = (event: AstroEvent) => {
    router.push({
      pathname: '/event-detail',
      params: { eventJson: JSON.stringify(event) },
    });
  };

  // Derived lists
  const favoriteEvents = allEvents.filter((ev) => favoriteIds.includes(ev.id));
  const observedEvents = allEvents.filter((ev) => observedIds.includes(ev.id));
  const currentList = activeTab === 'favorites' ? favoriteEvents : observedEvents;

  return {
    // State
    activeTab,
    setActiveTab,
    favoriteIds,
    observedIds,
    refreshing,
    userEmail,
    isAuthMode,
    setIsAuthMode,
    emailInput,
    setEmailInput,
    passwordInput,
    setPasswordInput,
    otpInput,
    setOtpInput,
    authLoading,
    showAuthCard,
    setShowAuthCard,

    // Lists
    currentList,
    favoriteEvents,
    observedEvents,

    // Actions
    onRefresh,
    handleAuth,
    handleVerifyOtp,
    handleSignOut,
    handleOpenDetail,
  };
}
