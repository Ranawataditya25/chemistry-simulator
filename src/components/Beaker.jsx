// Beaker.jsx
//
// RULES:
// 1. Total dots always = 100, always fully filled.
// 2. Initial layout (step 0–4, not sim):
//    - darkBlueCount = round(c1 * 100)  — reflects chosen c1
//    - lightBlueCount = 100 - darkBlueCount
//    - redCount = 0
// 3. During simulation (simRunning=true):
//    - The SAME shuffle/positions used at start are kept frozen.
//    - darkBlue count decreases as A decreases.
//    - Red count increases as B increases.
//    - The shuffle is seeded on c1 alone (not A) so positions never change mid-sim.
//    - Conversion goes: dark blue → red, one by one, no flicker.

// ── Seeded LCG random ─────────────────────────────────────────────────────────
function lcg(seed) {
  let s = Math.max(1, Math.abs(Math.round(seed * 10000)));
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function seededShuffle(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Dot grid ─────────────────────────────────────────────────────────────────
const X_POS = [28, 37.25, 46.5, 55.75, 65, 74.25, 83.5, 92.75];
const Y_POS = [
  36.5, 46.083, 55.667, 65.25, 74.833,
  84.417, 94, 103.583, 113.167, 122.75,
  132.333, 141.917,
];

const DOTS = [];
for (let row = 0; row < 12; row++) {
  for (let col = 0; col < 8; col++) {
    if (DOTS.length >= 100) break;
    DOTS.push({ cx: X_POS[col], cy: Y_POS[row] });
  }
}
const TOTAL = 100;

// ── Component ─────────────────────────────────────────────────────────────────
// Props:
//   A          — current [A] value (live during sim, = c1 otherwise)
//   B          — current [B] value (live during sim, = 0 otherwise)
//   c1         — the FROZEN initial concentration (seed for shuffle)
//   simRunning — true when simulation is active or finished
export default function Beaker({ A = 0.8, B = 0, c1 = 0.8, simRunning = false }) {
  const FIXED_MAX = 1.0;

  // During sim: seed shuffle on c1 alone so positions are stable
  // Not sim: seed on A (= c1 at step 0) so step 0 changes update layout
  const shuffleSeed = simRunning ? c1 : A;
  const rand        = lcg(shuffleSeed);
  const shuffled    = seededShuffle(
    Array.from({ length: TOTAL }, (_, i) => i),
    rand
  );

  let darkBlueCount, redCount, lightBlueCount;

  if (simRunning) {
    // Sim: dark-blue converts to red as A drops
    // Both scaled against c1 (the initial amount), not 1.0
    // so red + darkBlue together = c1 * 100, and light blue fills the rest
    const initialDarkBlue = Math.round((c1 / FIXED_MAX) * TOTAL); // e.g. 80
    redCount       = Math.min(
      Math.round((B / FIXED_MAX) * TOTAL),
      initialDarkBlue
    );
    darkBlueCount  = initialDarkBlue - redCount;
    lightBlueCount = TOTAL - initialDarkBlue; // fixed light blue — never changes
  } else {
    // Pre-sim: only dark blue and light blue, reflect current A (= c1 at step 0)
    darkBlueCount  = Math.round((A / FIXED_MAX) * TOTAL);
    redCount       = 0;
    lightBlueCount = TOTAL - darkBlueCount;
  }

  const colorMap = new Array(TOTAL);

// First assign light blue (never changes)
for (let i = 0; i < lightBlueCount; i++) {
  colorMap[shuffled[i]] = "#ADD8E6";
}

// Remaining indices are the dark-blue pool
const darkBluePool = shuffled.slice(lightBlueCount);

// During simulation convert first redCount dark-blue dots to red
for (let i = 0; i < darkBluePool.length; i++) {
  const idx = darkBluePool[i];

  if (i < redCount) {
    colorMap[idx] = "#EF4444"; // converted
  } else {
    colorMap[idx] = "#3B82F6"; // still A
  }
}

  // Text label: always show actual A value
  const labelA = Math.min(Math.max(A, 0), FIXED_MAX);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 flex flex-col items-center min-h-[350px]">
      <h2 className="font-semibold text-gray-700 mb-1 text-sm sm:text-base">Beaker</h2>

      <svg viewBox="0 0 120 160" className="w-44 h-60 sm:w-48 sm:h-64">
        <path
          d="M 20 10 L 20 140 Q 20 150 30 150 L 90 150 Q 100 150 100 140 L 100 10"
          fill="none"
          stroke="#333"
          strokeWidth="3"
        />
        {DOTS.map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={3.5}
            fill={colorMap[i] ?? "#ADD8E6"}
            opacity={0.85}
          />
        ))}
      </svg>

      <p className="text-gray-700 text-sm mt-1">
        [A] = <span className="font-semibold">{labelA.toFixed(2)} M</span>
      </p>
    </div>
  );
}