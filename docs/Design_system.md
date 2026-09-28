# Winter Arc App --- Design System

## 1. Design Direction

The UI should feel like a personal performance console:

-   Dark
-   Minimal
-   High contrast
-   Technical
-   Calm
-   Focused
-   Premium without expensive visual effects

Avoid a military/aggressive aesthetic that makes the product feel
hostile.

## 2. Color Tokens

Use semantic tokens rather than hard-coded colors throughout components.

``` css
--color-bg: #080B12;
--color-surface: #111827;
--color-surface-2: #172033;
--color-border: #263247;

--color-text: #F5F7FA;
--color-text-muted: #9AA6B2;

--color-primary: #27B7FF;
--color-success: #35D07F;
--color-warning: #F5B942;
--color-danger: #FF5C67;

--color-phase-1: #27B7FF;
--color-phase-2: #F5B942;
--color-phase-3: #35D07F;
```

Do not use gradients as the primary visual language.

## 3. Typography

Recommended:

-   Font: Inter or system sans-serif
-   Display: 28--34 px
-   H1: 24--28 px
-   H2: 20--22 px
-   H3: 16--18 px
-   Body: 14--16 px
-   Caption: 12--13 px

Use weight to establish hierarchy instead of excessive font-size
changes.

## 4. Spacing

Use an 8-point spacing system:

-   4px --- micro
-   8px --- small
-   12px --- compact
-   16px --- standard
-   24px --- section
-   32px --- major
-   48px --- page separation

## 5. Radius

-   Small: 8px
-   Standard: 12px
-   Large: 16px
-   Pills: 999px

Cards should generally use 12--16px radius.

## 6. Core Components

### App Shell

Contains:

-   Header
-   Main content
-   Bottom navigation

### Bottom Navigation

MVP tabs:

1.  Today
2.  Workout
3.  Nutrition
4.  Progress
5.  More

### Progress Ring

Use for:

-   Daily completion
-   Phase completion

Never use it to imply medical or physiological accuracy.

### Task Card

Structure:

-   Icon
-   Task title
-   Short description
-   Status
-   Action

### Workout Exercise Card

Structure:

-   Exercise name
-   Target
-   Previous result
-   Current set controls
-   Rest timer
-   Complete button

### Metric Card

Show:

-   Metric
-   Current value
-   Trend
-   Time period

Example:

`Weight` `69.4 kg` `+0.3 kg / 7 days`

Do not use green/red as the only indication of whether a trend is
desirable.

### Phase Card

Show:

-   Phase number
-   Phase name
-   Days
-   Objective
-   Completion

## 7. Dashboard Layout

### Header

`Day 12 of 90`

`Foundation`

### Main

Large daily completion card.

Then:

-   Morning Workout
-   Nutrition
-   Evening Walk
-   Sleep
-   Quick Log

### Footer

Bottom navigation.

## 8. Workout UX

The workout screen should minimize typing.

Set row:

`Set 1 | 12 reps | 0 kg | RIR 2 | ✓`

Allow quick increment/decrement controls.

Previous performance should be visible without opening another screen.

## 9. Nutrition UX

Prefer visual meal cards:

`Breakfast` `Oats + Milk + Banana + Peanuts`

Status:

`Completed`

Budget information should be shown only when useful.

## 10. Empty States

Good:

> No workout logged yet. Start today's session when you're ready.

Bad:

> You haven't trained. Don't waste the day.

## 11. Error States

Errors should be concise and actionable.

Example:

> Couldn't save your workout. Try again.

Never delete entered data silently.

## 12. Accessibility

Minimum:

-   WCAG-aware contrast
-   Touch targets around 44px or larger
-   Screen-reader labels
-   No color-only status indicators
-   Reduced-motion support
-   Clear focus states

## 13. Motion

Use subtle motion only:

-   Completion check
-   Progress updates
-   Screen transitions

Avoid constant animated backgrounds.

## 14. Charts

Use simple line/bar charts.

Recommended:

-   Weight trend
-   Waist trend
-   Exercise load/reps
-   Weekly adherence

Always label:

-   Time range
-   Units
-   Data points

## 15. Dark Theme Rules

Dark mode is the primary theme.

Avoid pure black backgrounds when possible.

Use layered surfaces to establish hierarchy:

`Background → Surface → Elevated Surface → Modal`

## 16. Copy Style

Use short, practical language.

Good:

-   `Start Workout`
-   `Log Meal`
-   `Complete Walk`
-   `Review Week`
-   `Add Set`

Avoid:

-   `DOMINATE`
-   `NO EXCUSES`
-   `CRUSH YOUR LIMITS`

The product is disciplined, not hostile.
