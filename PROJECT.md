# FirstTrack IMS — Rebuild Project Reference

**Almoayyed Computers Internship Management System — complete redesign.**
Same business workflow as the legacy PHP/Laravel system, entirely new premium UI/tech stack.

Full plan (context, phasing, rationale): `/Users/mac/.claude/plans/effervescent-wiggling-mccarthy.md`
Original approved design reference (static login prototype, do not delete): `/Users/mac/Desktop/firsttark/acme-ims-login.html`

---

## 1. Status

**Phase 1 — in progress.** Design system, app shell, and the HR role are built and working end-to-end against a real (seeded) database. Phases 2–6 (Department Head, Mentor, Intern, CEO, Super Admin) are **not started** — only routing stubs exist implicitly via role-based redirect; their pages will 404 until built.

| Task | Status |
|---|---|
| Scaffold Next.js 15 + TS + Prisma + Tailwind + NextAuth | ✅ Done |
| Prisma schema + seed data | ✅ Done |
| Design tokens + Tailwind theme (ported from login prototype) | ✅ Done |
| Shared component library | ✅ Done |
| Login/splash page ported into Next.js (cinematic 3D intro) | ✅ Done |
| Authenticated app shell (sidebar/topbar/rotating logo) | ✅ Done |
| HR role screens end-to-end | 🟡 In progress (all 7 screens built, mid-verification) |
| Full verification pass (theme × lang × viewport) | ⬜ Not started |
| Phases 2–6 (HOD, Mentor, Intern, CEO, Super Admin) | ⬜ Not started |

---

## 2. Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Prisma 6.19.3** ORM + **SQLite** (dev) — schema portable to Postgres/MySQL for production, pinned to v6 deliberately (v7 introduces an unfamiliar `prisma.config.ts`/generator setup; v6 uses the well-documented conventional pattern)
- **Tailwind CSS v4** (CSS-first `@theme` config, no `tailwind.config.js`)
- **NextAuth.js v5 (beta)** — Credentials provider, JWT session strategy
- **Three.js r128 + GSAP 3.12.5** — loaded as CDN `<script>` globals (not npm imports) for the cinematic login intro, matching the original prototype's approach
- Fonts: **Barlow** (Latin) / **IBM Plex Sans Arabic** (Arabic), via `next/font/google`

### Why this stack (vs. the legacy PHP/Laravel/MySQL system)
The old system's code and database were never provided — only documentation. Node/Next.js was chosen so the app could actually be scaffolded, run, and live-previewed in the dev sandbox immediately. **Open risk, not yet resolved:** final deployment target is unconfirmed (the client's GoDaddy access-details doc was blank), which may still affect hosting and DB engine choice for production.

---

## 3. Running the Project

```bash
cd /Users/mac/Desktop/firsttrack-app
npm run dev              # http://localhost:3000
```

