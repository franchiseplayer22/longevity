type LabTrend = "up" | "down" | "stable";
export type Lab = {
  name: string;
  value: number;
  unit: string;
  ref: string;
  trend: LabTrend;
};

const LABS: Lab[] = [
  { name: "Hgb", value: 11.6, unit: "g/dL", ref: "12.0 – 15.5", trend: "down" },
  { name: "WBC", value: 9.8, unit: "K/µL", ref: "4.5 – 11.0", trend: "stable" },
  { name: "CRP", value: 22, unit: "mg/L", ref: "< 5", trend: "down" },
  { name: "Creatinine", value: 0.9, unit: "mg/dL", ref: "0.6 – 1.1", trend: "stable" },
  { name: "K+", value: 4.1, unit: "mmol/L", ref: "3.5 – 5.0", trend: "stable" },
  { name: "INR", value: 1.1, unit: "", ref: "0.9 – 1.2", trend: "stable" },
];

export const MARGARET_CHART = {
  recipient: {
    name: "Margaret Okafor",
    age: 68,
    pronouns: "she/her",
    mrn: "HHX-0421",
    procedure: "Right total knee arthroplasty",
    postopDay: 3,
    surgeon: "Dr. Renée Lee, Orthopedic Surgery",
    admittedAt: "2026-05-20",
    expectedDischarge: "2026-05-26",
    allergies: ["Penicillin (rash)", "Latex (contact)"],
    codeStatus: "Full code",
  },
  vitals: {
    capturedAt: "2026-05-23T07:42:00",
    bp: "118 / 74",
    hr: 72,
    temp: 98.4,
    spo2: 97,
    rr: 16,
    painScore: 4,
  },
  trend: {
    bp: [
      { t: "May 21", v: "128 / 82" },
      { t: "May 22", v: "122 / 78" },
      { t: "May 23", v: "118 / 74" },
    ],
    hr: [
      { t: "May 21", v: 84 },
      { t: "May 22", v: 78 },
      { t: "May 23", v: 72 },
    ],
  },
  labs: LABS,
  meds: [
    {
      name: "Apixaban",
      dose: "2.5 mg PO BID",
      route: "Oral",
      lastGiven: "Today 7:50 AM",
      indication: "VTE prophylaxis",
    },
    {
      name: "Acetaminophen",
      dose: "650 mg PO q6h PRN",
      route: "Oral",
      lastGiven: "Today 6:00 AM",
      indication: "Pain",
    },
    {
      name: "Oxycodone",
      dose: "5 mg PO q6h PRN",
      route: "Oral",
      lastGiven: "Yesterday 9:40 PM",
      indication: "Breakthrough pain",
    },
    {
      name: "Enoxaparin",
      dose: "40 mg SC daily",
      route: "Subcutaneous",
      lastGiven: "Today 8:00 AM",
      indication: "VTE prophylaxis",
    },
    {
      name: "Cefazolin",
      dose: "Discontinued",
      route: "IV",
      lastGiven: "May 21",
      indication: "Surgical prophylaxis · complete",
    },
  ],
  io: {
    intake24h: { ml: 2100, breakdown: "PO 1700 · IV 400" },
    output24h: { ml: 1850, breakdown: "Urine 1700 · Drain 150" },
  },
  summary:
    "POD #3 post right TKA. Pain well-controlled on PRN regimen. Hgb mildly down but trending stable; CRP improving. Ambulating with walker 2× per day. Plan: continue current regimen, PT escalation today, target discharge POD #6.",
  handoff: [
    "Watch incision for redness — patient logging daily photos.",
    "Continue VTE prophylaxis; recheck Hgb on POD #5.",
    "PT to advance gait training; pool therapy not yet cleared.",
    "Family contact: daughter Amaka (primary). Call before discharge planning.",
  ],
  careTeam: [
    { name: "Dr. Renée Lee", role: "Orthopedic Surgeon", phone: "555-0142" },
    { name: "Jordan Park, PT", role: "Physical Therapy", phone: "555-0188" },
    { name: "Aisha Chen, RN", role: "Floor Nurse", phone: "555-0152" },
    { name: "Tomás Alvarez, MSW", role: "Social Work", phone: "555-0173" },
    { name: "Amaka Okafor", role: "Daughter · primary contact", phone: "555-0166" },
  ],
};

export type MargaretChart = typeof MARGARET_CHART;
