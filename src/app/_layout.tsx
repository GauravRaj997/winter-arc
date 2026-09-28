import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Banner, Button, Txt } from '../components/ui';
import { ProfileProvider, useProfile } from '../state/profile';
import { colors, space } from '../theme';

function Gate() {
  const { profile, loadError, reload } = useProfile();
  if (loadError) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: space.lg, gap: space.lg }}>
        <Banner tone="error"><Txt>Couldn't load your data. Nothing was deleted.</Txt></Banner>
        <Button label="Try again" onPress={reload} />
      </View>
    );
  }
  if (profile === undefined) {
    return <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center' }}><ActivityIndicator color={colors.primary} /></View>;
  }
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: colors.bg }}>
      <ProfileProvider>
        <StatusBar style="light" />
        <Gate />
      </ProfileProvider>
    </SafeAreaProvider>
  );
}
