# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Test Your Luck is a Vue 3 + TypeScript coin flip game with Firebase backend integration. Players predict coin outcomes and earn/lose MMR points, with real-time ranking system.

## Development Commands

### Core Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting (oxlint + eslint)
npm run lint

# Code formatting
npm run format

# Run unit tests
npm run test:unit

# Preview production build
npm run preview
```

### Testing
- Uses Vitest for unit testing with jsdom environment
- Test files: `src/components/__tests__/*.spec.ts`
- Run single test file: `npm run test:unit -- filename.spec.ts`

## Architecture & Project Structure

### Tech Stack
- **Frontend**: Vue 3 Composition API + TypeScript + Vite
- **State Management**: Pinia stores
- **Routing**: Vue Router 4
- **Database**: Firebase Firestore (planned)
- **Authentication**: Firebase Auth (planned)
- **Build Tool**: Vite with rolldown

### Current Structure
```
src/
├── components/           # Reusable components
│   ├── __tests__/       # Component tests
│   ├── icons/           # Icon components
│   └── *.vue           # Vue components
├── views/               # Page components (HomeView, AboutView)
├── stores/              # Pinia stores (counter.ts)
├── router/              # Vue Router configuration
└── assets/              # Static assets (CSS, images)
```

### Planned Game Architecture
Based on documentation, the final structure will include:
- `stores/game.ts` - Game state management (MMR, game results)
- `stores/user.ts` - User information management
- `stores/ranking.ts` - Ranking data management
- `services/firebase.ts` - Firebase configuration and services
- `utils/gameLogic.ts` - Core game logic functions
- Game components: GameBoard, CoinFlip, ScoreBoard, Ranking

## Code Conventions

### Vue 3 Guidelines
- Use `<script setup>` syntax with TypeScript
- Composition API with `ref`/`reactive` for reactivity
- Component communication through Pinia stores
- TypeScript strict mode enabled

### Naming Conventions
- Components: PascalCase (e.g., `GameBoard.vue`)
- Files: kebab-case (e.g., `game-logic.ts`)
- Variables/Functions: camelCase (e.g., `userScore`, `flipCoin()`)
- Constants: UPPER_SNAKE_CASE (e.g., `STARTING_MMR`)
- Types/Interfaces: PascalCase (e.g., `GameResult`)

### Game Logic Rules
- Starting MMR: 10,000 points
- Win/Loss: ±15-25 points (random)
- 50% coin flip probability
- Animation duration: 2-3 seconds
- Ranking requires minimum 10 games

## Firebase Integration Notes
When implementing Firebase features:
- Configure Firestore collections for user data and game results
- Use Firebase Auth with anonymous login
- Implement real-time listeners for ranking updates
- Never commit Firebase configuration to repository
- Use environment variables for sensitive data

## Development Workflow
- Commits use conventional format: `feat:`, `fix:`, `docs:`, etc.
- Small feature-based PRs preferred
- Code reviews required
- All tests must pass before merging