# Halo — Hackathon Demo Script

A presenter's cue card for a 2–3 minute live demo. Open the app to `/` before
you start. Keep one browser window in front of the audience and one terminal
out of sight.

## One-line pitch

> **Not a patient portal. Not a discharge PDF. A daily recovery companion
> connected to the people responsible for your recovery.**

## Why we built this

Most recovery doesn't happen in the hospital — it happens at home, alone, with
a stapled discharge packet and a refrigerator full of intentions. Today's
tools for that gap are a PDF and a portal. Halo is the surface that sits
between them.

The wedge is the loop, not the chat. **Doctor assigns. Patient acts. Care team
sees the signal.** Same record. Same thread. Same plan.

---

## Live demo (≈ 90 seconds)

Run these steps in order. The narration in italics is what you say while you
click — keep it tight.

1. **Landing →** `/` → tap **Nurse** on the demo card.
   *"Demo mode skips sign-in. In production this is Privy passwordless."*

2. **Clinician landing →** `/dashboard` → tap "Today's patient: Margaret
   Okafor."
   *"Margaret had a right total knee replacement three days ago. This is her
   chart."*

3. **Bento chart →** `/recipients/[id]` — 8 tiles in a 3-column grid (vitals,
   labs, meds, I&O, summary, handoff, reports, homework). Tap any tile.
   *"Eight tiles. One viewport. No scrolling to find a vital — tap and the
   tile expands in place."* Close it.

4. **Assign homework →** tap the gold **Assign homework** button in the
   header. Kind = `Walk`. Title = `12-minute hallway walk`. Subtitle =
   `Use the walker.` Submit.
   *"One action just created a task, dropped a message in the doctor–patient
   thread, and updated the audit log."*

5. **Switch role →** top-right "Switch role" → `/` → tap **Patient**.
   *"Same data, different shape."*

6. **Today screen →** `/dashboard` shows the new walk at the top with the
   right kind icon.
   *"The task Dr. Lee assigned 10 seconds ago is on Margaret's phone."*

7. **Check-in →** tap the walk → `/check-in?taskId=…`. Step through:
   - **Incision** → tap to capture (stand-in photo)
   - **Daily** → Walk = Yes · Meds = Yes · Pain = 4 · Sleep = 7h
   - **Feeling** → Mood = Good · note = `felt steady today`
   - **Review** → Submit.

   *"Photo, walk, meds, pain, mood, note — six structured fields, ten taps."*

8. **Success splash →** full-screen green checkmark animation, then bounce
   back to `/dashboard`.

9. **Switch back to Nurse →** `/` → **Nurse** → `/dashboard` → reopen
   Margaret's chart → tap the **Homework** tile.
   *"Same record. Pain badge, photo pill, the patient's own note — all on the
   card the doctor assigned."*

10. **Closing line:**
    > "This is the primitive. The next layer — family support, local recovery
    > resources, AI guidance — all sits on top of this same loop."

### Optional add-ons (only if time allows)

- **Thread message:** open `/messages/[id]` (patient or doctor side) — the
  assignment + completion both appear as structured chat messages.
- **Halo AI / Augur card:** Patient → `/plan` → green FAB → tap the first
  suggestion ("I had fried chicken and fries for lunch") → an Augur insight
  card streams in with parsed foods, predicted impact, nutrition flags, and
  tiered recommendations. *"Same loop, AI side: food log in, structured
  recommendation out."*

---

## What we are / what we are not

**We are**
- The closed-loop primitive between clinician chart and patient phone.
- A daily recovery companion: tasks, check-ins, incision photos, pain, mood,
  notes — all structured.
- A shared record that both sides see in real time.
- A demo of generative-UI cards (Tambo + Zod schemas) shaping recovery
  guidance: care-team updates, activity plans, meal plans, milestones,
  nearby places, recovery shop.
- A foundation for family and local-resource support to compose on top.

**We are not**
- Hooked up to a real EHR. Epic / Cerner integration is roadmap.
- Sending real push or SMS today — everything routes in-app.
- A diagnostic system or a substitute for a clinical visit.
- Running personalized AI on every patient. Augur today returns population-
  prior and stub-blended signals; the validated personal-signal tier needs
  150+ days of patient logging.
- A full family / local-fulfillment / peer-support network yet — those are
  the next layers, sitting on top of the loop we already built.

---

## Why now — and why this is not MyChart

MyChart is a *viewer* for the hospital's record. Halo is the *patient's*
surface, and the only thing the clinician sees from it is a structured
response to a task they authored. That's a different product shape.

1. **Recovery is the gap.** Most patient-facing care happens between visits,
   where today nothing is logged.
2. **Closed-loop authoring beats one-way broadcast.** A discharge PDF is a
   broadcast. Halo is a conversation in structured form.
3. **Generative UI** lets the same primitive scale: today it's a walking
   task, tomorrow it's a `NearbyPlaces` card, then a meal plan, then a
   peer-support group — all on the same chat-shaped surface, all with the
   same author / completion / audit semantics.
4. **Family + local + AI compose on top.** Once the loop exists, the layers
   stack: a daughter can see today's check-in, a social worker can drop in a
   local PT clinic, AI can interpret food logs against the population prior.
   None of that is possible without a structured primitive underneath.

---

## Demo flow checklist

Routes hit, in order. Keep this open in a side panel if you can.

| # | Route                        | Role     | What happens                                   |
| - | ---------------------------- | -------- | ---------------------------------------------- |
| 1 | `/`                          | —        | Demo role picker · pick **Nurse**              |
| 2 | `/dashboard`                 | Nurse    | "Today's patient" CTA → open chart             |
| 3 | `/recipients/[id]`           | Nurse    | Bento grid · 3-col tiles · tap to expand       |
| 4 | `/recipients/[id]`           | Nurse    | Gold **Assign homework** → submit walk         |
| 5 | `/`                          | —        | Top-right Switch role · pick **Patient**       |
| 6 | `/dashboard`                 | Patient  | Today screen · new walk at the top             |
| 7 | `/check-in?taskId=…`         | Patient  | 4-step flow · submit                            |
| 8 | (splash)                     | Patient  | Green checkmark · auto-redirect to `/dashboard`|
| 9 | `/`                          | —        | Switch role · pick **Nurse**                   |
|10 | `/recipients/[id]`           | Nurse    | Open Homework tile · see completed card        |

Optional:
- `/messages/[id]` — same loop visible as chat thread on both sides.
- `/plan` + green FAB → `/ai` — Augur card streams in for food queries.

---

## If something breaks

- **No DB / empty chart?** The seed users + Margaret recipient lazy-create
  the first time Nurse opens the chart. If you see "No patient is linked to
  this recipient yet," picked roles in the wrong order. Just go `/` → Nurse →
  "Today's patient" once before switching to Patient.
- **AI / Augur card doesn't show?** The `/api/augur/predict` route runs the
  prediction. If the suggestion chip returns text instead of a card, the
  food wasn't recognized — fall back to "I had fried chicken and fries for
  lunch" verbatim.

## Final line to land on

> "We didn't build the whole Headspace for recovery. We built the primitive
> that makes it possible. The doctor's hand on the patient's plan, every
> day, with the team that loves them watching."
