import { useEffect, useState } from "react";

export default function LandscapeWarning() {
  const [showWarning, setShowWarning] = useState(false);

  const checkOrientation = () => {
    const isMobile = window.innerWidth < 768;
    const isPortrait = window.innerHeight > window.innerWidth;

    // Also check screen orientation if available
    const orientation = screen?.orientation?.type;
    const isLandscape = orientation
      ? orientation.includes("landscape")
      : !isPortrait;

    if (isMobile && !isLandscape) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  useEffect(() => {
    checkOrientation();

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  const requestLandscape = async () => {
    try {
      const el = document.documentElement;

      // Step 1: enter fullscreen
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      }

      // Step 2: lock orientation
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock("landscape");
      }
    } catch (error) {
      alert("Please rotate your device manually.");
    }
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 p-14 bg-gray-100 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-xs">
        <div className="text-orange-500 text-5xl mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Rotate Your Device
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          This chemistry simulator works best in
          <span className="font-semibold text-orange-500"> landscape mode</span>
          .
        </p>

        <button
          onClick={requestLandscape}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
        >
          Turn Landscape Mode On
        </button>
      </div>
    </div>
  );
}
