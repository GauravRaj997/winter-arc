import { Redirect, router } from 'expo-router';
import { ProfileForm } from '../components/ProfileForm';
import { Screen, Txt } from '../components/ui';
import { DEFAULT_PROFILE } from '../domain/profile';
import { toDateKey } from '../domain/time';
import { useProfile } from '../state/profile';
import { colors } from '../theme';

export default function Onboarding() {
  const { profile, saveProfile } = useProfile();
  if (profile) return <Redirect href="/" />;
  return (
    <Screen>
      <Txt variant="caption" color={colors.primary}>WINTER ARC · 90 DAYS</Txt>
      <Txt variant="display">Set up your plan</Txt>
      <Txt color={colors.muted}>
        Home workouts, budget vegetarian food, sleep and daily walks — turned into small daily actions. Everything stays on this device and can be changed later.
      </Txt>
      <ProfileForm
        initial={{ ...DEFAULT_PROFILE, startDate: toDateKey(new Date()), startWeightKg: 0 }}
        submitLabel="Generate plan"
        onSubmit={async (p) => { await saveProfile(p); router.replace('/'); }}
      />
    </Screen>
  );
}
