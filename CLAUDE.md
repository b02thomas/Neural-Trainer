# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run tests in watch mode
npm run test:ui      # Run tests with Vitest UI
npm run test:coverage # Generate coverage report
```

## Architecture

### Core Game Logic (Stroop Test)

The app implements a cognitive training tool based on the Stroop Effect. The critical constraint: **word !== inkColor** (always guaranteed conflict).

**Answer Outcomes:**
- `success` - User correctly identified the ink color
- `impulse_error` - User read the word instead (classic Stroop interference)
- `wrong_choice` - Neither word nor ink color selected

**Color Unlock System:**
- Base colors: RED, BLUE, GREEN, YELLOW, BLACK
- Extra colors unlock at streak milestones (3, 6, 9, 12): PURPLE, ORANGE, PINK, CYAN
- Button positions shuffle when new color unlocks

### State Management

Zustand store at `stores/game-store.ts`:
- Game lifecycle: `idle` → `countdown` (3s) → `playing` → `paused` (feedback) → `finished`
- Persists last 100 rounds + best streak to localStorage (key: `stroop-game-storage`)

### Key Files

| File | Purpose |
|------|---------|
| `lib/stroop-generator.ts` | Challenge generation with word≠ink constraint |
| `hooks/use-timer.ts` | High-precision timer using `performance.now()` |
| `hooks/use-stroop-game.ts` | Orchestrates game store + timer |
| `stores/game-store.ts` | Zustand store with persistence |
| `types/game.ts` | TypeScript definitions (ColorName, StroopChallenge, etc.) |

### Authentication

- Supabase with Discord OAuth
- Middleware at `middleware.ts` handles role-based access
- Roles: `user`, `premium`, `admin`
- Protected routes: `/play`, `/stats` (premium+), `/admin` (admin only)

### Component Structure

```
components/
├── game/           # StroopDisplay, ColorButtons, TimerDisplay, FeedbackOverlay
├── ui/             # Base components (Button, Card, Progress) - shadcn pattern
├── navigation/     # MegaMenu
├── landing/        # Hero components
├── stats/          # Charts and statistics display
└── auth/           # Login components
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DISCORD_GUILD_ID=
DISCORD_PREMIUM_ROLE_ID=
```

## Testing

Tests are in `lib/__tests__/`. Key test: `stroop-generator.test.ts` validates the critical constraint (word≠inkColor) over 1000+ iterations.
