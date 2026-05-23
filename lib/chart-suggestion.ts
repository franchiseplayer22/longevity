export type ChartSuggestion = {
  kind: "pain" | "med" | "sleep" | "vital";
  label: string;
  value?: string | number;
};

const PAIN_RE = /\bpain\s+(?:is\s+|of\s+|at\s+)?(\d{1,2})(?:\s*\/\s*10)?\b/i;
const SLEEP_RE = /\bslept\s+(\d{1,2}(?:\.\d)?)\s*(?:hours|hrs|h)\b/i;
const MED_RE = /\btook\s+(?:my\s+)?([a-z][a-z0-9-]{2,})\b/i;

export function extractChartSuggestions(body: string): ChartSuggestion[] {
  const out: ChartSuggestion[] = [];
  const pain = body.match(PAIN_RE);
  if (pain) {
    const score = Number(pain[1]);
    if (score >= 0 && score <= 10) {
      out.push({ kind: "pain", label: `Pain ${score}/10`, value: score });
    }
  }
  const sleep = body.match(SLEEP_RE);
  if (sleep) {
    out.push({ kind: "sleep", label: `Sleep ${sleep[1]}h`, value: Number(sleep[1]) });
  }
  const med = body.match(MED_RE);
  if (med) {
    out.push({ kind: "med", label: `Med: ${med[1]}`, value: med[1] });
  }
  return out;
}
