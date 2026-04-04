# Desk Health — CLAUDE.md

## Project Overview

**Desk Health** is a wellness timer app for desk workers. It runs as an Electron desktop app (Windows primary) and a Capacitor mobile app (iOS/Android). The UI is built with React 19 + Vite.

- Author: Diego Galue
- App ID: `com.diego.deskhealth`
- Current version: `2.1.0`

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, JSX (no TypeScript) |
| Bundler | Vite 7 |
| Desktop shell | Electron 40 |
| Mobile shell | Capacitor 8 (iOS + Android) |
| Drag & drop | @dnd-kit/core, @dnd-kit/sortable |
| Font | Inter (@fontsource/inter) |
| Notifications | Electron native IPC / Capacitor LocalNotifications |
| Styling | CSS variables + inline styles (no CSS framework) |

## Development Commands

```bash
npm run dev              # Vite dev server only (http://localhost:5173)
npm run electron:dev     # Full Electron + Vite dev mode (use this for desktop work)
npm run build            # Production Vite build → dist/
npm run electron:build   # Vite build + package Electron → release/ (NSIS installer)
npm run lint             # ESLint check
```

> Electron dev uses `concurrently` + `wait-on`. The Vite server must start before Electron loads it via `ELECTRON_START_URL`.

## Project Structure

```
electron/
  main.cjs          # Electron main process (CommonJS)
  preload.cjs       # Electron preload — exposes window.electronAPI

src/
  App.jsx           # Root component; owns all timer/mode state + schedule logic
  Timer.jsx         # SVG countdown circle display
  Settings.jsx      # Settings panel (work duration, schedule, audio, etc.)
  ExerciseCard.jsx  # Full-screen exercise display during a break
  ExerciseSelector.jsx  # Manual exercise picker
  ExercisePreview.jsx   # "Up next" exercise teaser on timer view
  ExerciseManager.jsx   # CRUD + reorder interface for exercises
  StatsModal.jsx    # Stats view (streaks, focus time, exercise count)
  exercises.js      # Default exercise definitions array
  GameLoop.js       # Utility for game-loop timing
  index.css         # CSS variable theme + global resets
  App.css           # Additional component-level styles

  hooks/
    useExercises.js   # Exercise list state, CRUD, order, enabled/disabled
    useProgress.js    # Daily log, streaks, focus time tracking
    useAudio.js       # Sound presets, custom sounds, playback

public/
  icon.ico / icon.png / tray-icon.png   # App icons
```

## Architecture Notes

### Platform Detection
- `window.electronAPI` — present when running inside Electron (exposed via preload)
- `Capacitor.isNativePlatform()` — true on iOS/Android
- Mobile layout triggers at `window.innerWidth < 768` (BottomNav vs Sidebar)

### Timer State Machine
Modes: `WORK` → `EXERCISE` → `WORK` (loop), or `WORK` ↔ `MEAL`

The timer runs in `App.jsx` using a drift-corrected interval:
- Calculates `targetEndTime = Date.now() + timeLeft * 1000` on each activation
- Uses `setInterval` at 1s to recalculate remaining time from the target — handles sleep/throttling
- `backgroundThrottling: false` is set in Electron to keep the timer running when minimized

### Persistent Timer (across restarts)
- Timer state saved to `localStorage.timerState` every 5 seconds while active
- Restored on mount; if expired while closed, cleared without action

### Notifications
All notifications funnel through `sendNotification(title, body)` in `App.jsx`:
- Electron: `window.electronAPI.showNotification()` → IPC → `Notification` in main process
- Mobile: `@capacitor/local-notifications`
- Notification clicks bring the window to front (Electron)

### `window.electronAPI` IPC Surface
| Method | Direction | Purpose |
|---|---|---|
| `getStartupStatus()` | invoke | Returns `openAtLogin` boolean |
| `toggleStartup(enable)` | send | Sets/clears login item with `--hidden` arg |
| `focusWindow()` | send | Restores + focuses main window |
| `showNotification(title, body)` | send | Shows OS notification with click-to-focus |
| `saveSoundFile(filename, base64)` | invoke | Saves custom audio to `userData/sounds/`, returns `file://` URL |
| `deleteSoundFile(filename)` | invoke | Removes file from `userData/sounds/` |

> Custom sounds in Electron are saved to disk (not localStorage) to avoid the ~5 MB localStorage limit. localStorage only stores the metadata `{ id, name, url, isCustom }` where `url` is a `file://` path.

## localStorage Keys

