# Winter Arc App --- Agent Instructions

## 1. Mission

Build the Winter Arc App as a practical mobile-first personal execution
system.

The implementation must follow:

-   `Brain.md` for product behavior and principles
-   `PRD.md` for requirements
-   `Design_system.md` for visual language
-   `Architecture.md` for technical structure

If these documents conflict, use this priority:

1.  Explicit user request
2.  PRD
3.  Brain
4.  Architecture
5.  Design system

## 2. Coding Principles

-   Use TypeScript.
-   Keep components small.
-   Keep business logic outside UI components.
-   Prefer reusable components.
-   Avoid duplicated logic.
-   Use clear names.
-   Avoid premature abstractions.
-   Do not add dependencies without a reason.
-   Do not add backend infrastructure to solve an MVP problem.

## 3. Product Principles

The app is about consistency.

Never implement mechanics that shame the user.

Do not:

-   Reset progress because of one missed day
-   Use negative motivational messages
-   Force workouts when the user reports significant pain
-   Force calorie targets without allowing adjustment
-   Make cold exposure mandatory
-   Make supplements mandatory

## 4. Source-of-Truth Rules

The original Winter Arc PDF contains a gym-based 5-day UL-PPL program,
high-discipline schedule, nutrition guidance, recovery recommendations,
and a 90-day roadmap.

The app's actual default plan is the adapted home-workout version:

-   Monday --- Push + Legs
-   Tuesday --- Pull + Posterior Chain
-   Wednesday --- Light Recovery
-   Thursday --- Upper Body
-   Friday --- Legs + Core
-   Saturday --- Full Body
-   Sunday --- Rest

Do not silently replace this with the original gym plan.

## 5. Schedule Rules

Default:

``` text
05:15  Wake
05:35  Workout
06:20  Finish
07:00  Breakfast
08:30  Leave home
10:30  Snack
13:30  Lunch
17:00  Snack
20:30  Home
20:45  Dinner
21:15  Walk
22:15  Phone down
22:30  Sleep
```

All times must be editable.

If the user changes office hours, regenerate the daily schedule rather
than editing every task manually.

## 6. Workout Implementation

Every exercise must have:

-   Stable ID
-   Name
-   Muscle group
-   Instructions
-   Equipment requirement
-   Difficulty
-   Rep range
-   Default sets
-   Progression rule

Example:

``` ts
{
  id: "push-up",
  name: "Push-up",
  equipment: "bodyweight",
  sets: 3,
  repMin: 8,
  repMax: 15
}
```

## 7. Progression Rules

Do not automatically increase load after every workout.

Use previous performance.

Suggested progression:

1.  Reach upper rep range with good form.
2.  Add a small load if possible.
3.  Return toward lower part of the rep range.
4.  Progress again.

For bodyweight exercises:

-   Add reps
-   Increase difficulty
-   Add backpack load
-   Increase controlled eccentric time

## 8. Workout UX Rules

The user should be able to log a set with minimal interaction.

Prioritize:

-   Large controls
-   Previous performance visibility
-   One-tap completion
-   Quick +/− controls
-   Rest timer

Never hide the workout behind several navigation layers.

## 9. Nutrition Rules

Default food suggestions must be:

-   Vegetarian
-   Budget-friendly
-   Commonly available in India
-   Simple to prepare
-   Suitable for office carry when possible

Prefer:

-   Soya chunks
-   Dal
-   Chana
-   Rajma
-   Moong
-   Milk
-   Curd
-   Peanuts
-   Roasted chana
-   Rice
-   Roti
-   Oats
-   Bananas
-   Seasonal vegetables

Do not assume paneer every day.

## 10. Nutrition Safety

Do not encode the original PDF's high-dose supplement recommendations as
automatic prescriptions.

In particular, do not make high-dose vitamin D, zinc, magnesium,
omega-3, or herbal supplements mandatory.

Creatine can be represented as an optional supplement.

The app should clearly separate:

-   Food
-   Optional supplements
-   Medical advice

## 11. Health/Safety UX

If the user enters:

-   severe pain
-   injury
-   dizziness
-   fainting
-   chest pain
-   unusual shortness of breath

do not provide an automated "push through it" instruction.

Instead display a calm safety message recommending stopping the activity
and seeking appropriate professional help when warranted.

## 12. Testing

Every new feature should include tests where practical.

At minimum test:

-   Date/phase calculations
-   Schedule generation
-   Workout completion
-   Set logging
-   Progress calculations
-   Weekly averages
-   Data persistence

## 13. Git Workflow

Use small commits.

Recommended format:

``` text
feat: add daily dashboard
feat: add workout logger
feat: add weekly review
fix: preserve workout history
refactor: extract plan engine
test: add phase calculation tests
```

Do not combine unrelated changes in one commit.

## 14. Agent Workflow

Before coding:

1.  Read all five project documents.
2.  Inspect existing repository structure.
3.  Identify the smallest implementation slice.
4.  Implement it.
5.  Run tests/type checks.
6.  Check mobile layout.
7.  Report exactly what changed.

When modifying existing code:

-   Preserve working functionality.
-   Avoid broad rewrites unless explicitly requested.
-   Do not replace the architecture merely because another pattern is
    personally preferred.

## 15. Definition of Done

A feature is done when:

-   Requirement is implemented.
-   UI matches design system.
-   State persists correctly.
-   Empty/loading/error states exist.
-   Relevant tests pass.
-   No unrelated files are changed.
-   The feature works on a small mobile viewport.

## 16. First Build Order

Implement in this order:

### Phase 1

1.  App shell
2.  Theme
3.  Navigation
4.  Onboarding
5.  Local database

### Phase 2

6.  90-day plan engine
7.  Today dashboard
8.  Workout module
9.  Set logger
10. Rest timer

### Phase 3

11. Nutrition module
12. Grocery list
13. Movement
14. Sleep/recovery

### Phase 4

15. Progress charts
16. Weekly review
17. Roadmap
18. Notifications

### Phase 5

19. Polish
20. Accessibility
21. Tests
22. Performance review

## 17. Do Not Build Yet

Until explicitly requested, do not build:

-   Social feed
-   Leaderboards
-   Chat
-   AI coach
-   Payments
-   Marketplace
-   Complex backend
-   Wearable integrations
-   Public profiles

The core product should work extremely well as a personal offline-first
tracker first.
