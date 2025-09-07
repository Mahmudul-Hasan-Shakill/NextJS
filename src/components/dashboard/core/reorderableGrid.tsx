// src/components/dashboard/core/ReorderableGrid.tsx
"use client";
import { useState } from "react";
import type { BaseWidgetInstance } from "./types";

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const clone = arr.slice();
  const item = clone.splice(from, 1)[0];
  clone.splice(to, 0, item);
  return clone;
}

export default function ReorderableGrid<TType extends string>({
  items,
  className,
  renderItem,
  onReorder,
}: {
  items: BaseWidgetInstance<TType>[];
  className?: string;
  renderItem: (w: BaseWidgetInstance<TType>) => React.ReactNode;
  onReorder: (next: BaseWidgetInstance<TType>[]) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDragId(id);
  const handleDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    if (!dragId || dragId === overId) return;
    const from = items.findIndex((x) => x.id === dragId);
    const to = items.findIndex((x) => x.id === overId);
    if (from === -1 || to === -1) return;
    onReorder(arrayMove(items, from, to));
    setDragId(overId);
  };
  const handleDragEnd = () => setDragId(null);

  return (
    <div className={className}>
      {items.map((w) => (
        <div
          key={w.id}
          draggable
          onDragStart={() => handleDragStart(w.id)}
          onDragOver={(e) => handleDragOver(e, w.id)}
          onDragEnd={handleDragEnd}
          className="relative"
        >
          {renderItem(w)}
        </div>
      ))}
    </div>
  );
}
