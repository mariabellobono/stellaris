import { StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

export function getTabScreenOptions(bottomPadding: number, tabHeight: number) {
  return {
    tabBarActiveTintColor: THEME.colors.accent,
    tabBarInactiveTintColor: THEME.colors.textMuted,
    tabBarStyle: {
      backgroundColor: THEME.colors.tabBar,
      borderTopColor: THEME.colors.tabBarBorder,
      borderTopWidth: 1,
      height: tabHeight,
      paddingBottom: bottomPadding,
      paddingTop: 8,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600' as const,
    },
    headerStyle: {
      backgroundColor: THEME.colors.background,
      borderBottomColor: THEME.colors.tabBarBorder,
      borderBottomWidth: 1,
      shadowOpacity: 0,
      elevation: 0,
    },
    headerTintColor: THEME.colors.text,
    headerTitleStyle: {
      fontWeight: '800' as const,
      letterSpacing: 0.5,
      fontSize: 18,
    },
  };
}
