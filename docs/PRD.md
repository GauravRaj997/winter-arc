# Winter Arc App --- Product Requirements Document

## 1. Product Summary

A personal 90-day Winter Arc execution app for a user with a full-time
office schedule, home-only workouts, and a limited vegetarian food
budget.

The product converts a 90-day plan into a daily workflow.

## 2. Problem

The source protocol contains many concepts, schedules, exercises,
nutrition targets, recovery rules, and milestones. A user following it
outside a gym environment needs a simpler operational system.

The user's constraints are:

-   Office Monday--Saturday
-   Leave at approximately 8:30 AM
-   Return at approximately 8:30 PM
-   Morning is the main workout window
-   Evening is suitable for walking/running
-   No gym
-   Low food budget
-   Vegetarian diet

## 3. Goals

### Primary goals

-   Make the daily plan executable in under one minute of planning.
-   Make home workouts easy to follow.
-   Track progressive overload.
-   Make budget nutrition practical.
-   Track 90-day progress.
-   Provide a weekly review loop.

### Non-goals

-   Medical diagnosis
-   Personalized medical treatment
-   Professional bodybuilding coaching
-   Social fitness network
-   Marketplace
-   Gym booking

## 4. Target User

Primary user:

-   Adult
-   Beginner/intermediate resistance training
-   Works Monday--Saturday
-   Limited time
-   Home workout
-   Vegetarian
-   Budget conscious
-   Wants muscle gain and weight gain
-   Wants structure and accountability

## 5. Core User Journey

### First launch

1.  Welcome
2.  Set 90-day start date
3.  Enter body weight
4.  Select goal
5.  Select available equipment
6.  Select dietary pattern
7.  Set approximate office schedule
8.  Choose reminder preferences
9.  Generate plan
10. Open Today's Dashboard

### Daily journey

1.  Open dashboard
2.  See current phase and today's tasks
3.  Start workout
4.  Record sets
5.  Complete meals/checklist
6.  Log walk
7.  Log sleep
8.  Finish day

### Weekly journey

1.  Open Weekly Review
2.  See adherence
3.  Enter average weight
4.  Enter waist measurement
5.  Review strength
6.  Review missed tasks
7.  Set next week's focus

## 6. Functional Requirements

### FR-001 Onboarding

The system shall collect:

-   Name/nickname
-   Start date
-   Current weight
-   Goal
-   Training days
-   Available equipment
-   Dietary preference
-   Budget preference
-   Typical wake time
-   Office departure time
-   Office return time
-   Sleep target

### FR-002 Daily Dashboard

Display:

-   Current day number
-   Current phase
-   Today's workout
-   Next meal
-   Walk target
-   Sleep target
-   Completion progress
-   Quick log buttons

### FR-003 Workout

The workout screen shall support:

-   Exercise name
-   Instructions
-   Sets
-   Reps
-   Load
-   RIR
-   Rest timer
-   Previous performance
-   Current performance
-   Notes
-   Complete/skip

### FR-004 Progressive Overload

The system shall show the previous performance for each exercise.

It may suggest progression when the user consistently reaches the upper
end of the prescribed range.

Example:

Previous: `12, 12, 12`

Suggestion:
`Add a small amount of backpack weight and target 8–10 reps.`

The user must be able to override the suggestion.

### FR-005 Nutrition

The app shall provide:

-   Daily meal checklist
-   Budget-friendly vegetarian meal suggestions
-   Ingredient list
-   Simple recipes
-   Protein-oriented meal suggestions
-   Office snack suggestions
-   Meal prep suggestions

### FR-006 Grocery List

Generate a weekly grocery list from selected meals.

Group items:

-   Protein
-   Carbohydrates
-   Vegetables
-   Fruits
-   Dairy
-   Pantry

Allow:

-   Quantity editing
-   Check-off
-   Remove item
-   Add item

### FR-007 Movement

Allow:

-   Step entry
-   Walk entry
-   Run entry
-   Duration
-   Distance
-   Notes

The user can manually enter data in MVP.

### FR-008 Recovery

Track:

-   Sleep duration
-   Bedtime
-   Wake time
-   Energy
-   Optional soreness

The system should not penalize users for taking recovery days.

### FR-009 Body Metrics

Track:

-   Weight
-   Waist
-   Optional chest/arm/thigh measurements
-   Progress photos

Charts should show trends, not judge the user.

### FR-010 Weekly Review

Display:

-   Training completion
-   Nutrition completion
-   Sleep average
-   Movement
-   Weight trend
-   Waist trend
-   Strength changes

Ask:

-   What went well?
-   What was difficult?
-   What should change next week?

### FR-011 90-Day Roadmap

Display:

-   Days 1--30
-   Days 31--60
-   Days 61--90
-   Current day
-   Phase progress
-   Milestones

## 7. Notification Requirements

Optional reminders:

-   Morning workout
-   Meal/snack
-   Evening walk
-   Sleep preparation
-   Weekly review

All notifications must be configurable.

## 8. Acceptance Criteria

A feature is complete when:

-   It works on mobile-sized screens.
-   It supports the user's schedule.
-   Data persists after app restart.
-   Empty states are handled.
-   Loading/error states are handled.
-   User can undo or edit logged data.
-   No core flow requires a paid service.

## 9. Success Metrics

Track product behavior, not health claims:

-   Daily completion rate
-   Weekly review completion
-   Workout logging frequency
-   Meal-plan usage
-   Number of active days
-   30/60/90-day retention

Do not define success as a specific body-weight or muscle-gain outcome.

## 10. MVP Release

MVP includes:

-   Onboarding
-   Dashboard
-   Workout tracker
-   Nutrition checklist
-   Grocery list
-   Walk tracker
-   Sleep tracker
-   Weight/waist tracker
-   Weekly review
-   90-day roadmap
-   Local persistence
