import type { LucideIcon } from "lucide-react";

export type IconBadgeTone =
  | "green"
  | "gold"
  | "sky"
  | "rose"
  | "violet"
  | "slate";

const TONE: Record<IconBadgeTone, { bg: string; fg: string }> = {
  green: { bg: "bg-[color:var(--halo-green-soft)]", fg: "text-[color:var(--halo-green)]" },
  gold: { bg: "bg-[#f6ecd6]", fg: "text-[color:var(--halo-gold)]" },
  sky: { bg: "bg-sky-50", fg: "text-sky-700" },
  rose: { bg: "bg-rose-50", fg: "text-rose-700" },
  violet: { bg: "bg-violet-50", fg: "text-violet-700" },
  slate: { bg: "bg-slate-100", fg: "text-slate-700" },
};

export function IconBadge({
  icon: Icon,
  tone = "green",
  size = "md",
}: {
  icon: LucideIcon;
  tone?: IconBadgeTone;
  size?: "sm" | "md" | "lg";
}) {
  const { bg, fg } = TONE[tone];
  const sizing =
    size === "sm"
      ? "h-8 w-8 rounded-lg"
      : size === "lg"
        ? "h-12 w-12 rounded-2xl"
        : "h-10 w-10 rounded-xl";
  const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-5 w-5" : "h-4.5 w-4.5";

  return (
    <span className={`inline-flex flex-none items-center justify-center ${sizing} ${bg} ${fg}`}>
      <Icon className={iconSize} />
    </span>
  );
}
