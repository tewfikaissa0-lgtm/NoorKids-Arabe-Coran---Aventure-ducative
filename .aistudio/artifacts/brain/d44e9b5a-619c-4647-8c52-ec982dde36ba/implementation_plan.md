# NoorKids Arabe & Coran: Advanced Admin & Creative Feature Suite

An upgrade to "NoorKids Arabe & Coran" (created by Maryam et son fils) adding robust admin controls (point deduction/addition, diamond management, version configuration, manual multiplier activation from 2x to 1000x, Wish Letter Inbox to creator), hiding admin password in UI, and introducing 20+ imaginative educational and gamification features.

## User Review & Critical Decisions

> [!IMPORTANT]
> All requested administrative controls and creative features have been aligned with user feedback:
> - **Manual Multiplier Activation**: Admins can toggle live multipliers (`2x`, `5x`, `10x`, `20x`, `50x`, `100x`, `200x`, `500x`, `1000x`) instantly during gameplay.
> - **Wish Letters Inbox**: Kids can submit dreams/wishes to Maryam and her son via the "Boîte à Souhaits", received directly in the Admin Dashboard with reply/delete management.
> - **Full Admin Control**: Admins can add or remove points (stars, coins) and diamonds, change the game version display, and keep the admin password (`452011`) strictly secret.

- **Confirmed Decision 1**: Admin security is hidden behind a secret triple-click on the `نُور` logo requiring PIN `452011` without exposing the password in plain text.
- **Confirmed Decision 2**: 20+ imaginative features added across games and admin panel (Parent PDF report export, sound effects volume slider, difficulty level selector, audio speed control, dark Islamic theme mode, custom avatars/stickers shop, daily streak tracker, mini Quran Juz tracker, Arabic calligraphy canvas, daily challenge generator, student badge gallery, offline badge collector, quick quiz customizer, broadcast announcement history, student progress reset, student observation notes log, multilingual UI switcher, streak freeze tool, point/diamond deduction controls, and game version switcher).

---

## 1. Overview & Core Concept

- **What It Does**: Enhances the interactive Islamic & Arabic educational platform for French-speaking children with granular teacher/parent controls and rich gamification.
- **Target Audience**: French-speaking children learning Arabic & Quran, alongside parents and educators (Maryam et son fils).
- **Key Value**: Deep pedagogical engagement combined with absolute administrative oversight and creative customizability.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Wish Letter Submission*: Students open the Wish Box modal, write their dream/wish for the creators, and submit it with celebratory feedback.
  2. *Admin Dashboard Management*: Access via secret logo triple-click -> PIN `452011` -> Manage points/diamonds (add/remove), activate live score multipliers (`2x`–`1000x`), view Wish Letters inbox, export parent reports, and configure version.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Warm, inviting Islamic educational aesthetic with clean typography (Plus Jakarta Sans), gold/emerald accents (`#059669`, `#D97706`), and responsive layout.
  - *Dual-Theme*: Light and Dark Islamic Starry Night modes.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1**: Client-side localStorage persistence for wish letters, multipliers, and student profiles for seamless offline reliability in the preview environment.
- **Decision 2**: Manual multiplier activation chosen over automatic background boosting to give the administrator precise pedagogical control during live practice sessions.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                        App.tsx                         │
│ (State Management, Roster, Multiplier, Wish Letters)   │
└───────────┬────────────────┬───────────────┬───────────┘
            │                │               │
            ▼                ▼               ▼
┌───────────────────┐ ┌───────────────┐ ┌────────────────┐
│   AdminDashboard  │ │ WishBoxModal  │ │ Mini-Games &   │
│ (Multipliers,     │ │ (Send Wish to │ │ Interactive    │
│  Points/Diamonds  │ │  Creators)    │ │ Learning Tools)│
│  +/- Roster,      │ └───────────────┘ └────────────────┘
│  Wish Inbox)      │
└───────────────────┘
```

- **Data Models**:
  - `WishLetter`: `{ id, studentName, message, timestamp, status }`
  - `StudentProfile`: `{ name, stars, coins, diamonds, streak, completedQuizzes, masteredLetters, notes }`
  - `AppSettings`: `{ gameVersion, activeMultiplier, announcement, lockdown, sfxVolume, theme }`
