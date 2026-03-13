// ConcentrationBars.jsx
// Shows a vertical bar chart with two bars: A (blue) and B (red).
// Uses recharts BarChart.

import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";

export default function ConcentrationBars({ A, B }) {
  const data = [
    { name: "A", value: parseFloat(A.toFixed(3)) },
    { name: "B", value: parseFloat(B.toFixed(3)) },
  ];

  // Custom tick to render colored dot + label below bar
  const CustomTick = ({ x, y, payload }) => {
    const color = payload.value === "A" ? "#3b82f6" : "#ef4444";
    return (
      <g transform={`translate(${x},${y})`}>
        <circle cx={0} cy={10} r={5} fill={color} />
        <text x={0} y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill="#374151">
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 flex flex-col items-center min-h-[200px] sm:min-h-[250px] md:min-h-[350px]">
      <h2 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base text-center">
        Concentrations
      </h2>

      <div className="w-full h-[120px] sm:h-[150px] md:h-[200px] lg:h-[220px] mt-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 24, bottom: 20, left: -10 }} barSize={44}>
            <XAxis dataKey="name" tick={<CustomTick />} axisLine={false} tickLine={false} interval={0} />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.2, 0.4, 0.6, 0.8]}
              tick={{ fontSize: 10 }}
              stroke="#cbd5e1"
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              <Cell fill="#3b82f6" />
              <Cell fill="#ef4444" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}