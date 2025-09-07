// components/charts/barChartComponent.tsx
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
} from "recharts";
import { useMemo, useState } from "react";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";

function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 240;
  const saturation = 55;
  const lightness = 55;
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
  height = 360,
  title = "",
  searchable = true,
}: {
  data: { name: string; value: number }[];
  height?: number;
  title?: string;
  searchable?: boolean;
}) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [q, setQ] = useState("");

  const filteredData = useMemo(() => {
    const rows = (data || [])
      .filter((d) => !q || d.name.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) =>
        sortOrder === "asc" ? a.value - b.value : b.value - a.value
      );
    return rows;
  }, [data, q, sortOrder]);

  return (
    <div className="w-full rounded-2xl border bg-white dark:bg-zinc-950 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          {searchable && (
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search version…"
              className="px-2 py-1 border rounded-md text-xs dark:bg-zinc-900"
            />
          )}
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="px-2 py-1 border rounded-md text-xs flex items-center gap-1 dark:bg-zinc-900"
          >
            {sortOrder === "asc" ? (
              <>
                <ArrowUpWideNarrow size={14} />
                ASC
              </>
            ) : (
              <>
                <ArrowDownWideNarrow size={14} />
                DESC
              </>
            )}
          </button>
        </div>
      </div>

      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData} barCategoryGap={8}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke="currentColor"
              tick={{ fontSize: 10 }}
              interval={0}
              height={60}
              tickFormatter={(v: string) =>
                v.length > 18 ? v.slice(0, 16) + "…" : v
              }
            />
            <YAxis stroke="currentColor" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              label={{ position: "top", fill: "currentColor", fontSize: 11 }}
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
