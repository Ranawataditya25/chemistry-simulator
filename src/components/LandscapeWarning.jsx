import { useEffect, useState } from "react";
import Landscape from "../assets/landscape-mode.png";

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
    <div className="fixed inset-0 p-4 bg-gray-100 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-xs">
        <div className="text-5xl mb-4 flex justify-center">
          <img
            src={Landscape}
            className="w-20 h-20 sm:w-20 sm:h-30 md:w-30 md:h-40"
          />
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
