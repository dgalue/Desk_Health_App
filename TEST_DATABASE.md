# Desk Health - Test Database & QA Template

This document serves as a comprehensive verification checklist for the **Desk Health** application. It records the tests performed to reach v1.0 and serves as a template for future application logic and UI verification.

## 1. Installation & Environment

| Test ID | Category | Description | Expected Result | Status | Notes |
|:---:|:---:|:---|:---|:---:|:---|
| **INS-01** | Installer | Run `Desk Health Setup.exe` | Application installs without errors. | ✅ PASS | |
| **INS-02** | Structure | Check installation directory | Check files in `%localappdata%\Programs\desk-health`. | ✅ PASS | |
| **INS-03** | Shortcut | Check Desktop Shortcut | **NO** Desktop shortcut should be created (per config). | ✅ PASS | Configured `createDesktopShortcut: false`. |
| **INS-04** | Start Menu | Check Start Menu Entry | Entry "Desk Health" should exist and launch app. | ✅ PASS | |
| **INS-05** | Portable | Run `win-unpacked/Desk Health.exe` | App launches directly without install. | ✅ PASS | Useful for quick testing. |

## 2. Startup & Persistence

| Test ID | Category | Description | Expected Result | Status | Notes |
|:---:|:---:|:---|:---|:---:|:---|
| **SUP-01** | Settings | Toggle "Run on Startup" ON | Registry key created in `HKCU\...\Run`. | ✅ PASS | Confirmed with `get-startup-status`. |
| **SUP-02** | Settings | Toggle "Run on Startup" OFF | Registry key removed. | ✅ PASS | |
| **SUP-03** | Reboot | Reboot with Startup enabled | App launches automatically. | ✅ PASS | |
| **SUP-04** | Minimized | Startup Behavior | App launches **minimized to tray** (not visible). | ✅ PASS | Requires `--hidden` arg in registry. |
| **SUP-05** | Arg Check | Launch with `--hidden` flag | App process starts but window remains hidden. | ✅ PASS | Verified code logic in `main.cjs`. |

## 3. Window Management & System Integration

| Test ID | Category | Description | Expected Result | Status | Notes |
|:---:|:---:|:---|:---|:---:|:---|
| **WIN-01** | Instances | Try to launch 2nd instance | 2nd instance quits; 1st instance focuses. | ✅ PASS | Single Instance Lock implementation. |
| **WIN-02** | Icons | Check App Window Icon | Top-left bar shows correctly (Heart/Clock). | ✅ PASS | Used `icon.ico`. |
| **WIN-03** | Tray | Minimize to Tray | Closing window minimizes to tray (don't quit). | ✅ PASS | |
| **WIN-04** | Tray | Open from Tray | Clicking tray icon restores window. | ✅ PASS | |
| **WIN-05** | Tray | Context Menu | Right-click tray -> "Quit" works. | ✅ PASS | |
| **WIN-06** | Taskbar | Taskbar Icon Display | Shows correct icon when running. | ✅ PASS | |

## 4. UI/UX Verification

| Test ID | Category | Description | Expected Result | Status | Notes |
|:---:|:---:|:---|:---|:---:|:---|
| **UI-01** | Sidebar | Sidebar Layout | Fixed width, correct icons (active/inactive states). | ✅ PASS | Fixed relative path checks. |
| **UI-02** | Resizing | Resize Window | Layout adapts, no overflow or clipping. | ✅ PASS | `minWidth/minHeight` enforced. |
| **UI-03** | Navigation | Tab Switching | Timer <-> Exercises <-> Settings transitions instant. | ✅ PASS | |
| **UI-04** | Timers | "Meal Mode" Button | Button width stable when text changes. | ✅ PASS | Added `minWidth` style. |
| **UI-05** | Theme | Dark/Light Consistency | Colors match Design System (Inter font, Slate/Indigo tokens). | ✅ PASS | |

## 5. Core Functionality (Timer & Exercises)

| Test ID | Category | Description | Expected Result | Status | Notes |
|:---:|:---:|:---|:---|:---:|:---|
| **FNC-01** | Timer | Start/Stop Timer | Countdown works, pauses correctly. | ✅ PASS | |
| **FNC-02** | Timer | Mode Switching | Focus -> Break -> Long Break transitions. | ✅ PASS | |
| **FNC-03** | Timer | Completion Notification | Native OS notification fires on 00:00. | ✅ PASS | |
| **FNC-04** | Expenses | Add Custom Exercise | Appears in list, persisted to localStorage. | ✅ PASS | |
| **FNC-05** | Expenses | Delete Exercise | Removed from list immediately. | ✅ PASS | |
| **FNC-06** | Sound | Play Custom Sound | Audio plays on timer completion. | ✅ PASS | |

## 6. Known Limitations (v1.0)

| ID | Description | Workaround |
|:---|:---|:---|
| **LIM-01** | **Executable File Icon** | The `.exe` file icon in Explorer shows default Electron icon due to build environment lacking code signing certificate. | **Fix:** Installer creates correct shortcuts. Manual shortcut icon change works. |
| **LIM-02** | **SmartScreen Warning** | Windows SmartScreen warns on install because the app is not signed with a paid certificate. | **Fix:** User must click "Run Anyway". |

---
*Last Updated: 2026-01-31*