| Key | Contents |
|---|---|
| `timerState` | `{ timeLeft, mode, currentDuration, targetEndTime, savedAt }` |
| `workDuration` | number (seconds) — persisted on every Save |
| `mealDuration` | number (seconds) — persisted on every Save |
| `schedule` | `{ start: 'HH:MM', end: 'HH:MM' }` — work schedule |
| `mealSchedule` | `{ start: 'HH:MM', end: 'HH:MM' }` — meal schedule |
| `customExercises` | Array of custom exercise objects |
| `exerciseStates` | `{ [id]: boolean }` — enabled/disabled per exercise |
| `exerciseOrder` | Array of exercise IDs (display order) |
| `lastExerciseId` | ID of last completed exercise (for rotation) |
| `deskHealthv1_progress` | `{ [dateKey]: { exercisesCompleted, minutesFocused } }` |
| `workDays` | Array of day numbers (0=Sun … 6=Sat), default `[1,2,3,4,5]` |
| `mealScheduleEnabled` | boolean |
| `notificationsEnabled` | boolean |
| `popToFrontEnabled` | boolean |
| `deskHealth_soundEnabled` | boolean |
| `deskHealth_soundVolume` | number (0–1) |
| `deskHealth_soundType` | preset ID string |
| `deskHealth_customSounds` | Array of `{ id, name, url, isCustom }` — metadata only, no base64 |

## Electron Build (Windows)

- Packager: `electron-builder` → NSIS installer → `release/`
- Entry: `electron/main.cjs` (`"main"` field in package.json)
- `"type": "module"` in package.json — Electron files use `.cjs` extension to stay CommonJS
- App icon: `public/icon.ico`
- `signAndEditExecutable: false` — no code signing configured

## Capacitor (Mobile)

- `webDir: dist` — Capacitor serves the Vite build output
- Run `npm run build && npx cap sync android` before opening in Android Studio
- Android debug APK: `android/app/build/outputs/apk/debug/`

### Android Configuration (key files)
| File | Purpose |
|---|---|
| `android/variables.gradle` | SDK versions + library versions (compileSdk/targetSdk = 35) |
| `android/build.gradle` | AGP 8.7.3, Gradle 8.11.1 |
| `android/app/build.gradle` | minifyEnabled + shrinkResources in release; Java 21 compileOptions |
| `android/app/proguard-rules.pro` | Keep rules for Capacitor, LocalNotifications, WebView bridge |
| `android/app/src/main/AndroidManifest.xml` | All permissions declared (see below) |
| `android/app/src/main/java/.../MainActivity.java` | SplashScreen install, POST_NOTIFICATIONS runtime request, Notification polyfill |
| `android/app/src/main/res/values/styles.xml` | Dark theme, Android 12+ splash attributes |
| `android/app/src/main/res/values/colors.xml` | Brand colors (`#5E6AD2`, `#0f1117`) |
| `android/app/src/main/res/xml/network_security_config.xml` | Blocks cleartext HTTP except localhost |
| `android/app/src/main/res/drawable/ic_stat_notification.xml` | Monochrome notification icon |

### Android Permissions Declared
`INTERNET`, `VIBRATE`, `WAKE_LOCK`, `POST_NOTIFICATIONS` (API 33+), `SCHEDULE_EXACT_ALARM` (API ≤32), `USE_EXACT_ALARM` (API 33+), `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`, `RECEIVE_BOOT_COMPLETED`

### Notification Channel
Created at app start via `LocalNotifications.createChannel()` in `App.jsx`:
- Channel ID: `desk-health-alerts`
- Importance: HIGH (heads-up)
- Sound: `beep.wav` (must be placed in `android/app/src/main/res/raw/`)

### Required Sound Files (manual step)
Place these in **`public/sounds/`** (Vite bundles them into `dist/`):
- `bell.mp3`, `digital.mp3`, `nature.mp3` — foreground audio (1–3s, MP3)

Place this in **`android/app/src/main/res/raw/`**:
- `beep.wav` — notification channel sound on Android (OGG also works)

Source: [mixkit.co/free-sound-effects](https://mixkit.co/free-sound-effects/)

## Key Patterns & Conventions

- **No TypeScript** — plain `.js` / `.jsx` throughout
- **No external state library** — React hooks + `localStorage` only
- **Inline styles dominant** — CSS variables (`--primary-color`, `--bg-color`, etc.) defined in `index.css`; component layout done inline
- **Exercise IDs**: custom exercises use `Date.now().toString()` as ID; default exercises use `exercise.name` as fallback ID
- **Streak definition**: a day counts if `exercisesCompleted >= 1` OR `minutesFocused >= 60`
- **Meal skip guard**: `mealSkippedRef` prevents auto-restart of meal timer after user cancels it within the meal window
- **Single instance lock** in Electron — second launch focuses existing window