Preview tooling: registered as the `firsttrack-dev` config in `/Users/mac/Desktop/firsttark/.claude/launch.json` (the preview tool's launch.json is scoped to that older directory, not this project — this is a quirk of the session, not a project dependency).

### Database

```bash
npx prisma migrate dev     # apply schema changes
npx prisma db seed         # reseed demo data (prisma/seed.ts)
```

SQLite file lives at `prisma/dev.db` (gitignored). Inspect directly with `sqlite3 prisma/dev.db`.

### Seeded login credentials

All seeded users share the password **`Passw0rd!`**. CPR ID (username) per role:

| Role | CPR ID | Name |
|---|---|---|
| HR | `900000003` | Mariam Al-Sayed |
| Department Head (IT) | `90000010` | Fatima Al-Amin |
| Mentor | `900000200` | Mariam Al-Amin |
| CEO | `900000002` | Yousif Al-Amin |
| Super Admin | `900000001` | System Administrator |

Only **HR** has real pages built — other roles will hit a 404 after login (their dashboard routes don't exist yet).

Seed data includes: 4 departments, 5 nationalities, ~32 shortlist applications spanning every status (pending, rejected, university-confirmed), and interns spanning every `InternStatus` (registered, active w/ goals+timesheets, completed w/ final remarks+feedback, certified w/ certificates) — enough to exercise every HR screen with realistic data.

---

## 4. Design System

All tokens live in `src/app/globals.css`, extended from the original login prototype's CSS variables and mapped into Tailwind's `@theme inline` block so they're usable as utility classes (`bg-wine`, `text-text-2`, `border-line`, `bg-status-approved-bg`, etc.).

- **Themes**: `[data-theme="dark"]` (default) / `[data-theme="light"]`, toggled + persisted via `src/lib/theme-lang.tsx` (`ThemeLangProvider`, `useThemeLang()`), same `localStorage` keys (`acme-theme`, `acme-lang`) as the original prototype.
- **i18n**: `src/lib/i18n.ts` — flat dictionary keyed by dot-path (`"hr.dashboard.title"`), English + Arabic, `useT()` hook. RTL handled via `dir="rtl"` on `<html>` + Tailwind logical properties (`ps-`, `pe-`, `start-`, `end-`) throughout — never `left`/`right`.
- **Brand mark**: `src/components/AppLogo.tsx` — flat 2D SVG version used in the sidebar/nav (has a `spin` prop for the slow continuous rotation the client requested for every-page headers). The heavy 3D GLB/Three.js version (`src/components/CinematicIntro.tsx`) is used **only** on the login page's one-time intro — deliberately not run persistently on every page (16MB model, full WebGL context).

### Component library (`src/components/ui/`)
`Button`, `Input`, `Select`, `Checkbox`, `FileUpload` (drag-drop, wired for native `FormData`/Server Actions), `Card`, `StatusBadge` (status→tone mapping in one place), `Avatar`, `StatTile`, `DataTable` (generic, sortable-ready, loading/empty states), `Modal`, `Toast` (+ `ToastProvider`/`useToast`), `Tabs`, `Pagination`, `ProgressBar`, `RatingInput` (3-value segmented control + 1–5 skill score selector + read-only consolidated rating), `EmptyState`, `Skeleton`.

### Layout (`src/components/layout/`)
`AppShell` (composes `Sidebar` + `Topbar`, manages mobile drawer state), `Sidebar` (desktop fixed / mobile drawer, active-route highlighting), `Topbar` (lang/theme toggles, notification bell shell, profile menu with sign-out), `icons.tsx` (nav icon set).

---

## 5. Database Schema

Defined in `prisma/schema.prisma`. **This schema is inferred from documentation only** — no real database or legacy codebase was ever provided, so every field/table should be treated as a draft pending validation against real data.

Core models: `User` (role enum: HR/HOD/MENTOR/INTERN/CEO/SUPER_ADMIN), `Department`, `Nationality`, `TrainingTopic`, `ShortlistApplication` (status trail: SHORTLISTED → HOD_APPROVED/HOD_REJECTED/RECOMMENDED_OTHER_DEPT, or UNIVERSITY_CONFIRMED), `Intern` (full profile, 1:1 with its originating `ShortlistApplication`, status: REGISTERED → ACTIVE → COMPLETED → CERTIFIED/DEACTIVATED), `InternStatusHistory` (audit trail), `QuestionnaireResponse`, `Goal` → `Task` → `Timesheet`, `Meeting` (goal-setting + mid-internship, overdue tracking), `BiweeklyReview`, `FinalRemark` (soft/technical skill scores — **1–5 scale is an assumption**, not confirmed with the client), `PostInternshipFeedback`, `Certificate`, `TrainingResource`, `FileAsset` (polymorphic — CVs, work files, training docs, local disk storage under `public/uploads/`), `Notification`, `EmailNotificationSetting`.

---

## 6. What's Built: HR Role

Route group `src/app/hr/` (guarded by `src/app/hr/layout.tsx` — redirects non-HR sessions).

| Route | Screen |
|---|---|
| `/hr/dashboard` | Stat tiles: shortlisted / current / completed-pending-certify / certified counts |
| `/hr/shortlisted/new` | Add Shortlisted Intern — form + CV upload (Server Action, local disk storage) |
| `/hr/shortlisted` | List + search — **only applications with no linked `Intern` yet** (see bug note below) |
| `/hr/shortlisted/[id]` | Read-only application detail (CV link, interview remarks if decided) |
| `/hr/by-university` | Interns grouped by university, with total/active/certified counts |
| `/hr/university-interns` | University-confirmed applications awaiting HR accept (Server Action transitions to SHORTLISTED) |
| `/hr/current` | List + detail — interns with status REGISTERED/ACTIVE |
| `/hr/completed` | List + detail — interns with status COMPLETED/CERTIFIED, final-remarks view, **Certify** action (Server Action → creates `Certificate`, flips status to CERTIFIED), certificate print view |

Mutations live in `src/app/hr/actions.ts` (`"use server"`): `createShortlistApplication`, `acceptUniversityIntern`, `certifyIntern`.

### Bugs found and fixed this session (all confirmed via live testing, not just code review)
1. **`ToastProvider`/`Modal` hydration mismatch** — both checked `typeof document !== "undefined"` synchronously during render to guard a `createPortal` call. Server renders `undefined` → nothing; client's *first* render (before any effect) already has `document` defined → portal renders immediately → hydration mismatch. Fixed with a `mounted` state flag set in `useEffect`, so the client's first paint matches the server exactly.
2. **`session.user.id` was `undefined`** — the NextAuth `jwt`/`session` callbacks set `role`/`cprId`/`departmentId` but never copied the user id onto the token/session, so every Server Action's `user.id` was undefined. Fixed in `src/auth.ts` (`token.sub = user.id`, `session.user.id = token.sub`) + type augmentation in `src/types/next-auth.d.ts`.
3. **Prisma relation-input mismatch** — `.create()` calls passed raw scalar FKs (`interestedDepartmentId: departmentId`) which Prisma's checked-input validator rejected at runtime ("Argument `interestedDepartment` is missing"). Fixed by using nested `connect` syntax (`interestedDepartment: { connect: { id: departmentId } }`) throughout `actions.ts` — the universally-correct form regardless of checked/unchecked schema quirks.
4. **`/hr/shortlisted` list scoping bug** — originally queried all applications except `UNIVERSITY_CONFIRMED`, which pulled in every already-approved application still linked to an active/completed/certified intern, burying the actually-pending ones. Fixed by adding `intern: null` to the filter — once an application has a linked `Intern` record, it belongs in Current/Completed views, not here.
5. **Three.js material color washout** (carried over from the original login prototype work, re-verified here) — r128 treats hex colors as linear, not sRGB; fixed via `convertSRGBToLinear()` on all three materials so the burgundy/silver/chrome actually render as intended instead of washing out under the studio lighting.

### Known rough edges (not yet fixed)
- Manual click-testing in the preview tool has repeatedly produced **false negatives** (network log shows no request after a click that should submit a form) that turned out to be tool/timing artifacts, not app bugs — confirmed by re-dispatching the same click via `element.click()` in-page, which worked immediately. If a form ever appears "unresponsive" during testing, verify against the database directly (`sqlite3 prisma/dev.db`) before assuming it's a real bug.
- No automated tests exist yet.
- File uploads go to local disk (`public/uploads/`) — fine for dev, not a production-ready storage strategy (flagged in the plan as an open question: S3-compatible vs Azure Blob vs local).

---

## 7. Open Questions for the Client (carried from the plan, still unresolved)

- Real database schema / legacy codebase — never provided; current schema is a best-effort inference from the user manual and process-flow docs.
- Deployment target (GoDaddy Node-capable? Vercel? something else?) — access-details doc provided was blank.
- File storage backend for production.
- Email/WhatsApp notification provider (HOD's "send Email/WhatsApp" action currently has no real integration).
- Soft/Technical Skills scoring scale — built as 1–5, not literally confirmed in the manual.

---

## 8. Next Steps

1. Finish verifying the HR role (Task 8 in the plan — full pass across dark/light × EN/AR-RTL × desktop/mobile).
2. Show the client Phase 1 before starting Phase 2.
3. Phase 2 = Department Head role, reusing every component/pattern established here — see the plan file for the full phase-by-phase breakdown.
