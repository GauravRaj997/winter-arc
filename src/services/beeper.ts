import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

// ponytail: one app-lifetime player, never released; fine for a single short cue.
let player: AudioPlayer | undefined;

const getPlayer = () => {
  if (!player) {
    player = createAudioPlayer(require('../../assets/beep.wav'));
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }
  return player;
};

/** Play `times` short beeps. Audio failures never interrupt logging. */
export function beep(times: number, gapMs = 400) {
  for (let i = 0; i < times; i++) {
    setTimeout(() => {
      try {
        const p = getPlayer();
        p.seekTo(0);
        p.play();
      } catch {}
    }, i * gapMs);
  }
}
