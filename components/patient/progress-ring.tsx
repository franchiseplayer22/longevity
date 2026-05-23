export function ProgressRing({
  value,
  size = 96,
  stroke = 9,
  label,
  sublabel,
  trackClass = "stroke-white/25",
  fillClass = "stroke-white",
  textClass = "text-white",
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  trackClass?: string;
  fillClass?: string;
  textClass?: string;
}) {
  const clamped = Math.max(0, Math.min(1, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * clamped;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={trackClass}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          className={fillClass}
        />
      </svg>
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-center ${textClass}`}
      >
        {label && <span className="text-xl font-semibold leading-none">{label}</span>}
        {sublabel && (
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.18em] opacity-80">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
