import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { theme } from '@/design-system';

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
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
        options={{ title: 'Accueil', tabBarIcon: () => <TabIcon emoji="🏠" /> }}
      />
      <Tabs.Screen
        name="parcours"
        options={{ title: 'Parcours', tabBarIcon: () => <TabIcon emoji="🗺️" /> }}
      />
      <Tabs.Screen
        name="apprendre"
        options={{ title: 'Apprendre', tabBarIcon: () => <TabIcon emoji="📚" /> }}
      />
      <Tabs.Screen
        name="revisions"
        options={{ title: 'Réviser', tabBarIcon: () => <TabIcon emoji="🔁" /> }}
      />
      <Tabs.Screen
        name="profil"
        options={{ title: 'Profil', tabBarIcon: () => <TabIcon emoji="🐂" /> }}
      />

      {/* Écrans conservés, accessibles par navigation, mais hors barre d'onglets.
          Le Laboratoire est désormais une entrée du hub « Apprendre » (plus un onglet). */}
      <Tabs.Screen name="laboratoire" options={{ href: null }} />
      <Tabs.Screen name="lecons" options={{ href: null }} />
      <Tabs.Screen name="quiz" options={{ href: null }} />
    </Tabs>
  );
}
