import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { THEME } from '../../constants/theme';
import { AstroEvent } from '../../types';
import { StorageService } from '../../services/storage';
import { SupabaseService, supabase, isSupabaseConfigured } from '../../services/supabase';
import { OfflineBanner } from '../../components/OfflineBanner';
import { EventCard } from '../../components/EventCard';

type ProfileSubTab = 'favorites' | 'observed';

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileSubTab>('favorites');
  const [allEvents, setAllEvents] = useState<AstroEvent[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [observedIds, setObservedIds] = useState<string[]>([]);

  // Auth State
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthMode, setIsAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [showAuthCard, setShowAuthCard] = useState<boolean>(false);

  const loadProfileData = useCallback(async () => {
    const [events, favs, obs] = await Promise.all([
      SupabaseService.getEvents(),
      StorageService.getFavorites(),
      StorageService.getObserved(),
    ]);

    setAllEvents(events);
    setFavoriteIds(favs);
    setObservedIds(obs);

    // Controlla sessione utente Supabase
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      } else {
        setUserEmail(null);
      }
    } catch {
      setUserEmail(null);
    }
  }, []);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

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
        Alert.alert(
          'Registrazione effettuata!',
          'Controlla la tua email per confermare l\'account o accedi direttamente.'
        );
      }
      setEmailInput('');
      setPasswordInput('');
    } catch (err: any) {
      Alert.alert('Errore Autenticazione', err.message || 'Si è verificato un errore.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserEmail(null);
      Alert.alert('Disconnesso', 'Sei tornato in modalità Ospite locale.');
    } catch (e) {
      console.warn('Errore logout:', e);
    }
  };

  const favoriteEvents = allEvents.filter((ev) => favoriteIds.includes(ev.id));
  const observedEvents = allEvents.filter((ev) => observedIds.includes(ev.id));
  const currentList = activeTab === 'favorites' ? favoriteEvents : observedEvents;

  const handleOpenDetail = (event: AstroEvent) => {
    router.push({
      pathname: '/event-detail',
      params: { eventJson: JSON.stringify(event) },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OfflineBanner />
      <View style={styles.container}>
        {/* Card Profilo / Account */}
        <View style={styles.userCard}>
          <View style={styles.userHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons
                name={userEmail ? 'person' : 'person-outline'}
                size={24}
                color={THEME.colors.accent}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {userEmail ? userEmail : 'Astrofilo Ospite'}
              </Text>
              <Text style={styles.userStatus}>
                {userEmail
                  ? 'Account Sincronizzato con Cloud'
                  : 'Modalità Locale (Dati salvati sul telefono)'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.authToggleBtn}
              onPress={() => {
                if (userEmail) {
                  handleSignOut();
                } else {
                  setShowAuthCard(!showAuthCard);
                }
              }}
            >
              <Text style={styles.authToggleText}>
                {userEmail ? 'Esci' : showAuthCard ? 'Chiudi' : 'Accedi'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Login / Signup a scomparsa */}
          {showAuthCard && !userEmail && (
            <View style={styles.authForm}>
              <Text style={styles.authFormTitle}>
                {isAuthMode === 'login' ? 'Accedi a Supabase' : 'Crea Nuovo Account'}
              </Text>
              <TextInput
                placeholder="Indirizzo Email"
                placeholderTextColor={THEME.colors.textMuted}
                value={emailInput}
                onChangeText={setEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor={THEME.colors.textMuted}
                value={passwordInput}
                onChangeText={setPasswordInput}
                secureTextEntry
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleAuth}
                disabled={authLoading}
              >
                {authLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>
                    {isAuthMode === 'login' ? 'Entra' : 'Registrati'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setIsAuthMode(isAuthMode === 'login' ? 'signup' : 'login')
                }
                style={styles.switchModeBtn}
              >
                <Text style={styles.switchModeText}>
                  {isAuthMode === 'login'
                    ? 'Non hai un account? Registrati'
                    : 'Hai già un account? Accedi'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Statistiche Passaporto Astronomico */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{favoriteIds.length}</Text>
              <Text style={styles.statLabel}>Preferiti ❤️</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{observedIds.length}</Text>
              <Text style={styles.statLabel}>Osservati 🌟</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {observedIds.length >= 3 ? 'Avanzato' : 'Novizio'}
              </Text>
              <Text style={styles.statLabel}>Livello Sky</Text>
            </View>
          </View>
        </View>

        {/* Tab Switcher Interno (Preferiti vs Passaporto Osservati) */}
        <View style={styles.tabsSwitcher}>
          <TouchableOpacity
            style={[
              styles.tabSwitchItem,
              activeTab === 'favorites' && styles.tabSwitchItemActive,
            ]}
            onPress={() => setActiveTab('favorites')}
          >
            <Ionicons
              name="heart"
              size={16}
              color={activeTab === 'favorites' ? THEME.colors.accent : THEME.colors.textSecondary}
            />
            <Text
              style={[
                styles.tabSwitchText,
                activeTab === 'favorites' && styles.tabSwitchTextActive,
              ]}
            >
              Preferiti ({favoriteIds.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabSwitchItem,
              activeTab === 'observed' && styles.tabSwitchItemActive,
            ]}
            onPress={() => setActiveTab('observed')}
          >
            <Ionicons
              name="star"
              size={16}
              color={activeTab === 'observed' ? THEME.colors.gold : THEME.colors.textSecondary}
            />
            <Text
              style={[
                styles.tabSwitchText,
                activeTab === 'observed' && styles.tabSwitchTextActive,
              ]}
            >
              Passaporto ({observedIds.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista degli eventi salvati */}
        <FlatList
          data={currentList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              isFavorite={favoriteIds.includes(item.id)}
              isObserved={observedIds.includes(item.id)}
              onPress={() => handleOpenDetail(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name={activeTab === 'favorites' ? 'heart-outline' : 'star-outline'}
                size={44}
                color={THEME.colors.textMuted}
              />
              <Text style={styles.emptyTitle}>
                {activeTab === 'favorites'
                  ? 'Nessun evento preferito'
                  : 'Nessun evento nel Passaporto'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'favorites'
                  ? 'Esplora gli eventi e tocca l\'icona a cuore per salvarli qui.'
                  : 'Quando osservi un evento nel cielo, tocca "L\'ho visto! 🌟" nella scheda di dettaglio.'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: THEME.spacing.md,
  },
  userCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E2333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  userStatus: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  authToggleBtn: {
    backgroundColor: 'rgba(230, 57, 70, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(230, 57, 70, 0.3)',
  },
  authToggleText: {
    color: THEME.colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  authForm: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
  },
  authFormTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#0B0D17',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  submitBtn: {
    backgroundColor: THEME.colors.accent,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  switchModeBtn: {
    marginTop: 10,
    alignItems: 'center',
  },
  switchModeText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: THEME.colors.surfaceBorder,
  },
  tabsSwitcher: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  tabSwitchItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabSwitchItemActive: {
    backgroundColor: '#1E2333',
  },
  tabSwitchText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  tabSwitchTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyState: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 260,
    lineHeight: 18,
  },
});
