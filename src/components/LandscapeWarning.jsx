import { useEffect, useState } from "react"

export default function LandscapeWarning() {

  const [showWarning, setShowWarning] = useState(false)

  const checkOrientation = () => {

    const isMobile = window.innerWidth < 768
    const isPortrait = window.innerHeight > window.innerWidth

    if (isMobile && isPortrait) {
      setShowWarning(true)
    } else {
      setShowWarning(false)
    }

  }

  useEffect(() => {

    checkOrientation()

    window.addEventListener("resize", checkOrientation)

    return () => window.removeEventListener("resize", checkOrientation)

  }, [])

  if (!showWarning) return null

  return (

    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-[100]">

      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-xs">

        <div className="text-orange-500 text-5xl mb-4">
          📱
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Rotate Your Device
        </h2>

        <p className="text-gray-500 text-sm">
          This chemistry simulator works best in
          <span className="font-semibold text-orange-500"> landscape mode</span>.
        </p>

      </div>

    </div>

  )
}