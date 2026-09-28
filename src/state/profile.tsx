import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { repo } from '../data';
import type { UserProfile } from '../domain/profile';

type ProfileState = {
  /** undefined = loading, null = not onboarded */
  profile: UserProfile | null | undefined;
  loadError: boolean;
  reload: () => void;
  saveProfile: (p: UserProfile) => Promise<void>;
  resetAll: () => Promise<void>;
};

const Ctx = createContext<ProfileState | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined);
  const [loadError, setLoadError] = useState(false);

  // A failed read must not look like "no profile", or onboarding would overwrite real data.
  const reload = useCallback(() => {
    setLoadError(false);
    repo.getProfile().then((p) => setProfile(p ?? null), () => setLoadError(true));
  }, []);
  useEffect(reload, [reload]);

  const saveProfile = async (p: UserProfile) => {
    await repo.saveProfile(p);
    setProfile(p);
  };
  const resetAll = async () => {
    await repo.clearAll();
    setProfile(null);
  };

  return <Ctx.Provider value={{ profile, loadError, reload, saveProfile, resetAll }}>{children}</Ctx.Provider>;
}

export function useProfile() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useProfile outside ProfileProvider');
  return v;
}
