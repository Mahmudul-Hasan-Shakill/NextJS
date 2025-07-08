"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";

function getColorFromString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 280;
  return `hsl(${hue}, 40%, 60%)`; // matte tone
}

export const BarChartComponent = ({
  data,
}: {
  data: { name: string; value: number }[];
}) => {
  return (
    <div className="w-full h-[300px] bg-background rounded-xl border border-border p-4 dark:shadow-md shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="currentColor" />
          <YAxis stroke="currentColor" />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            label={{ position: "top", fill: "currentColor" }}
          >
            {data.map((entry) => (
              <Cell
                key={`bar-${entry.name}`}
                fill={getColorFromString(entry.name)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
