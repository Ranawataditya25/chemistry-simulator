import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import Mascot from "../assets/test-tube-2.svg";

const TOTAL_STEPS = 6;

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
      className={`flex items-center justify-center w-6 h-6
        ${
          disabled
            ? "opacity-20 cursor-default"
            : "opacity-60 hover:opacity-100 cursor-pointer"
        }`}
    >
      <svg viewBox="0 0 16 16" className="w-4 h-4">
        <polygon points={pts[dir]} fill="#374151" />
      </svg>
    </button>
  );
}

export default function TutorialPanel({
  step,
  setStep,
  onStartSim,
  running,
  onReplay,
  k,
}) {
  const STEPS = [
    // 0
    <>
      This is a{" "}
      <span className="text-orange-600 font-semibold">zero order reaction</span>{" "}
      in which a reactant <b>A</b> turns into the product <b>B</b>. But what
      does it mean? <b>Let's find out!</b>
      <br />
      <br />
      <span className="text-orange-600">
        Set the initial concentration of A (c₁) and the initial time at which
        it'll start (t₁).
      </span>
    </>,

    // 1
    <>
      Great! Now you can set the{" "}
      <span className="text-orange-600">
        concentration of A at the end of the reaction (c₂)
      </span>{" "}
      and the{" "}
      <span className="text-orange-600">time the reaction will end (t₂)</span>.
      <br />
      <br />
      This will help us calculate the rate constant k.
    </>,

    // 2
    <>
      The order of a reaction has to do with the rate of it.
      <span className="text-orange-600"> Rate</span> is the rate of change in
      the concentration per unit time.
      <br />
      The rate constant <em className="text-orange-600">k</em> is a value on
      which the
      <span className="text-orange-600"> Rate</span> depends.
      <br />
      For this reaction,
      <span className="text-orange-600 italic font-semibold">
        {" "}
        k = {k.toFixed(3)} M/s
      </span>
      .
    </>,

    // 3
    <>
      <span className="text-orange-600 font-semibold">Half-life (t₁/₂)</span> is
      the time when the concentration of reactant A becomes half of its initial
      value.
      <br />
      For this reaction,
      <span className="text-orange-600 italic"> t₁/₂ = 5.00 s</span>.
    </>,

    // 4
    <>
      Now let's see how the reaction would proceed!
      <br />
      Click{" "}
      <span className="text-orange-600 font-semibold">
        "Start Simulation"
      </span>{" "}
      to begin.
    </>,

    // 5
    <>
      As A disappears, B is being produced. This happens at a variable
      <span className="text-orange-600"> rate</span> which depends on k.
      <br />
      <br />
      For this zero order reaction the rate is constant:
      <span className="text-orange-600 italic font-semibold">
        {" "}
        k = {k.toFixed(3)} M/s
      </span>
      .
      <br />
      <span className="text-orange-600">Click 'Replay' to see it again.</span>
    </>,
  ];

  const isFirst = step === 0;
  const isSimStep = step === 4;
  const isLast = step === TOTAL_STEPS - 1;

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-2 sm:p-4 md:p-5 flex flex-col justify-between min-h-[200px] sm:min-h-[250px] md:min-h-[350px]">
      {/* Speech bubble */}
      <div className="flex items-start gap-1 sm:gap-2 md:gap-3">
        <div className="relative bg-gray-100 rounded-2xl p-3 sm:p-3 md:p-6 flex-1 text-black text-xs sm:text-sm md:text-lg leading-relaxed">
          {STEPS[step]}

          <div
            className="absolute right-[-9px] top-6 w-0 h-0
            border-t-[9px] border-b-[9px] border-l-[9px]
            border-t-transparent border-b-transparent border-l-gray-100"
          />
        </div>

        <div className="flex-shrink-0">
          <img
            src={Mascot}
            className="w-16 h-24 sm:w-20 sm:h-30 md:w-30 md:h-40"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-3 sm:mt-5">
        <ArrowBtn
          dir="left"
          onClick={handleBack}
          disabled={isFirst || running}
          className={`cursor-pointer ${
            isFirst
              ? "text-gray-200 cursor-default"
              : "text-gray-400 hover:text-gray-600"
          }`}
        />

        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer
              ${
                i < step
                  ? "bg-green-400"
                  : i === step
                    ? "bg-orange-400 scale-110"
                    : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {isSimStep ? (
          <button
            onClick={onStartSim}
            className="bg-orange-500 hover:bg-orange-600 text-white
            px-3 py-1 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5"
          >
            Start Simulation
            <ArrowBtn dir="right" />
          </button>
        ) : isLast ? (
          <button
            onClick={onReplay}
            disabled={running}
            className={`px-3 py-1 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5
  ${
    running
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-green-500 hover:bg-green-600 text-white"
  }
`}
          >
            Replay
            <RotateCcw size={15} />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-orange-500 hover:bg-orange-600 text-white
            px-3 py-1 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5"
          >
            Next
            <ArrowBtn dir="right" />
          </button>
        )}
      </div>
    </div>
  );
}
