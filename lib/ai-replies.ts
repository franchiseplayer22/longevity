import type { PlanItem } from "@/components/plan/cards";

export type AiReply =
  | { kind: "text"; text: string }
  | { kind: "card"; intro?: string; item: PlanItem };

function lc(s: string): string {
  return s.toLowerCase();
}

function nearbyReply(): AiReply {
  return {
    kind: "card",
    intro:
      "A few options near you. The walking group has been popular with knee-replacement patients.",
    item: {
      id: `ai-${Date.now()}-nearby`,
      component: "NearbyPlaces",
      props: {
        title: "Within 2 miles of you",
        intro: "Picked for low-impact recovery this week.",
        places: [
          {
            name: "Riverside Recovery Walkers",
            kind: "group",
            distance: "0.6 mi · Tues / Thu 9am",
            why: "Slow-paced 30-min loop along the river, no incline.",
            cta: "RSVP",
          },
          {
            name: "Cedar Park Loop",
            kind: "park",
            distance: "0.9 mi",
            why: "Flat 0.5-mile paved loop with benches every 200 ft.",
          },
          {
            name: "Halo Physical Therapy",
            kind: "clinic",
            distance: "1.4 mi",
            why: "In-network with your plan; accepts walk-ins after 3pm.",
            cta: "Call clinic",
          },
          {
            name: "Westside Y Aquatic Center",
            kind: "pool",
            distance: "1.8 mi",
            why: "Warm-water therapy pool — cleared starting POD 14.",
          },
        ],
      },
    },
  };
}

function shopReply(): AiReply {
  return {
    kind: "card",
    intro:
      "Here are a few things patients on this protocol reach for most.",
    item: {
      id: `ai-${Date.now()}-shop`,
      component: "RecoveryShop",
      props: {
        title: "For week 1–2 of TKA recovery",
        intro: "Practical, evidence-aligned picks. Tap to learn more.",
        products: [
          {
            name: "Elevation wedge pillow",
            why: "Keeps the knee above the heart while sleeping — cuts swelling overnight.",
            price: "$48",
            retailer: "Halo Marketplace",
          },
          {
            name: "Ice therapy wrap",
            why: "Reusable gel wrap that stays cold for 30 min. Use 3× daily.",
            price: "$36",
            retailer: "Halo Marketplace",
          },
          {
            name: "Reach grabber tool",
            why: "Avoids deep bending while sock and shoe ROM is limited.",
            price: "$22",
            retailer: "PharmaPlus",
          },
        ],
      },
    },
  };
}

function mealReply(): AiReply {
  return {
    kind: "card",
    intro:
      "Something light but iron- and protein-forward — your Hgb is trending down slightly.",
    item: {
      id: `ai-${Date.now()}-meal`,
      component: "MealPlan",
      props: {
        title: "Tonight's recovery plate",
        mealType: "dinner",
        caloriesApprox: 560,
        items: [
          {
            name: "Sheet-pan chicken thighs with lemon",
            why: "Lean protein for tissue repair.",
          },
          {
            name: "Spinach and chickpea sauté",
            why: "Iron-rich to support Hgb recovery.",
          },
          {
            name: "Roasted carrots and farro",
            why: "Slow carbs and fiber.",
          },
        ],
      },
    },
  };
}

const TEXT_FALLBACKS: Array<{ test: RegExp; reply: string }> = [
  {
    test: /pain/i,
    reply:
      "Sorry that pain is back. If it's above 6/10, message Dr. Lee directly — otherwise an ice wrap and elevation usually helps in the next hour.",
  },
  {
    test: /sleep|tired/i,
    reply:
      "Recovery sleep is finicky. Try elevating your leg 20 min before bed and dimming screens by 9pm — most patients see better sleep within a week.",
  },
  {
    test: /sad|down|alone/i,
    reply:
      "That's a normal part of week 2 for a lot of patients. Want me to set up a quick call with Tomás from social work, or surface a peer-support group nearby?",
  },
];

const DEFAULT_TEXT =
  "I can pull up nearby support, recovery products, or a meal plan — just say the word. Or ask me anything and I'll loop in your care team if needed.";

export function resolveReply(input: string): AiReply {
  const text = lc(input);
  if (/(\bwalk\b|group|nearby|park|pool|clinic)/i.test(text)) {
    return nearbyReply();
  }
  if (/(\bbuy\b|product|shop|pillow|brace|grabber)/i.test(text)) {
    return shopReply();
  }
  if (/(\beat\b|meal|food|dinner|breakfast|lunch)/i.test(text)) {
    return mealReply();
  }
  for (const f of TEXT_FALLBACKS) {
    if (f.test.test(text)) return { kind: "text", text: f.reply };
  }
  return { kind: "text", text: DEFAULT_TEXT };
}

export const AI_SUGGESTIONS = [
  "Find a walking group near me",
  "What should I eat tonight?",
  "Show products that help recovery",
];
