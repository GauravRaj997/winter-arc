# ❄️ Winter Arc

**A 90-day home-workout and habit tracker that turns a transformation plan into one clear daily checklist.**

Built for people with long office days, no gym, and a tight vegetarian food budget. Open the app, see today's plan, train, tick it off, and you're done.

![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- **90-day plan engine**: three 30-day phases (*Foundation → Progression → Consolidation*) with a day counter and phase arc.
- **Today dashboard**: today's day number, phase, a timed schedule built around your wake, commute and sleep times, and a completion ring.
- **Home workouts**: a weekly split (push/legs, pull/posterior, upper, legs/core, full body, recovery) using bodyweight, a chair, or a backpack. If you don't have a piece of equipment, the app swaps in an alternative exercise.
- **Focus-mode workout logger**: one set at a time, with reps/hold logging, a rest timer, and beeps at set start, at the end of rest, and when you finish.
- **Progressive overload suggestions**: based on your last session, the app suggests more reps, then more load, a harder variation, or a slower tempo. You decide whether to apply it.
- **Minimal day mode**: a reduced checklist for bad days, so you keep the streak without burning out.
- **90-day map**: a grid showing how much of each day you completed.
- **Safety first**: "Pain or feeling unwell?" lets you end the session straight away.
- **Offline & private**: all data stays on the device (AsyncStorage). No account and no server.

## 📱 Screens

| Tab | What it does |
|---|---|
| **Onboarding** | Name, start date, weight, goal, training days, equipment, diet, and daily timings |
| **Today** | Phase, day number, schedule, and task checklist |
| **Workout** | Start → focus-mode sets → rest timer → complete / skip |
| **More** | Edit profile and reset data |

## 🚀 Getting Started

**Prerequisites:** Node.js 20+ and the [Expo Go](https://expo.dev/go) app on your phone, or an Android/iOS simulator.

```bash
git clone https://github.com/GauravRaj997/winter-arc.git
cd winter-arc
npm install
npm start
```

Then scan the QR code with Expo Go, or press `a` (Android), `i` (iOS) or `w` (web).

### Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run android` / `ios` / `web` | Open the app on a specific platform |
| `npm test` | Run the domain unit tests (Node's built-in test runner) |
| `npm run typecheck` | Type-check with `tsc` |

### Build an Android APK

```bash
npx eas build -p android --profile preview
```

## 🗂️ Project Structure

```
src/
├── app/          # Screens (expo-router): onboarding, (tabs)/today, workout, more
├── components/   # UI: ProgressRing, PhaseArc, DayMap, FocusSet, RestTimer, ...
├── domain/       # Pure logic: plan, schedule, workouts, progression, session, time
├── data/         # Repository over a key-value store (AsyncStorage)
├── state/        # React context + hooks
├── services/     # Audio beeper
└── theme.ts      # Design tokens
docs/             # PRD, architecture, design system, and more
```

The domain layer has no dependencies on React or storage, so it's unit-tested directly with `node --test`.

## 📚 Docs

- [Product Requirements](docs/PRD.md)
- [Architecture](docs/Architecture.md)
- [Design System](docs/Design_system.md)

## ⚠️ Disclaimer

Winter Arc is a personal habit and training tool, not medical advice. Check with a doctor before starting a new exercise program, and stop if something hurts.

## 📄 License

[MIT](LICENSE) © Gaurav Raj
