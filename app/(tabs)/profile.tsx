import React from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { OfflineBanner } from '../../components/OfflineBanner';
import { EventCard } from '../../components/EventCard';
import { useProfile } from '../../hooks/useProfile';
import { profileStyles as styles } from '../../styles/profile.styles';

export default function ProfileScreen() {
  const {
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
    currentList,
    onRefresh,
    handleAuth,
    handleVerifyOtp,
    handleSignOut,
    handleOpenDetail,
  } = useProfile();

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

          {/* Form Login / Signup / OTP a scomparsa */}
          {showAuthCard && !userEmail && (
            <View style={styles.authForm}>
              <Text style={styles.authFormTitle}>
                {isAuthMode === 'login'
                  ? 'Accedi a Supabase'
                  : isAuthMode === 'signup'
                  ? 'Crea Nuovo Account'
                  : 'Verifica Codice Email'}
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

              {isAuthMode === 'otp' ? (
                <>
                  <TextInput
                    placeholder="Codice a 6 cifre (es. 854120)"
                    placeholderTextColor={THEME.colors.textMuted}
                    value={otpInput}
                    onChangeText={setOtpInput}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleVerifyOtp}
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitBtnText}>Verifica ed Entra</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setIsAuthMode('login')}
                    style={styles.switchModeBtn}
                  >
                    <Text style={styles.switchModeText}>Torna al Login</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
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

                  <TouchableOpacity
                    onPress={() => setIsAuthMode('otp')}
                    style={[styles.switchModeBtn, { marginTop: 4 }]}
                  >
                    <Text style={[styles.switchModeText, { color: THEME.colors.accent }]}>
                      Hai un codice di verifica? Clicca qui
                    </Text>
                  </TouchableOpacity>
                </>
              )}
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

        {/* Lista degli eventi salvati con Pull-To-Refresh */}
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
          contentContainerStyle={[
            styles.listContent,
            currentList.length === 0 && { flexGrow: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={THEME.colors.accent}
              colors={[THEME.colors.accent]}
            />
          }
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
