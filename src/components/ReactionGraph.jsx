// ReactionGraph.jsx
//
// Step 0: ▲▼ controls c1 (y), ◀▶ controls t1 (x). Shows a single dot at (t1, c1).
// Step 1+: ▲▼ controls c2 (y), ◀▶ controls t2 (x). Shows full A↘ and B↗ lines.
// Step 5 (sim): live trace of A and B during simulation.

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

const Y_MIN = 0.0;
const Y_MAX = 1.0;
const Y_STEP = 0.1;
const Y_TICKS = Array.from(
  { length: Math.round((Y_MAX - Y_MIN) / Y_STEP) + 1 },
  (_, i) => parseFloat((Y_MIN + i * Y_STEP).toFixed(2)),
);

const X_MIN = 0.0;
const X_MAX = 9.5;
const X_STEP = 0.5;
const X_TICKS = Array.from(
  { length: Math.round((X_MAX - X_MIN) / X_STEP) + 1 },
  (_, i) => parseFloat((X_MIN + i * X_STEP).toFixed(1)),
);

// Filled triangle arrow button
function ArrowBtn({ dir, onClick, disabled }) {
  const pts = {
    up: "8,1 1,15 15,15",
    down: "8,15 1,1 15,1",
    left: "1,8 15,1 15,15",
    right: "15,8 1,1 1,15",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center w-5 h-5
        ${disabled ? "opacity-20 cursor-default" : "opacity-50 hover:opacity-90 cursor-pointer"}`}
    >
      <svg viewBox="0 0 16 16" className="w-3 h-3">
        <polygon points={pts[dir]} fill={disabled ? "#94a3b8" : "#374151"} />
      </svg>
    </button>
  );
}

const CustomXTick = ({ x, y, payload }) => (
  <text x={x} y={y + 14} textAnchor="middle" fontSize={6} fill="#64748b">
    {Number.isInteger(payload.value)
      ? `${payload.value}.0s`
      : `${payload.value}s`}
  </text>
);

const CustomYTick = ({ x, y, payload }) => (
  <text x={x - 2} y={y + 3} textAnchor="end" fontSize={6} fill="#64748b">
    {payload.value.toFixed(2)}
  </text>
);

export default function ReactionGraph({
  step,
  simA,
  simB,
  running,
  c1,
  t1,
  onC1Change,
  onT1Change,
  c2,
  t2,
  onC2Change,
  onT2Change,
}) {
  // Simulation trace
  const [trace, setTrace] = useState([]);
  const wasRunning = useRef(false);

  useEffect(() => {
    if (running && !wasRunning.current) {
      setTrace([{ time: t1, A: c1, B: 0 }]);
    }
    wasRunning.current = running;
  }, [running, c1, t1]);

  useEffect(() => {
    if (!running || simA === undefined) return;
    const k = t2 - t1 !== 0 ? Math.abs((c2 - c1) / (t2 - t1)) : 0.0001;
    const elapsed = t1 + parseFloat(((c1 - Math.max(simA, 0)) / k).toFixed(1));
    setTrace((prev) => {
      const last = prev[prev.length - 1];
      if (last?.time === elapsed) return prev;
      return [
        ...prev,
        {
          time: elapsed,
          A: parseFloat(simA.toFixed(4)),
          B: parseFloat((simB ?? 0).toFixed(4)),
        },
      ];
    });
  }, [simA, simB, running, c1, c2, t2, t1]);

  // Step 0: single dot, no lines
  // Step 1+: full static lines from (t1,c1) to (t2,c2) and (t1,0) to (t2,c1-c2)
  // Step 5 running: live trace
  const showLines = step >= 1;
  const showSim = step >= 5 && running;

  // Static line for steps 1–4: two points define each straight line
  const staticData = [
    { time: t1, A: c1, B: 0 },
    { time: t2, A: c2, B: c1 - c2 },
  ];

  const chartData = showSim
    ? trace
    : showLines
      ? staticData
      : [{ time: t1, A: c1, B: 0 }];

  // Controls are only active at their respective step; frozen after that
  const isStep0 = step === 0;
  const ctrlLocked = step > 1; // step 2+ → all arrows disabled

  // Y control: step 0 → c1, step 1 → c2, else frozen (show last active value)
  const yVal = running && simA !== undefined ? simA : isStep0 ? c1 : c2;
  const yOnChange = isStep0 ? onC1Change : onC2Change;
  const yMin = isStep0 ? 0.2 : 0.0;
  const yMax = isStep0 ? 1.0 : parseFloat((c1 - 0.1).toFixed(2));

  const handleYUp = () => {
    if (ctrlLocked) return;
    const n = parseFloat((yVal + Y_STEP).toFixed(2));
    if (n <= yMax) yOnChange(n);
  };
  const handleYDown = () => {
    if (ctrlLocked) return;
    const n = parseFloat((yVal - Y_STEP).toFixed(2));
    if (n >= yMin) yOnChange(n);
  };

  // X control: step 0 → t1, step 1 → t2, else frozen
  const xVal = isStep0 ? t1 : t2;
  const xOnChange = isStep0 ? onT1Change : onT2Change;
  const xMin = isStep0 ? 0.0 : parseFloat((t1 + 0.5).toFixed(1));
  const xMax = 9.5;

  const handleXLeft = () => {
    if (ctrlLocked) return;
    const n = parseFloat((xVal - X_STEP).toFixed(1));
    if (n >= xMin) xOnChange(n);
  };
  const handleXRight = () => {
    if (ctrlLocked) return;
    const n = parseFloat((xVal + X_STEP).toFixed(1));
    if (n <= xMax) xOnChange(n);
  };

  // Setting label
  let settingLabel = "";
  if (step === 0)
    settingLabel = `c₁ = ${c1.toFixed(2)} M, t₁ = ${t1.toFixed(1)} s`;
  else if (step === 1)
    settingLabel = `c₂ = ${c2.toFixed(2)} M, t₂ = ${t2.toFixed(1)} s`;
  else if (running)
    settingLabel = `[A] = ${(simA ?? c1).toFixed(3)} M, t = ${(t1 + (c1 - (simA ?? c1)) / Math.abs((c2 - c1) / (t2 - t1))).toFixed(1)} s`;
  else settingLabel = `c₁ = ${c1.toFixed(2)} M → c₂ = ${c2.toFixed(2)} M`;

  // Time display for X control row
  const k = Math.abs((c2 - c1) / (t2 - t1));

  const displayTime = running
    ? parseFloat(((c1 - Math.max(simA ?? c1, 0)) / k).toFixed(1))
    : xVal;

  // Dot renderer for lines
  const makeDot = (color) => (props) => {
    if (showSim) {
      const last = trace[trace.length - 1];
      if (props.payload?.time === last?.time)
        return (
          <circle
            key={color}
            cx={props.cx}
            cy={props.cy}
            r={5}
            fill={color}
            stroke="white"
            strokeWidth={1.5}
          />
        );
      return null;
    }
    // Static: dot at start (gray) and end (colored)
    if (props.index === 0)
      return (
        <circle
          key="s"
          cx={props.cx}
          cy={props.cy}
          r={5}
          fill="#94a3b8"
          stroke="white"
          strokeWidth={1.5}
        />
      );
    if (props.index === 1)
      return (
        <circle
          key="e"
          cx={props.cx}
          cy={props.cy}
          r={5}
          fill={color}
          stroke="white"
          strokeWidth={1.5}
        />
      );
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-1 sm:p-3 md:p-4 lg:p-5 flex flex-col min-h-[200px] sm:min-h-[250px] md:min-h-[350px]">
      <h2 className="font-semibold text-gray-700 mb-0 text-sm sm:text-base text-center">
        Concentration vs Time
      </h2>

      <div className="flex items-stretch gap-0 flex-1 mt-1 sm:mt-3 md:mt-4 lg:mt-5">
        {/* Y-axis control */}
        <div className="flex flex-col items-center justify-center gap-1 w-8 sm:w-10 shrink-0 select-none">
          <ArrowBtn
            dir="up"
            onClick={handleYUp}
            disabled={ctrlLocked || yVal >= yMax}
          />
          <div className="text-center leading-snug">
            <p className="text-gray-500 text-[8px] sm:text-[10px] font-medium">
              [A]
            </p>
            <p className="text-orange-500 text-[8px] sm:text-[10px] font-bold">
              {yVal.toFixed(2)}
            </p>
            <p className="text-orange-500 text-[8px] sm:text-[10px] font-bold">
              M
            </p>
          </div>
          <ArrowBtn
            dir="down"
            onClick={handleYDown}
            disabled={ctrlLocked || yVal <= yMin}
          />
        </div>

        {/* Recharts */}
        <div className="flex-1 h-[120px] sm:h-[140px] md:h-[180px] lg:h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
            >
              <CartesianGrid stroke="#f0f4f8" vertical={false} />

              <XAxis
                dataKey="time"
                domain={[0, 10]}
                type="number"
                ticks={X_TICKS}
                tick={<CustomXTick />}
                stroke="#64748b"
                strokeWidth={1.5}
                tickLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                interval={1}
              />

              <YAxis
                domain={[0, Y_MAX + Y_STEP]}
                ticks={Y_TICKS}
                tick={<CustomYTick />}
                stroke="#64748b"
                strokeWidth={1.5}
                width={24}
                tickLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
              />

              {/* Step 0: dot at (t1, c1) */}
              {step === 0 && (
                <>
                  <Line
                    dataKey="A"
                    stroke="transparent"
                    dot={
                      <circle
                        r={5}
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth={1.5}
                      />
                    }
                    activeDot={false}
                  />
                  <ReferenceLine
                    x={t1}
                    stroke="#ea580c"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                  <ReferenceLine
                    y={c1}
                    stroke="#ea580c"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </>
              )}

              {/* Steps 1+: A and B lines */}
              {showLines && (
                <>
                  <Line
                    dataKey="A"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={makeDot("#3b82f6")}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    dataKey="B"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={makeDot("#ef4444")}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* X-axis / time control */}
      <div className="flex items-center justify-center gap-2 mt-0.5 sm:mt-1 select-none">
        <ArrowBtn
          dir="left"
          onClick={handleXLeft}
          disabled={ctrlLocked || xVal <= xMin}
        />
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          Time:{" "}
          <span className="text-cyan-500 font-bold">
            {displayTime.toFixed(1)} s
          </span>
        </span>
        <ArrowBtn
          dir="right"
          onClick={handleXRight}
          disabled={ctrlLocked || xVal >= xMax}
        />
      </div>

      <p className="text-[8px] sm:text-[10px] text-gray-400 text-center mt-0 sm:mt-0.5 px-2 truncate">
        {settingLabel}
      </p>
    </div>
  );
}
