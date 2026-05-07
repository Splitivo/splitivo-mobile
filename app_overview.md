# Splitivo Mobile — Project Overview

## Table of Contents

1. [Project Summary](#1-project-summary)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Project Structure](#4-project-structure)
5. [Domain Layer — Entities](#5-domain-layer--entities)
6. [Data Layer](#6-data-layer)
7. [Presentation Layer — Stores](#7-presentation-layer--stores)
8. [Presentation Layer — Components](#8-presentation-layer--components)
9. [Screens](#9-screens)
10. [Theming & Design System](#10-theming--design-system)
11. [Configuration & Environment](#11-configuration--environment)
12. [Current Status & Roadmap](#12-current-status--roadmap)

---

## 1. Project Summary

**Splitivo** is a React Native (Expo) mobile application for splitting bills and expenses among groups. Its core value proposition is: _"Split smarter, transfer less."_

The app allows users to:

- **Scan receipts** (camera / OCR simulation) or **manually enter** bill items
- **Assign items** to individual participants with per-item granularity
- **Organize expenses** into **Trips** (group travel) or handle **Single Bills**
- **Optimize debt settlement** — minimizing the number of transfers using a greedy debt-reduction algorithm
- **Track spending analytics** by category and time period (daily / monthly / annually)
- **Manage currencies** with a full international currency database

---

## 2. Tech Stack

| Category         | Library / Version                                                         |
| ---------------- | ------------------------------------------------------------------------- |
| Framework        | Expo SDK 55, React 19.2, React Native 0.83.4                              |
| Language         | TypeScript ~5.9.2 (strict mode)                                           |
| Navigation       | expo-router ^55, @react-navigation/bottom-tabs                            |
| Styling          | NativeWind ^4.2.3, Tailwind CSS ^3.4.19                                   |
| State Management | Zustand ^5 (with `zustand/persist`)                                       |
| Animations       | react-native-reanimated 4.2.1, react-native-worklets 0.7.2                |
| Gestures         | react-native-gesture-handler                                              |
| Performance List | @shopify/flash-list                                                       |
| UI Effects       | expo-blur, expo-glass-effect (Liquid Glass iOS 26+), expo-linear-gradient |
| Icons            | expo-symbols, lucide-react-native, react-native-svg                       |
| Camera           | expo-camera, expo-image-picker                                            |
| Haptics          | expo-haptics                                                              |
| Persistence      | @react-native-async-storage/async-storage                                 |
| Build            | EAS Build (dev / smoke / prod profiles)                                   |

---

## 3. Architecture

The project follows **Clean Architecture** with three strict layers:

```
┌──────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│  app/ screens (expo-router)                          │
│  src/presentation/stores/ (Zustand)                  │
│  src/presentation/components/ (UI components)        │
├──────────────────────────────────────────────────────┤
│                   Domain Layer                       │
│  src/domain/entities/ (TypeScript interfaces/types)  │
│  src/domain/repositories/ (abstract contracts)       │
├──────────────────────────────────────────────────────┤
│                    Data Layer                        │
│  src/data/repositories/ (implementations)            │
│  src/data/datasources/ (Mock / Local / Remote)       │
│  src/data/mocks/ (JSON seed data)                    │
│  src/data/utils/ (shared helpers)                    │
└──────────────────────────────────────────────────────┘
```

- **Domain** entities are plain TypeScript interfaces — no framework dependency.
- **Repository interfaces** define contracts; the data layer provides implementations.
- **Presentation stores** call repository implementations directly (no use-case layer yet).
- The app is currently in **mock-only mode** — remote datasources exist as REST stubs but are not wired up.

---

## 4. Project Structure

```
splitivo-mobile/
├── app/                          # expo-router screen files
│   ├── _layout.tsx               # Root layout (ThemeProvider, Stack navigator)
│   ├── bill-type-selection-sheet.tsx
│   ├── currency-selection-sheet.tsx
│   ├── debug-sheet.tsx
│   ├── (auth)/                   # Unauthenticated flow
│   │   ├── welcome.tsx
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── verify-otp.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── index.tsx             # Home
│   │   ├── activity.tsx          # Bill feed
│   │   ├── expenses.tsx          # Analytics
│   │   └── profile.tsx           # User profile
│   ├── split/                    # Bill creation flow
│   │   ├── scan.tsx
│   │   ├── manual-entry.tsx
│   │   ├── confirm.tsx
│   │   └── result.tsx
│   └── trip/                     # Trip management
│       ├── create.tsx
│       └── [id]/
│           ├── index.tsx         # Trip detail
│           ├── add-bill.tsx
│           └── settle.tsx
├── src/
│   ├── core/
│   │   ├── config/               # Environment config (dev/smoke/prod)
│   │   └── theme/                # Color tokens, ThemeProvider, useTheme
│   ├── domain/
│   │   ├── entities/             # Bill, Trip, User, Expense, Currency, Scan
│   │   └── repositories/         # Repository interfaces (contracts)
│   ├── data/
│   │   ├── datasources/          # Mock, Local (JSON), Remote (stubs)
│   │   ├── repositories/         # Implementations delegating to datasources
│   │   ├── mocks/                # JSON seed data files
│   │   └── utils/                # simulateDelay, formatCurrency, formatDate
│   ├── hooks/
│   │   └── useLiquidGlass.ts     # iOS 26+ Liquid Glass detection
│   └── presentation/
│       ├── components/           # Shared UI components
│       └── stores/               # Zustand stores
├── assets/
├── ios/
├── app.json                      # Expo app configuration
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 5. Domain Layer — Entities

### `Bill`

The core data model. Represents a receipt/expense split among participants.

| Field                            | Type                 | Description                                 |
| -------------------------------- | -------------------- | ------------------------------------------- |
| `id`                             | `string`             | Unique bill identifier                      |
| `tripId`                         | `string?`            | Associated trip (optional for single bills) |
| `merchantName`                   | `string`             | Restaurant / store name                     |
| `date`                           | `string`             | ISO date string                             |
| `currency`                       | `string`             | Currency code (e.g. `"USD"`)                |
| `category`                       | `ExpenseCategory`    | Food, transport, etc.                       |
| `items`                          | `BillItem[]`         | Line items with assignment                  |
| `tax / serviceCharge / discount` | `number`             | Additional charges                          |
| `totalAmount`                    | `number`             | Computed total                              |
| `participants`                   | `Participant[]`      | People in this bill                         |
| `splitType`                      | `"single" \| "trip"` | Bill context                                |
| `status`                         | `BillStatus`         | `"pending" \| "partial" \| "settled"`       |
| `isFinalized`                    | `boolean`            | Locked for editing                          |

**`BillItem`**: `{ id, name, quantity, unitPrice, assignedTo: string[] }` — `assignedTo` holds participant IDs, enabling per-item splitting.

---

### `Trip`

Groups multiple bills for a travel event.

| Field                 | Type            | Description                       |
| --------------------- | --------------- | --------------------------------- |
| `id`                  | `string`        | Unique trip identifier            |
| `name`                | `string`        | Trip name (e.g. "Bali Trip 2026") |
| `startDate / endDate` | `string`        | ISO date strings                  |
| `currency`            | `string`        | Primary trip currency             |
| `participants`        | `Participant[]` | All trip members                  |
| `bills`               | `Bill[]`        | Hydrated bill objects             |
| `totalSpend`          | `number`        | Aggregate spend                   |
| `status`              | `TripStatus`    | `"active" \| "completed"`         |

---

### `User` & `Participant`

- **`User`**: registered user with `id, username, displayName, email?, phone?, avatarUrl?, baseCurrency, bankAccounts[]`
- **`Participant`**: union type — either a registered user (`isGuest: false`) or a `GuestParticipant` (`{ id, name, isGuest: true }`) for non-app users

---

### `Expense`

Lightweight analytics record: `{ id, billId, merchantName, category, amount, currency, date }`

### `ExpenseCategory`

`"food_dining" | "entertainment" | "transport" | "shopping" | "groceries" | "utilities" | "other"`

### `ScanResult`

OCR output structure: `{ merchantName, date, items[], tax, serviceCharge, total, currency }`

### `Currency`

Full currency metadata: `{ code, name, namePlural, symbol, symbolNative, decimalDigits, rounding }`

---

## 6. Data Layer

### Datasources

| Datasource                | Type        | Description                                                                                                                                                   |
| ------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MockBillDatasource`      | Mock        | In-memory bill CRUD. `getPersonBreakdown()` calculates per-item shares + distributes tax/serviceCharge/discount equally.                                      |
| `MockTripDatasource`      | Mock        | Holds trips + bills. `getOptimizedTransfers()` runs greedy debt-minimization: computes net balances, matches creditors to debtors to minimize transfer count. |
| `MockExpenseDatasource`   | Mock        | Filters by `TimePeriod`, aggregates category totals + percentages.                                                                                            |
| `MockScanDatasource`      | Mock        | Returns fixed `scan-result.json` after 800–1500ms simulated OCR delay.                                                                                        |
| `MockUserDatasource`      | Mock        | Returns `users.json` current user, searches `participants.json` by name/phone.                                                                                |
| `CurrencyLocalDatasource` | Local       | Synchronously loads `currency-list.json` at startup; case-insensitive search on code/name/symbol.                                                             |
| `RemoteBillDatasource`    | Remote stub | Full REST CRUD against `/bills` using native `fetch` + `appConfig.apiUrl`. Not wired up.                                                                      |
| `RemoteUserDatasource`    | Remote stub | REST calls to `/users/me` and `/users/search`. Not wired up.                                                                                                  |

### Repository Implementations

All `*RepositoryImpl` classes are thin wrappers that instantiate the corresponding datasource as a module-level singleton and delegate every method call directly. This makes swapping mock → remote as simple as changing the datasource import.

### Mock Data Files (`src/data/mocks/`)

| File                 | Contents                                                                   |
| -------------------- | -------------------------------------------------------------------------- |
| `bills.json`         | Sample bills: Pizza Palace (USD), Coffee Corner, Bali Seafood Grill (IDR)  |
| `trips.json`         | "Bali Trip 2026" (IDR, 4 participants, 7 days)                             |
| `users.json`         | Current user: John Doe, USD base, Chase + Bank of America accounts         |
| `participants.json`  | 5 participants: Alice Chen, Bob Wilson, Charlie Kim, Diana Park, etc.      |
| `expenses.json`      | 6+ expense records across food/transport/shopping categories               |
| `scan-result.json`   | "The Grand Bistro" — 5 items, USD, tax $9.15, service $6.10, total $106.75 |
| `currency-list.json` | Full international currency database (keyed by code)                       |

### Utilities (`src/data/utils/`)

- **`simulateDelay(min, max)`** — random `Promise` delay for realistic mock latency (default 300–800ms)
- **`formatCurrency(amount, code, decimals?)`** — looks up currency metadata, formats with `toLocaleString("en-US")`, prepends native symbol
- **`formatDate(raw)`** — formats ISO date to `"d MMM YYYY"` (e.g. `"19 Apr 2026"`)

---

## 7. Presentation Layer — Stores

All stores use **Zustand v5**.

### `useBillStore`

Manages bill lifecycle and the **draft bill** for the creation flow.

| State                          | Description                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| `bills[]`                      | All loaded bills                                                                              |
| `currentBill`                  | Currently viewed bill                                                                         |
| `breakdown: PersonBreakdown[]` | Per-person amounts for current bill                                                           |
| `draft*` fields                | Full draft state: items, participants, merchant, date, currency, tax, serviceCharge, discount |

Key actions: `fetchBills`, `fetchBillById`, `fetchBreakdown`, `createBill(tripId?)` (builds from draft, computes `totalAmount`), `settlePerson`, `finalizeBill`, `resetDraft`.

---

### `useCurrencyStore`

Persisted via `AsyncStorage` (key: `splitivo-base-currency`). Manages the selected base currency across sessions.

Actions: `fetchCurrencies`, `setCurrency(code)`, `searchCurrencies(query)`, `clearSearch`.

---

### `useExpenseStore`

Drives the analytics screen. Manages `selectedPeriod` (daily/monthly/annually) and re-fetches both expenses and category breakdown when the period changes. Includes a stale-update guard for concurrent fetches.

---

### `useTripStore`

Manages trip CRUD and transfer optimization. `fetchOptimizedTransfers(tripId)` retrieves debt-minimization result including `originalTransferCount` and `optimizedTransferCount`.

---

### `useUserStore`

Manages the current user profile. Convenience actions: `addBankAccount(account)` (auto-generates ID), `removeBankAccount(accountId)`.

---

### `useUIStore`

Minimal store for `themeMode: ThemeMode`. Main theme persistence lives in `ThemeProvider` via `AsyncStorage`.

---

## 8. Presentation Layer — Components

| Component             | Purpose                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Avatar`              | Initials circle with deterministic color hash. `StackedAvatars` renders overlapping avatars with "+N" overflow.                                                                |
| `Button`              | 4 variants (primary/secondary/destructive/ghost), 3 sizes. Fires `expo-haptics` light impact on press. `loading` prop shows `ActivityIndicator`.                               |
| `GlassCard`           | Adaptive glass container — uses native `GlassView` on iOS 26+, falls back to `BlurView`. `strong` prop increases blur/opacity. Supports `onPress` with scale/opacity feedback. |
| `Input`               | Themed `TextInput` with optional `label` and `error` message.                                                                                                                  |
| `BottomSheetScreen`   | Modal/formSheet wrapper with pill handle, optional title, and header action slots.                                                                                             |
| `CategoryIcon`        | Maps `ExpenseCategory` → Lucide icon via `CATEGORY_META`. Also exports `TripIcon`.                                                                                             |
| `LiquidGlassScreen`   | Full-screen wrapper: `GlassView` on iOS 26+, otherwise themed `View`.                                                                                                          |
| `ScreenContainer`     | Main screen layout with `LinearGradient` background, iOS large-title collapse animation, and `navBarLeading`/`navBarTrailing` slots.                                           |
| `SegmentedControl`    | Animated segmented control with sliding pill (spring animation). Generic `T extends string` options.                                                                           |
| `Skeleton`            | Pulse shimmer placeholder. Pre-built variants: `SummaryCardSkeleton`, `CardSkeleton`, `ListRowSkeleton`.                                                                       |
| `StatusPill`          | Pill badge for `settled` (green), `pending` (amber), `partial` (blue) with 20% opacity background tints.                                                                       |
| `CurrencyPickerSheet` | Slide-up currency picker with real-time search and `FlatList`.                                                                                                                 |
| `DebugBottomSheet`    | Developer panel (collapsible sections): navigation, theme toggle, currency switcher. Uses Reanimated layout animations.                                                        |

---

## 9. Screens

### Auth Flow (`(auth)/`)

| Screen           | Description                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `welcome.tsx`    | Landing: "Splitivo" logo, tagline, Google/Apple/Email sign-in buttons (all mock).                             |
| `sign-in.tsx`    | Email/phone toggle, password input in `GlassCard`. Mock sign-in navigates to tabs.                            |
| `sign-up.tsx`    | Username, email, password fields. Navigates to OTP verification.                                              |
| `verify-otp.tsx` | 6-box OTP input with auto-advance on digit entry and backspace-to-previous logic. Auto-submits on completion. |

---

### Main Tabs (`(tabs)/`)

| Screen             | Description                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `index.tsx` (Home) | Greeting + total owed + active trips list + recent single bills. Floating scan/manual FABs. Full skeleton loading states. |
| `activity.tsx`     | Bill feed with filter chips (all/single/trips/pending/settled). Bills sorted by `createdAt` descending.                   |
| `expenses.tsx`     | Analytics: period selector, total spend, category breakdown with progress bars, recent transactions list.                 |
| `profile.tsx`      | User avatar/info, bank accounts (masked numbers, gradient cards), currency picker, theme switcher, settings rows.         |

The tab bar is a **floating glass pill** with a central FAB gap. The `Plus` FAB opens `bill-type-selection-sheet` to choose Single Bill vs. Trip Split.

---

### Bill Creation Flow (`split/`)

```
bill-type-selection-sheet
         │
    ┌────┴────┐
  scan     manual-entry
    └────┬────┘
       confirm           ← assign items to participants
         │
       result            ← show breakdown, settle per-person
```

| Screen             | Description                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `scan.tsx`         | Camera viewfinder (mock), currency pill, capture/gallery toggle, "Enter Manually" link.                                                   |
| `manual-entry.tsx` | Draft bill form: merchant, date, dynamic items (name/qty/price), tax/service charge/discount. Running total displayed live.               |
| `confirm.tsx`      | Item-to-participant assignment UI. Tap participants to assign/unassign per item. Shows per-person breakdown totals. Calls `createBill()`. |
| `result.tsx`       | Final breakdown per participant. "Settle" button per person calls `settlePerson()`. Full skeleton loading.                                |

---

### Trip Management (`trip/`)

| Screen              | Description                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create.tsx`        | Trip form: name, dates, currency, participants (guest participants added by name, registered via search).                                               |
| `[id]/index.tsx`    | Trip detail: name, date range, participants (`StackedAvatars`), total spend, bills list, optimized transfers section, "Add Bill" + "Settle Up" buttons. |
| `[id]/add-bill.tsx` | Choice screen: Scan Receipt vs. Manual Entry.                                                                                                           |
| `[id]/settle.tsx`   | Settlement tracker: each transfer as checkbox row (from → to with amount). "Confirm All Settled" when all checked.                                      |

---

### Root Sheets

| Screen                          | Presentation | Description                                           |
| ------------------------------- | ------------ | ----------------------------------------------------- |
| `bill-type-selection-sheet.tsx` | `formSheet`  | Two `GlassCard` options: Single Bill or Trip Split.   |
| `currency-selection-sheet.tsx`  | `formSheet`  | Full `FlashList`-powered currency picker with search. |
| `debug-sheet.tsx`               | `modal`      | Renders `DebugBottomSheet` developer panel.           |

---

## 10. Theming & Design System

### Color Palette

The app uses a **violet-accented glass aesthetic** with full dark/light support.

| Token            | Dark                          | Light                         |
| ---------------- | ----------------------------- | ----------------------------- |
| `bg.primary`     | `#1A1721`                     | `#F8F7FC`                     |
| `accent.primary` | `#8B5CF6` (violet-500)        | `#6D28D9` (violet-700)        |
| `bg.glass`       | `rgba(255,255,255,0.08)`      | `rgba(255,255,255,0.6)`       |
| Root gradient    | `#2D1B5E → #1A1721 → #0F0D16` | `#DDD6FE → #F5F3FF → #FAFAFA` |

### Category Colors

Each `ExpenseCategory` has a distinct color used in icons, progress bars, and category breakdowns.

### `ThemeProvider`

- Persists selected `ThemeMode` (`"light" | "dark" | "system"`) to `AsyncStorage`
- Resolves `"system"` via React Native's `useColorScheme`
- Exposes `useTheme()` hook that throws if used outside the provider

### Liquid Glass (iOS 26+)

`useLiquidGlass()` returns `true` only when: platform is iOS **AND** iOS version ≥ 26 **AND** `isLiquidGlassAvailable()` from `expo-glass-effect` returns true. All glass components conditionally use native `GlassView` or fall back to `BlurView`.

### NativeWind / Tailwind

Custom tokens in `tailwind.config.js`:

- `accent.primary / pressed / secondary` → CSS variables
- `border-radius.card` → `16px`

---

## 11. Configuration & Environment

### App Config (`app.json`)

| Property         | Value                  |
| ---------------- | ---------------------- |
| App Name         | `Splitivo`             |
| Bundle ID        | `com.splitivo.mobile`  |
| URL Scheme       | `splitivo`             |
| New Architecture | Enabled                |
| Orientation      | Portrait               |
| Theme            | Automatic (light/dark) |
| Splash BG        | `#09090B`              |

### Environment (`src/core/config/environment.ts`)

Three environments driven by `EXPO_PUBLIC_*` env vars:

| Variable          | Description                  |
| ----------------- | ---------------------------- |
| `EXPO_PUBLIC_ENV` | `"dev" \| "smoke" \| "prod"` |
| `API_URL`         | Backend API base URL         |
| `DEBUG_ENABLED`   | Enables debug panel          |

Started via `dotenv-cli` with env-specific `.env` files:

```
npm run start:dev   # uses .env.dev
npm run start:smoke # uses .env.smoke
npm run start:prod  # uses .env.prod
```

### EAS Build Profiles

```
build:dev   → development client build
build:smoke → preview (staging) build
build:prod  → production build
```

---

## 12. Current Status & Roadmap

### What's Implemented

- Complete UI for all screens with realistic mock data
- Full bill creation flow (scan placeholder + manual entry + confirmation + result)
- Trip management with optimized debt settlement algorithm
- Expense analytics with category breakdown
- Multi-currency support with full currency database
- Dark/light/system theming with persistence
- iOS 26+ Liquid Glass adaptive UI
- Per-item participant assignment with precise breakdown calculation
- Zustand stores with AsyncStorage persistence for currency preference

### What's Not Yet Implemented

- **Authentication** — all auth flows are mock (navigation only, no real auth)
- **Remote datasources** — REST stubs exist (`RemoteBillDatasource`, `RemoteUserDatasource`) but are not wired up
- **Camera / OCR** — scan screen is a placeholder; no real receipt scanning
- **Push notifications** — UI exists in profile settings but no implementation
- **Real-time sync** — no WebSocket or polling
- **Use case layer** — stores call repository implementations directly, skipping a domain use-case layer
- **Error handling** — minimal; stores capture `error` state but screens mostly don't surface errors to users
