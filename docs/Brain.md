# Winter Arc App --- Brain

## 1. Product Identity

The Winter Arc App is a personal 90-day execution system built around
five pillars:

1.  Home resistance training
2.  Budget-conscious vegetarian muscle-gain nutrition
3.  Sleep and recovery
4.  Daily movement/walking
5.  Habit, progress, and weekly accountability tracking

The app should turn the Winter Arc plan into small, executable daily
actions rather than presenting a long fitness document.

## 2. Source of Truth

The original Winter Arc protocol is a 90--120 day high-discipline
framework focused on hypertrophy, cognitive discipline, progressive
overload, nutrition, recovery, and habit execution.

The user's adapted version has these constraints:

-   Monday--Saturday office schedule
-   Leave home around 8:30 AM
-   Return around 8:30 PM
-   Home workouts only; no gym required
-   Morning training is the primary training window
-   Evening around 9 PM is for walking or occasional running
-   Low-budget vegetarian nutrition
-   Sunday is the main rest, meal-prep, and weekly-review day

The app must prioritize the adapted plan over the original gym-based
schedule.

## 3. Core Product Philosophy

### Execution over information

Every screen should answer one of these questions:

-   What do I need to do now?
-   What have I completed today?
-   What should I eat next?
-   What workout do I perform?
-   Am I progressing?
-   What should I improve this week?

### Consistency over perfection

A missed task should not reset the user's progress.

The app should never use shame-based language.

Use:

-   "Missed"
-   "Skipped"
-   "Recovery day"
-   "Resume today"

Avoid:

-   "Failure"
-   "You ruined your streak"
-   "Weak"
-   "Lazy"

### Minimum viable day

When the user is exhausted after work, the app should support a reduced
version of the plan.

Example:

-   10-minute mobility
-   short walk
-   one protein-focused meal
-   sleep on time

The goal is continuity.

## 4. 90-Day Model

The product uses three phases:

### Phase 1 --- Foundation

Days 1--30

Focus:

-   Establish routine
-   Learn movement technique
-   Establish food consistency
-   Establish sleep schedule
-   Start tracking weight and measurements
-   Reduce unnecessary scrolling

### Phase 2 --- Progression

Days 31--60

Focus:

-   Progressive overload
-   More consistent deep work
-   Improved training capacity
-   Maintain calorie surplus
-   Improve recovery

### Phase 3 --- Consolidation

Days 61--90

Focus:

-   Maintain progressive overload
-   Review body-weight and waist trends
-   Compare photos
-   Review strength progression
-   Establish sustainable long-term habits

## 5. Daily Operating Model

Default weekday:

-   5:15 AM --- wake
-   5:35--6:20 AM --- home workout
-   6:20--7:00 AM --- cool down, bath
-   7:00 AM --- breakfast
-   8:30 AM --- leave for office
-   10:30 AM --- snack
-   1:30 PM --- lunch
-   5:00 PM --- snack
-   8:30 PM --- return home
-   8:45 PM --- dinner
-   9:15 PM --- walk
-   9:45 PM --- prepare for next day
-   10:15 PM --- reduce phone use
-   10:30 PM --- sleep

This schedule must be editable in settings.

## 6. Training Model

No gym dependency.

Equipment assumption:

-   Bodyweight
-   Backpack
-   Household items that can safely provide load

Training days:

-   Monday --- Push + Legs
-   Tuesday --- Pull + Posterior Chain
-   Wednesday --- Light Recovery
-   Thursday --- Upper Body
-   Friday --- Legs + Core
-   Saturday --- Full Body
-   Sunday --- Rest

The app must support:

-   Exercise instructions
-   Sets
-   Reps
-   Rest timer
-   RIR
-   Weight/load
-   Notes
-   Completion state
-   Progress history

## 7. Progressive Overload Logic

The user should record every working set.

Progression can happen through:

-   More reps
-   More backpack load
-   Harder variation
-   Better control
-   Slower eccentric

Do not automatically increase difficulty every week.

Progression should depend on the previous performance and the user's
selected progression rule.

## 8. Nutrition Model

The app is not a calorie-counting punishment system.

Primary nutrition goals:

-   Adequate calories
-   Adequate protein
-   Vegetarian foods
-   Low cost
-   Easy meal preparation
-   Office-friendly meals/snacks

Core food categories:

-   Soya chunks
-   Dal
-   Chana
-   Rajma
-   Moong
-   Milk
-   Curd
-   Peanuts
-   Roasted chana
-   Besan
-   Rice
-   Roti
-   Oats/muesli
-   Bananas
-   Seasonal vegetables

The user should be able to create meals from ingredients already
available at home.

## 9. Tracking

Daily:

-   Workout
-   Protein target
-   Meals
-   Water
-   Sleep
-   Steps/walk
-   Mood/energy
-   Optional screen-time entry

Weekly:

-   Average body weight
-   Waist
-   Training adherence
-   Protein adherence
-   Average sleep
-   Average steps
-   Strength progress
-   Weekly notes

Every 14 days:

-   Progress photos

## 10. Scoring

Avoid a single "fitness score" that pretends to measure health
precisely.

Instead show category completion:

-   Training
-   Nutrition
-   Recovery
-   Movement
-   Routine

Show percentage completion for the selected week, with clear
definitions.

## 11. Safety Rules

The app should not encourage:

-   Extreme dieting
-   Dangerous dehydration
-   Training through significant pain
-   Compulsive exercise
-   Excessive supplement use
-   Sleep deprivation to wake earlier
-   Extreme cold exposure

If pain, injury, illness, dizziness, or unusual symptoms are logged, the
app should recommend reducing/pausing the relevant activity and
considering professional medical advice.

## 12. Product Tone

Visual and language direction:

-   Dark
-   Focused
-   Minimal
-   Tactical
-   Calm
-   Non-judgmental
-   Data-driven

The app can feel intense without becoming aggressive or toxic.

## 13. MVP Priority

P0:

1.  Onboarding
2.  Today's dashboard
3.  Workout
4.  Meal/nutrition checklist
5.  Sleep tracking
6.  Walking/steps
7.  Weight tracking
8.  Weekly review
9.  90-day phase progress

P1:

-   Grocery list
-   Budget tracker
-   Exercise history
-   Progress photos
-   Reminders
-   Rest timer

P2:

-   Analytics
-   Custom workouts
-   Custom meals
-   Export
-   Cloud sync
-   Advanced charts
