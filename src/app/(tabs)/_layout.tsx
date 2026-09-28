import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect } from 'expo-router';
import type { ColorValue } from 'react-native';
import { Tabs } from 'expo-router/tabs';
import type { IconName } from '../../components/ui';
import { useProfile } from '../../state/profile';
import { colors } from '../../theme';

const icon = (name: IconName) => ({ color, size }: { color: ColorValue; size: number }) => <Ionicons name={name} color={color} size={size} />;

export default function TabsLayout() {
  const { profile } = useProfile();
  if (!profile) return <Redirect href="/onboarding" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarStyle: {
          position: 'absolute', left: 12, right: 12, bottom: 12, height: 64, paddingTop: 6, paddingBottom: 6,
          backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderTopWidth: 1, borderRadius: 20,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: icon('sunny-outline') }} />
      <Tabs.Screen name="workout" options={{ title: 'Workout', tabBarIcon: icon('barbell-outline') }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: icon('ellipsis-horizontal') }} />
    </Tabs>
  );
}
