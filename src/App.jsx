import { useState, useEffect } from "react";

import Navbar            from "./components/Navbar";
import Beaker            from "./components/Beaker";
import ReactionGraph     from "./components/ReactionGraph";
import ConcentrationBars from "./components/ConcentrationBars";
import FormulaPanel      from "./components/FormulaPanel";
import TutorialPanel     from "./components/TutorialPanel";

import useSimulation from "./simulation/useSimulation";
import LandscapeWarning from "./components/LandscapeWarning"

export default function App() {
  const sim = useSimulation();

  const [step, setStep] = useState(0);

  // Step 0: user sets c1 and t1 (locked after step 0)
  const [c1, setC1] = useState(0.80);
  const [t1, setT1] = useState(0.0);

  // Step 1: user sets c2 and t2 (locked after step 1)
  const [c2, setC2] = useState(0.00);
  const [t2, setT2] = useState(10.0);

  const dc = c2 - c1;
const dt = t2 - t1;

const k =
  dt !== 0
    ? Math.abs(dc / dt)
    : 0;

  useEffect(() => {
    if (step < 5) sim.reset();
  }, [step]);

  // ── Beaker display logic ──────────────────────────────────────────
  // The beaker ALWAYS shows c1 as the dark-blue count (frozen after step 0).
  // During simulation: dark-blue dots convert to red as A decreases.
  // Steps 1–4 (not sim): beaker shows c1 dark blue, 0 red (frozen display).
  //
  // We pass `frozenC1` as the initial A0 for the beaker so the dot
  // layout seed is stable (same shuffle as when sim starts).
  const beakerA = sim.running || sim.finished ? sim.A : c1;
  const beakerB = sim.running || sim.finished ? sim.B : 0.0;

  // ── Bottom-row concentration display (text + bars) ───────────────
  // step 0: show c1, 0
  // steps 1–4: show 0, c1 (reaction complete conceptually)
  // sim: live sim.A, sim.B
  // Concentration bars display logic

const displayA =
  sim.running || sim.finished
    ? sim.A
    : c1;

const displayB =
  sim.running || sim.finished
    ? sim.B
    : 0;

  const handleStartSim = () => {
    setStep(5);
    sim.startWith(c1, k, t2);
  };

  const handleReplay = () => {
  sim.startWith(c1, k, t2);
};

  const handleSetStep = (s) => {
    if (s < 5) sim.reset();
    setStep(s);
  };

  // Controls are only editable at their respective step
  // step 0 → c1/t1 editable; step 1 → c2/t2 editable; step 2+ → frozen
  const handleC1Change = (v) => { if (step === 0) setC1(v); };
  const handleT1Change = (v) => { if (step === 0) setT1(v); };
  const handleC2Change = (v) => { if (step === 1) setC2(v); };
  const handleT2Change = (v) => { if (step === 1) setT2(v); };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <LandscapeWarning />
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full px-1 sm:px-3 md:px-5 pt-4 pb-2 sm:pt-6 sm:pb-4 space-y-4 sm:space-y-7 flex flex-col">

        <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4 flex-shrink-0">

          {/* Beaker: shows c1-locked dots, converts dark-blue → red during sim */}
          <Beaker
            A={beakerA}
            B={beakerB}
            c1={c1}
            simRunning={sim.running || sim.finished}
          />

          <ReactionGraph
            step={step}
            simA={sim.running ? sim.A : undefined}
            simB={sim.running ? sim.B : undefined}
            running={sim.running}
            c1={c1} t1={t1} onC1Change={handleC1Change} onT1Change={handleT1Change}
            c2={c2} t2={t2} onC2Change={handleC2Change} onT2Change={handleT2Change}
          />

          <ConcentrationBars A={displayA} B={displayB} />

        </div>

        <div className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-4 flex-shrink-0">

          <FormulaPanel step={step} c1={c1} t1={t1} c2={c2} t2={t2} />

          <TutorialPanel
           k={k}
            step={step}
            setStep={handleSetStep}
            onStartSim={handleStartSim}
            running={sim.running}
            onReplay={handleReplay}
          />

        </div>

      </div>
    </div>
  );
}