import { Tabs } from 'expo-router';
import { type ColorValue } from 'react-native';
import { theme, TrademyIcon, type TrademyIconName } from '@/design-system';
import { PRIMARY_SPACES, HIDDEN_TAB_ROUTES } from '@/lib/navigation';

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
      {PRIMARY_SPACES.map((space) => (
        <Tabs.Screen
          key={space.name}
          name={space.name}
          options={{ title: space.title, tabBarIcon: tabIcon(space.icon) }}
        />
      ))}

      {/* Écrans conservés, accessibles par navigation, hors barre d'onglets.
          Réviser est intégré à l'Accueil / au Profil (accès rapide). */}
      {HIDDEN_TAB_ROUTES.map((name) => (
        <Tabs.Screen key={name} name={name} options={{ href: null }} />
      ))}
    </Tabs>
  );
}
