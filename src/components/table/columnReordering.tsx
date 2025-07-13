"use client";

import { useState } from "react";

type ColumnReorderingProps<T> = {
  columns: { key: keyof T; label: string }[];
  visibleColumns: (keyof T)[];
  onReorder: (newOrder: (keyof T)[]) => void;
  children: (props: {
    draggedColumn: keyof T | null;
    hoveredColumn: keyof T | null;
    handleDragStart: (columnKey: keyof T) => void;
    handleDragOver: (columnKey: keyof T) => void;
    handleDragEnd: () => void;
    handleDrop: (targetColumn: keyof T) => void;
  }) => React.ReactNode;
};

export function ColumnReordering<T>({
  columns,
  visibleColumns,
  onReorder,
  children,
}: ColumnReorderingProps<T>) {
  const [draggedColumn, setDraggedColumn] = useState<keyof T | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<keyof T | null>(null);

  const handleDragStart = (columnKey: keyof T) => {
    setDraggedColumn(columnKey);
  };

  const handleDragOver = (columnKey: keyof T) => {
    if (draggedColumn && draggedColumn !== columnKey) {
      setHoveredColumn(columnKey);
    }
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setHoveredColumn(null);
  };

  const handleDrop = (targetColumn: keyof T) => {
    if (!draggedColumn || draggedColumn === targetColumn) return;

    const currentIndex = visibleColumns.indexOf(draggedColumn);
    const targetIndex = visibleColumns.indexOf(targetColumn);

    const newVisibleColumns = [...visibleColumns];
    newVisibleColumns.splice(currentIndex, 1);
    newVisibleColumns.splice(targetIndex, 0, draggedColumn);

    onReorder(newVisibleColumns);
    setHoveredColumn(null);
  };

  return children({
    draggedColumn,
    hoveredColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  });
}
