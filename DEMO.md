# Halo — demo brief

A one-pager you can read in three minutes and run in five.

## Pitch

Halo is a post-surgical recovery network. One product, three roles:

- **Patient** — a phone-shaped Today screen with daily care tasks, a check-in
  flow (incision photo, pain, sleep, mood), a generative care plan, an inbox
  for the care team, and an AI assistant that pulls up nearby support, meals,
  or recovery products.
- **Clinician (nurse / surgeon)** — a desktop patient chart with vitals,
  labs, meds, I&O, summary, handoff, and recent reports. One button to
  **assign homework** to the patient; another to **post a care report**.
- **Social & Protective** — same desktop chart, scoped to coordination
  workflows.

Care moves both directions: when a clinician assigns homework, a message
lands in the patient's chat. When the patient completes the task, the
clinician sees the pain score, the note, and the photo pill in the same
homework card.

## 2-minute storyboard

1. **Landing** (`/`): rotating headline (10 locales). Demo mode is on, so the
   sign-in card flips to three role buttons — **Nurse · Patient · Social &
   Protective**.
2. **Pick "Nurse"** → desktop dashboard → click *Today's patient* → opens
   Margaret Okafor's chart at `/recipients/[id]`.
3. **Assign homework** (gold button next to Post Report): pick "Walk", title
   "12-minute hallway walk", subtitle "Use the walker." Submit.
4. **Open** `/messages/[id]` from the chart's care-team thread — the
   assignment message is already there.
5. **Switch role** to **Patient**. The Today screen shows the new walk task
   at the top.
6. **Tap the task** → goes to `/check-in?taskId=…`. Walk through incision,
   daily check, feeling, review. Submit.
7. **Switch back to Nurse**. The Homework panel now shows the completed card
   with a pain badge, note quote, and "Photo attached" pill.
8. **Plan tab** (`/plan`) on Patient: switch between **Orthopedic** and
   **Cardiac** teams — each is a stack of generative cards.
9. **Ask Halo AI** (`/ai`): type "find a walking group near me" → after a
   typing pause, a NearbyPlaces card streams in.

## What's real vs mocked

**Real (Prisma-backed)**
- Users, CareRecipient, Membership
- Direct message threads + messages, audit log on read/send
- Care reports (post + resolve)
- Patient tasks (assign + submit completion)

**Mocked (seed data)**
- Margaret's vitals, labs, meds, I&O, summary, handoff, care team
- Today screen recovery progress, wearable snapshot, fallback task list
- Plan cards for both Orthopedic and Cardiac teams
- Halo AI replies (keyword-matched, scripted cards)

## Architecture

- **Next.js 16** (App Router, RSC, server actions, Turbopack)
- **Prisma + Postgres** (Railway — `prisma db push`, no shadow DB)
- **Privy passwordless auth** (`@privy-io/react-auth`) — falls back to demo
  mode when no app id is set
- **Tailwind v4** with brand tokens in `app/globals.css`
- **Tambo generative UI** (`@tambo-ai/react`) — registry of seven Zod-typed
  cards. `TamboProvider` activates when `NEXT_PUBLIC_TAMBO_API_KEY` is set;
  `TamboStubProvider` keeps the demo visual without a key.
- **lucide-react** icons throughout

Route map:

```
/                         landing (rotator + Privy / demo role picker)
/onboarding               post-auth placeholder
/dashboard                patient Today (mobile) | clinician summary (desktop)
/progress  /plan  /profile  patient mobile tabs (under (patient) group)
/messages                 patient mobile inbox
/messages/[id]            chat detail (mobile)
/check-in                 multi-step check-in (mobile)
/ai                       Halo AI chat (mobile)
/recipients/[id]          desktop patient chart
```

Server actions live under `app/actions/`:
- `pick-role.ts`  — `pickRole(role)`
- `messages.ts`  — `createThreadMessage`, `openPrimaryCareThread`
- `recipients.ts` — `createCareReport`, `resolveCareReport`, `openDemoRecipient`
- `homework.ts`  — `assignHomework`, `submitTaskCompletion`

Audit log writes: `thread.read`, `thread.message.send`, `report.created`,
`report.resolved`, `patient_task.assigned`, `patient_task.completed`.

## Run it

```sh
npm install
cp .env.example .env.local
# edit .env.local: set DATABASE_URL (Railway Postgres)
#                   leave Privy + Tambo keys empty for demo mode
#                   NEXT_PUBLIC_DEMO_MODE="1"

npm run db:push        # creates the schema; no shadow DB needed
npm run dev
```

Open the app, pick a role. The demo seed users (Dr. Lee, Margaret, Tomás)
are lazy-created on first role pick. Margaret's `CareRecipient` is
auto-created on first chart view, with the Membership wired up so homework
flows reach her.

### Membership prereq

The homework action looks up the patient via
`Membership where familyKind="patient"` on the recipient. The demo recipient
helper (`lib/recipients.ts`) creates this membership automatically. If you
ever swap the demo data, make sure that link exists before assigning
homework — otherwise the action returns "No patient is linked to this
recipient yet".

## Pitch line

> Halo turns the gap between hospital and home into a two-way conversation —
> the clinician's chart and the patient's phone share one record, one thread,
> and one plan that updates itself.
