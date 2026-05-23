import type { PlanItem } from "@/components/plan/cards";

export type CareTeam = {
  id: string;
  name: string;
  specialty: string;
  lead: string;
  accent: "green" | "rose";
  items: PlanItem[];
};

export const CARE_TEAMS: CareTeam[] = [
  {
    id: "ortho",
    name: "Orthopedic recovery",
    specialty: "Right TKA · POD 3",
    lead: "Dr. Renée Lee",
    accent: "green",
    items: [
      {
        id: "ortho-update",
        component: "CareTeamUpdate",
        props: {
          author: "Dr. Renée Lee",
          role: "Orthopedic Surgeon",
          postedAt: "Today, 7:42 AM",
          body: "Margaret — incision photos look clean. Push to a 12-minute walk this afternoon and keep elevation overnight.",
        },
      },
      {
        id: "ortho-activity",
        component: "ActivityPlan",
        props: {
          title: "Afternoon mobility set",
          intensity: "moderate",
          durationMinutes: 18,
          steps: [
            "Warm up with 5 ankle pumps each side.",
            "12-minute hallway walk with walker.",
            "Three sit-to-stand reps, holding for 3 seconds at the top.",
            "Cool down with knee-extension stretches.",
          ],
        },
      },
      {
        id: "ortho-meds",
        component: "MedicationReminder",
        props: {
          medication: "Apixaban",
          dose: "2.5 mg · oral",
          nextDoseAt: "7:30 PM",
          reason: "VTE prophylaxis through POD 14",
          cautions: [
            "Take with food if stomach upset.",
            "Tell us about any new bruising or bleeding.",
          ],
        },
      },
    ],
  },
  {
    id: "cardiac",
    name: "Cardiac rehab",
    specialty: "Post-CABG · week 4",
    lead: "Dr. Marcus Hale",
    accent: "rose",
    items: [
      {
        id: "cardiac-milestone",
        component: "Milestone",
        props: {
          title: "30-minute walk, hills allowed",
          targetDate: "Jun 5",
          status: "in_progress",
          description:
            "You're walking 22 min on flat ground this week — let's add a gentle incline two days in a row before pushing duration.",
        },
      },
      {
        id: "cardiac-activity",
        component: "ActivityPlan",
        props: {
          title: "Tomorrow's cardiac rehab block",
          intensity: "gentle",
          durationMinutes: 24,
          steps: [
            "5 min seated warm-up, focus on breath cadence.",
            "12 min walk at conversational pace, flat ground.",
            "4 min standing balance reps, hand on chair.",
            "3 min cool-down with diaphragmatic breathing.",
          ],
        },
      },
      {
        id: "cardiac-update",
        component: "CareTeamUpdate",
        props: {
          author: "Priya Raman, RN",
          role: "Cardiac Nurse",
          postedAt: "Yesterday, 5:10 PM",
          body: "Resting HR trending down to 68 — great sign. Keep the morning meds spaced 6 hours from evening dose.",
        },
      },
    ],
  },
];
