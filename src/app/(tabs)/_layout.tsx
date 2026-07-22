import { Tabs } from 'expo-router';
import { type ColorValue } from 'react-native';
import { theme, TrademyIcon, type TrademyIconName } from '@/design-system';

function tabIcon(name: TrademyIconName) {
  function TabBarIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return (
      <TrademyIcon
        name={name}
        color={typeof color === 'string' ? color : theme.colors.textMuted}
        size={24}
        strokeWidth={focused ? 2.4 : 2}
      />
    );
  }
  TabBarIcon.displayName = `TabBarIcon(${name})`;
  return TabBarIcon;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        sceneStyle: { backgroundColor: theme.colors.background },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Accueil', tabBarIcon: tabIcon('home') }}
      />
      <Tabs.Screen
        name="parcours"
        options={{ title: 'Parcours', tabBarIcon: tabIcon('learn') }}
      />
      <Tabs.Screen
        name="apprendre"
        options={{ title: 'Apprendre', tabBarIcon: tabIcon('library') }}
      />
      <Tabs.Screen
        name="revisions"
        options={{ title: 'Réviser', tabBarIcon: tabIcon('refresh') }}
      />
      <Tabs.Screen
        name="profil"
        options={{ title: 'Profil', tabBarIcon: tabIcon('profile') }}
      />

      {/* Écrans conservés, accessibles par navigation, mais hors barre d'onglets.
          Le Laboratoire est désormais une entrée du hub « Apprendre » (plus un onglet). */}
      <Tabs.Screen name="laboratoire" options={{ href: null }} />
      <Tabs.Screen name="lecons" options={{ href: null }} />
      <Tabs.Screen name="quiz" options={{ href: null }} />
    </Tabs>
  );
}
