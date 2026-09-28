# Winter Arc App --- Architecture

## 1. Architecture Goal

Build a maintainable mobile-first application that can run locally for
MVP and later support authentication, cloud sync, analytics, and
notifications.

The architecture must keep:

-   UI
-   domain logic
-   persistence
-   notification logic
-   nutrition/workout content

separate.

## 2. Recommended High-Level Architecture

``` text
Mobile App
   |
   +-- Presentation
   |     +-- Screens
   |     +-- Components
   |     +-- Navigation
   |
   +-- Application
   |     +-- Use Cases
   |     +-- Daily Plan
   |     +-- Progression
   |     +-- Weekly Review
   |
   +-- Domain
   |     +-- Workout
   |     +-- Nutrition
   |     +-- Recovery
   |     +-- Progress
   |     +-- 90-Day Plan
   |
   +-- Data
         +-- Local Storage
         +-- Repositories
         +-- Sync API (future)
```

## 3. Suggested Technology

For a mobile-first MVP:

-   React Native
-   Expo
-   TypeScript
-   React Navigation or Expo Router
-   Local persistence using SQLite or a reliable local database layer

Backend can be added later:

-   Node.js
-   Express
-   MongoDB

The MVP should not require a backend.

## 4. Feature Modules

``` text
src/
  app/
  components/
  features/
    onboarding/
    dashboard/
    workout/
    nutrition/
    movement/
    recovery/
    progress/
    weeklyReview/
    roadmap/
    settings/
  domain/
    workout/
    nutrition/
    progress/
    schedule/
  data/
    local/
    repositories/
  services/
    notifications/
    calculations/
  assets/
  theme/
```

## 5. Domain Entities

### UserProfile

``` ts
type UserProfile = {
  id: string;
  name?: string;
  startDate: string;
  goal: "muscle_gain" | "recomposition";
  diet: "vegetarian";
  equipment: string[];
  wakeTime: string;
  leaveHomeTime: string;
  returnHomeTime: string;
  sleepTargetMinutes: number;
};
```

### WorkoutSession

``` ts
type WorkoutSession = {
  id: string;
  date: string;
  workoutType: string;
  status: "planned" | "in_progress" | "completed" | "skipped";
  exercises: ExerciseLog[];
  notes?: string;
};
```

### ExerciseLog

``` ts
type ExerciseLog = {
  exerciseId: string;
  sets: SetLog[];
};
```

### SetLog

``` ts
type SetLog = {
  setNumber: number;
  reps: number;
  loadKg: number;
  rir?: number;
  completed: boolean;
};
```

### MealLog

``` ts
type MealLog = {
  id: string;
  date: string;
  mealType: "breakfast" | "snack" | "lunch" | "pre_workout" | "dinner";
  name: string;
  completed: boolean;
};
```

### BodyMetric

``` ts
type BodyMetric = {
  date: string;
  weightKg?: number;
  waistCm?: number;
  notes?: string;
};
```

### RecoveryLog

``` ts
type RecoveryLog = {
  date: string;
  sleepMinutes: number;
  energy?: number;
  soreness?: number;
};
```

## 6. Plan Engine

The plan engine converts:

`UserProfile + StartDate + Schedule`

into:

`DailyPlan`

Example:

``` ts
type DailyPlan = {
  dayNumber: number;
  phase: 1 | 2 | 3;
  date: string;
  workout?: string;
  meals: string[];
  movement: MovementTarget;
  recovery: RecoveryTarget;
};
```

## 7. Phase Calculation

``` text
Day 1–30   → Foundation
Day 31–60  → Progression
Day 61–90  → Consolidation
```

The app should calculate the phase from the user's selected start date.

Do not hard-code calendar dates.

## 8. Progressive Overload Service

Input:

-   Previous sets
-   Current sets
-   Exercise progression rule
-   User preference

Output:

-   No change
-   Rep increase suggestion
-   Load increase suggestion
-   Variation suggestion

Example:

``` text
Previous: 12 / 12 / 11
Target: 8–15

Suggestion:
Keep load and attempt 13 / 12 / 12.
```

Do not automatically modify the user's workout.

## 9. Nutrition Service

Inputs:

-   Dietary preference
-   Budget
-   Meal preferences
-   Ingredients available

Outputs:

-   Meal suggestions
-   Grocery list
-   Meal-prep plan

The nutrition engine should be configurable and should not claim medical
precision.

## 10. Persistence

MVP:

``` text
Local Database
   |
   +-- profile
   +-- workouts
   +-- sets
   +-- meals
   +-- body_metrics
   +-- recovery
   +-- movement
   +-- weekly_reviews
   +-- settings
```

All writes should be transactional where supported.

## 11. Future Backend

When cloud sync is needed:

``` text
React Native App
       |
       v
API
       |
       +-- Auth
       +-- User
       +-- Workout
       +-- Nutrition
       +-- Progress
       |
       v
MongoDB
```

The client should communicate through repository interfaces so local
storage can later be replaced or supplemented by an API.

## 12. Notification Architecture

Notification service receives events:

``` text
WorkoutReminder
MealReminder
WalkReminder
SleepReminder
WeeklyReviewReminder
```

Users can enable/disable each notification.

No notification should be mandatory.

## 13. Offline-First Requirement

The main app should work without internet:

-   View today's plan
-   Start workout
-   Log sets
-   Log meals
-   Log sleep
-   Log body metrics
-   View history

Sync can happen later.

## 14. Data Integrity

Never overwrite historical workout data when a plan changes.

Plans are templates.

Logs are immutable historical records except for explicit user edits.

## 15. Privacy

Health/fitness information is personal data.

MVP should:

-   Store only required data
-   Avoid unnecessary analytics
-   Avoid selling/sharing personal data
-   Provide data export/delete functionality when cloud storage is
    introduced

## 16. Testing Strategy

### Unit tests

-   Phase calculation
-   Daily plan generation
-   Progressive overload suggestions
-   Weekly averages
-   Adherence calculations

### Component tests

-   Workout card
-   Set logger
-   Meal card
-   Progress card
-   Weekly review

### End-to-end

Critical path:

`Onboarding → Dashboard → Workout → Log Sets → Complete → Weekly Review`

## 17. Performance

Avoid:

-   Loading entire workout history on every screen
-   Re-rendering all charts on every set entry
-   Large image assets
-   Network requests for local data

Use pagination or aggregation for long-term history.

## 18. Architecture Principles

1.  Local-first
2.  Feature-based modules
3.  Typed domain models
4.  No business logic inside UI components
5.  Repository abstraction for persistence
6.  User-editable schedules
7.  Historical logs preserved
8.  Graceful offline behavior
9.  Accessible UI
10. Simple MVP before backend complexity
