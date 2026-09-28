import { router } from 'expo-router';
import { useState } from 'react';
import { ProfileForm } from '../../components/ProfileForm';
import { Banner, Button, Card, Screen, Txt } from '../../components/ui';
import { useProfile } from '../../state/profile';
import { colors } from '../../theme';

export default function More() {
  const { profile, saveProfile, resetAll } = useProfile();
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetError, setResetError] = useState(false);
  if (!profile) return null;

  return (
    <Screen>
      <Txt variant="display">Settings</Txt>
      <Txt color={colors.muted}>Change your times and the whole daily schedule regenerates. Past logs are never changed.</Txt>
      {saved && <Banner tone="info"><Txt>Saved. Today's plan is updated.</Txt></Banner>}
      <ProfileForm
        key={JSON.stringify(profile)}
        initial={profile}
        submitLabel="Save changes"
        onSubmit={async (p) => { await saveProfile(p); setSaved(true); }}
      />

      <Card>
        <Txt variant="h3">Your data</Txt>
        <Txt variant="caption">Everything is stored only on this device. Resetting deletes all logs and cannot be undone.</Txt>
        {resetError && <Txt color={colors.danger}>Couldn't reset. Try again.</Txt>}
        <Button
          label={confirmReset ? 'Tap again to delete everything' : 'Reset all data'}
          variant="danger"
          onPress={async () => {
            if (!confirmReset) return setConfirmReset(true);
            try { await resetAll(); router.replace('/onboarding'); } catch { setResetError(true); }
          }}
        />
        {confirmReset && <Button label="Cancel" variant="ghost" onPress={() => setConfirmReset(false)} />}
      </Card>
    </Screen>
  );
}
