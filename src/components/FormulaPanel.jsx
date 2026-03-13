// FormulaPanel.jsx
// Left-aligned throughout.
// The "?" boxes appear INLINE after each LaTeX equation on the same line.
// Uses KaTeX via @matejmazur/react-katex.
// All values derived from live c1, t1, c2, t2 props.

import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

const K_FIXED = 0.08;

// Dashed fill-in box
function Box({ value, orange = false }) {
  return (
    <span
      className={`inline-block border-2 border-dashed rounded px-1 py-0.5 mx-0.5 text-xs sm:text-sm font-mono align-middle whitespace-nowrap
        ${
          orange
            ? "border-orange-400 text-orange-500 bg-orange-50"
            : "border-gray-300 text-gray-600 bg-gray-50"
        }`}
    >
      {value}
    </span>
  );
}

// Inline stacked fraction (num over den)
function Frac({ num, den }) {
  return (
    <span className="inline-flex flex-col items-center align-middle mx-0.5 text-xs sm:text-sm leading-tight">
      <span className="border-b border-gray-500 px-1.5 text-center whitespace-nowrap">
        {num}
      </span>
      <span className="px-1.5 text-center whitespace-nowrap">{den}</span>
    </span>
  );
}

// Inline KaTeX — renders inline (not block) so it sits in a flex row
function InlineTex({ math }) {
  return <TeX math={math} block={false}/>;
}

export default function FormulaPanel({
  step,
  c1 = 0.8,
  t1 = 0.0,
  c2 = 0.0,
  t2 = 10.0,
}) {
  // Derived values
  const dc = parseFloat((c2 - c1).toFixed(2));
  const dt = parseFloat((t2 - t1).toFixed(2));

  const k = dt !== 0 ? parseFloat(Math.abs(dc / dt).toFixed(3)) : 0;

  const half = k !== 0 ? parseFloat((c1 / (2 * k)).toFixed(2)) : 0;

  const showK = step >= 1;
  const showHalf = step >= 3;
  const showLaw = step >= 4;

  return (
    <div className="bg-white rounded-2xl shadow-md p-2 sm:p-4 md:p-5 space-y-2 sm:space-y-4 overflow-x-auto text-xs sm:text-sm md:text-[17px] min-h-[200px] sm:min-h-[250px] md:min-h-[350px]">
      {/* ── Row 1: Main equation + inline boxes ─────────────────── */}
      {/* Line 1a: LaTeX main formula */}
      <div className="text-left">
        <InlineTex
          math={String.raw`\text{Rate} = k = -\dfrac{\Delta c}{\Delta t} = -\dfrac{c_2 - c_1}{t_2 - t_1}`}
        />
      </div>

      {/* Line 1b: filled-in numeric row */}
      <div className="flex items-center gap-x-1 text-lg sm:text-xl whitespace-nowrap">
        <span>Rate =</span>
        {showK ? <Box value={k.toFixed(3)} /> : <Box value="?" orange />}
        <span>= −</span>
        {showK ? (
          <Frac num={dc.toFixed(2)} den={dt.toFixed(2)} />
        ) : (
          <span className="inline-flex flex-col gap-0.5">
            <Box value="?" orange />
            <Box value="?" orange />
          </span>
        )}
        <span>= −</span>
        {showK ? (
          <Frac
            num={`${c2.toFixed(2)} − ${c1.toFixed(2)}`}
            den={`${t2.toFixed(2)} − ${t1.toFixed(2)}`}
          />
        ) : (
          <span className="inline-flex flex-col gap-0.5">
            <span className="border-2 border-dashed border-orange-400 rounded px-1.5 py-0.5 text-orange-500 text-xs bg-orange-50 whitespace-nowrap">
              c₂ − {c1.toFixed(2)}
            </span>
            <span className="border-2 border-dashed border-orange-400 rounded px-1.5 py-0.5 text-orange-500 text-xs bg-orange-50 whitespace-nowrap">
              t₂ − {t1.toFixed(2)}
            </span>
          </span>
        )}
      </div>

      {/* ── Row 2: Half-life ──────────────────────────────────────── */}
      {/* Line 2a: LaTeX */}
      <div className="flex items-center gap-x-1 text-left whitespace-nowrap">
        <InlineTex math={String.raw`t_{1/2} = \dfrac{[A]_0}{2k}`} />
        {/* inline "?" or expanded value right after the LaTeX */}
        {!showHalf && <Box value="?" orange />}
      </div>
      {/* Line 2b: expanded values (when revealed) */}
      {showHalf && (
        <div className="flex items-center gap-1 text-gray-700 text-xs sm:text-sm -mt-2 whitespace-nowrap">
          <Box value={half.toFixed(2)} />
          <span>=</span>
          <Box value={c1.toFixed(2)} />
          <span>/ (2 ×</span>
          <Box value={k.toFixed(3)} />
          <span>)</span>
        </div>
      )}

      {/* ── Row 3: Rate law ───────────────────────────────────────── */}
      {/* Line 3a: LaTeX */}
      <div className="flex items-center gap-x-1 text-left whitespace-nowrap">
        <InlineTex math={String.raw`\text{Rate} = k[A]^0`} />
        {!showLaw && <Box value="?" orange />}
      </div>
      {/* Line 3b: expanded values (when revealed) */}
      {showLaw && (
        <div className="flex items-center gap-1 text-gray-700 text-xs sm:text-sm -mt-2 whitespace-nowrap">
          <Box value={k.toFixed(3)} />
          <span>=</span>
          <Box value={k.toFixed(3)} />
          <span>× (</span>
          <Box value={c1.toFixed(2)} />
          <span>)⁰</span>
        </div>
      )}
    </div>
  );
}
