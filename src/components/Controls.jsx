export default function Controls({ start, pause, reset }) {

  return (

    <div className="bg-slate-800 p-4 rounded">

      <h2 className="mb-3 font-semibold">
        Controls
      </h2>

      <div className="space-x-3">

        <button
          onClick={start}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Start
        </button>

        <button
          onClick={pause}
          className="bg-yellow-500 px-4 py-2 rounded"
        >
          Pause
        </button>

        <button
          onClick={reset}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Reset
        </button>

      </div>

    </div>

  )
}