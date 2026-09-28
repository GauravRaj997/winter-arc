import { useState } from 'react';
import { View } from 'react-native';
import { sleepMinutes, validateProfile, type Equipment, type ProfileErrors, type UserProfile } from '../domain/profile';
import { isValidTime, WEEKDAY_SHORT } from '../domain/time';
import { beep } from '../services/beeper';
import { colors, space } from '../theme';
import { Banner, Button, Card, Chip, Field, Row, Txt } from './ui';

const EQUIPMENT: { id: Equipment; label: string }[] = [
  { id: 'bodyweight', label: 'Bodyweight' },
  { id: 'backpack', label: 'Backpack' },
  { id: 'chair', label: 'Sturdy chair' },
];

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/** Shared by onboarding and settings: editing times regenerates the schedule. */
export function ProfileForm({ initial, submitLabel, onSubmit }: {
  initial: UserProfile; submitLabel: string; onSubmit: (p: UserProfile) => Promise<void>;
}) {
  const [p, setP] = useState(initial);
  const [weight, setWeight] = useState(String(initial.startWeightKg || ''));
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof UserProfile>(k: K, v: UserProfile[K]) => setP((x) => ({ ...x, [k]: v }));

  const submit = async () => {
    const next = { ...p, name: p.name?.trim() || undefined, startWeightKg: Number(weight.replace(',', '.')) };
    const e = validateProfile(next);
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    setSaveError(false);
    try { await onSubmit(next); } catch { setSaveError(true); } finally { setSaving(false); }
  };

  const hours = isValidTime(p.bedTime) && isValidTime(p.wakeTime) ? sleepMinutes(p) / 60 : undefined;

  return (
    <View style={{ gap: space.lg }}>
      <Card>
        <Txt variant="h3">About you</Txt>
        <Field label="Name or nickname (optional)" value={p.name ?? ''} onChangeText={(v) => set('name', v)} autoCapitalize="words" />
        <Row style={{ alignItems: 'flex-start' }}>
          <Field label="Start date" value={p.startDate} onChangeText={(v) => set('startDate', v)} error={errors.startDate} hint="YYYY-MM-DD" autoCapitalize="none" />
          <Field label="Current weight (kg)" value={weight} onChangeText={setWeight} error={errors.startWeightKg} keyboardType="decimal-pad" />
        </Row>
        <Txt variant="caption">Goal</Txt>
        <Row>
          <Chip label="Muscle gain" selected={p.goal === 'muscle_gain'} onPress={() => set('goal', 'muscle_gain')} />
          <Chip label="Recomposition" selected={p.goal === 'recomposition'} onPress={() => set('goal', 'recomposition')} />
        </Row>
      </Card>

      <Card>
        <Txt variant="h3">Training</Txt>
        <Txt variant="caption">Training days · the home split: Mon Push + Legs, Tue Pull, Wed Recovery, Thu Upper, Fri Legs + Core, Sat Full Body</Txt>
        <Row>
          {[1, 2, 3, 4, 5, 6, 0].map((d) => (
            <Chip key={d} label={WEEKDAY_SHORT[d]} selected={p.trainingDays.includes(d)} disabled={d === 0}
              onPress={() => set('trainingDays', toggle(p.trainingDays, d))} />
          ))}
        </Row>
        <Txt variant="caption">Available equipment · missing items get a bodyweight alternative</Txt>
        <Row>
          {EQUIPMENT.map((e) => (
            <Chip key={e.id} label={e.label} selected={p.equipment.includes(e.id)} onPress={() => set('equipment', toggle(p.equipment, e.id))} />
          ))}
        </Row>
        {errors.equipment && <Txt variant="caption" color={colors.danger}>{errors.equipment}</Txt>}
        <Txt variant="caption">Workout beeps · at start, when rest ends, and at finish</Txt>
        <Row>
          {[0, 3, 4, 5].map((n) => (
            <Chip key={n} label={n ? `${n} beeps` : 'Off'} selected={(p.beeps ?? 3) === n} onPress={() => { set('beeps', n); beep(n); }} />
          ))}
        </Row>
      </Card>

      <Card>
        <Txt variant="h3">Food</Txt>
        <Row>
          <Chip label="Vegetarian" selected onPress={() => {}} />
        </Row>
        <Txt variant="caption">Budget</Txt>
        <Row>
          <Chip label="Low" selected={p.budget === 'low'} onPress={() => set('budget', 'low')} />
          <Chip label="Moderate" selected={p.budget === 'moderate'} onPress={() => set('budget', 'moderate')} />
        </Row>
      </Card>

      <Card>
        <Txt variant="h3">Daily schedule</Txt>
        <Txt variant="caption">24h format. Your whole day is generated from these four times.</Txt>
        <Row style={{ alignItems: 'flex-start' }}>
          <Field label="Wake" value={p.wakeTime} onChangeText={(v) => set('wakeTime', v)} error={errors.wakeTime} keyboardType="numbers-and-punctuation" />
          <Field label="Leave for office" value={p.leaveHomeTime} onChangeText={(v) => set('leaveHomeTime', v)} error={errors.leaveHomeTime} keyboardType="numbers-and-punctuation" />
        </Row>
        <Row style={{ alignItems: 'flex-start' }}>
          <Field label="Back home" value={p.returnHomeTime} onChangeText={(v) => set('returnHomeTime', v)} error={errors.returnHomeTime} keyboardType="numbers-and-punctuation" />
          <Field label="Bedtime" value={p.bedTime} onChangeText={(v) => set('bedTime', v)} error={errors.bedTime} keyboardType="numbers-and-punctuation" />
        </Row>
        {hours !== undefined && (
          <Txt variant="caption" color={hours < 7 ? colors.warning : colors.muted}>
            Sleep window: {hours.toFixed(1)} h{hours < 7 ? ' · most adults recover better with 7–9 h' : ''}
          </Txt>
        )}
      </Card>

      {Object.keys(errors).length > 0 && <Banner tone="error"><Txt>Check the highlighted fields.</Txt></Banner>}
      {saveError && <Banner tone="error"><Txt>Couldn't save. Try again.</Txt></Banner>}
      <Button label={saving ? 'Saving…' : submitLabel} onPress={submit} disabled={saving} />
    </View>
  );
}
