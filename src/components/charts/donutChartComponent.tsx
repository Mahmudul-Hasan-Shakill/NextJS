"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { useState } from "react";

function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 250;
  const saturation = 40 + (Math.abs(hash) % 30);
  const lightness = 50 + (Math.abs(hash) % 20);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value, payload: fullPayload } = payload[0];
    const total = fullPayload?.total;
    const percentage = total ? ((value / total) * 100).toFixed(1) : null;

    return (
      <div className="bg-white dark:bg-zinc-900 border border-border rounded-md p-2 text-xs text-black dark:text-white shadow">
        <p className="font-semibold">{`${name} ${value}`}</p>
        {percentage && <p>{percentage}%</p>}
      </div>
    );
  }

  return null;
};

// Custom zoom effect for hovered slice
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 10}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
};

export const DonutChartComponent = ({
  data,
}: {
  data: { name: string; value: number }[];
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = data.map((item) => ({ ...item, total }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          label
          activeShape={renderActiveShape}
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={getColorFromString(entry.name)}
              stroke={index === activeIndex ? "#333" : undefined}
              strokeWidth={index === activeIndex ? 2 : 1}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
      </PieChart>
    </ResponsiveContainer>
  );
};
