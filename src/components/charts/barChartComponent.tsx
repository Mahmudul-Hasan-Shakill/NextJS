// "use client";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Cell,
//   Legend,
// } from "recharts";

// function getColorFromString(str: string): string {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = str.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   const hue = Math.abs(hash) % 240; // Full hue range
//   const saturation = 40 + (Math.abs(hash) % 30); // 40% to 70%
//   const lightness = 50 + (Math.abs(hash) % 20); // 50% to 70%

//   return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
// }

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-background border border-border rounded-md p-2 text-sm text-black dark:text-white">
//         <p className="font-semibold">{label}</p>
//         <p>{`Value: ${payload[0].value}`}</p>
//       </div>
//     );
//   }

//   return null;
// };

// export const BarChartComponent = ({
//   data,
// }: {
//   data: { name: string; value: number }[];
// }) => {
//   return (
//     <div className="w-full h-[300px] bg-background rounded-xl border border-border p-4 dark:shadow-md shadow-sm">
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" stroke="currentColor" />
//           <YAxis stroke="currentColor" />

//           <Tooltip content={<CustomTooltip />} />

//           {/* <Legend /> */}
//           <Bar
//             dataKey="value"
//             radius={[4, 4, 0, 0]}
//             label={{ position: "top", fill: "currentColor" }}
//           >
//             {data.map((entry) => (
//               <Cell
//                 key={`bar-${entry.name}`}
//                 fill={getColorFromString(entry.name)}
//               />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend,
} from "recharts";
import { useState } from "react";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";

function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 240;
  const saturation = 40 + (Math.abs(hash) % 30);
  const lightness = 50 + (Math.abs(hash) % 20);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-border rounded-md p-2 text-xs text-black dark:text-white shadow">
        <p className="font-semibold">{label}</p>
        <p>{`Total: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export const BarChartComponent = ({
  data,
}: {
  data: { name: string; value: number }[];
}) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [minValue, setMinValue] = useState<number>(0);

  const filteredData = data
    .filter((item) => item.value >= minValue)
    .sort((a, b) =>
      sortOrder === "asc" ? a.value - b.value : b.value - a.value
    );

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">
          Min Value:
          <input
            type="number"
            value={minValue}
            onChange={(e) => setMinValue(Number(e.target.value))}
            className="ml-2 px-2 py-1 border rounded-md dark:bg-zinc-800 dark:text-white"
          />
        </label>
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="px-3 py-1 border rounded-md text-sm dark:bg-zinc-800 dark:text-white flex items-center gap-2"
        >
          {sortOrder === "asc" ? (
            <>
              <ArrowUpWideNarrow size={16} />
              <span className="sr-only">Ascending</span>
            </>
          ) : (
            <>
              <ArrowDownWideNarrow size={16} />
              <span className="sr-only">Descending</span>
            </>
          )}
        </button>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] bg-background rounded-xl border border-border p-4 dark:shadow-md shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="currentColor" className="text-[8px]"/>
            <YAxis stroke="currentColor" className="text-[8px]"/>
            <Tooltip content={<CustomTooltip />} />
            {/* <Legend /> */}
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              label={{ position: "top", fill: "currentColor", fontSize: 12 }}
            >
              {filteredData.map((entry) => (
                <Cell
                  key={`bar-${entry.name}`}
                  fill={getColorFromString(entry.name)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
