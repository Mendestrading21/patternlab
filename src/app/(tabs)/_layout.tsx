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
        name="lecons"
        options={{ title: 'Leçons', tabBarIcon: () => <TabIcon emoji="📚" /> }}
      />
      <Tabs.Screen
        name="quiz"
        options={{ title: 'Quiz', tabBarIcon: () => <TabIcon emoji="🎯" /> }}
      />
      <Tabs.Screen
        name="profil"
        options={{ title: 'Profil', tabBarIcon: () => <TabIcon emoji="🐂" /> }}
      />
    </Tabs>
  );
}
