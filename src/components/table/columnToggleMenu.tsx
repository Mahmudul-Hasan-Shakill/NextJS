"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

type ColumnToggleMenuProps<T> = {
  allColumns: { key: keyof T; label: string }[];
  visibleColumns: (keyof T)[];
  onToggle: (key: keyof T, visible: boolean) => void;
};

export function ColumnToggleMenu<T>({
  allColumns,
  visibleColumns,
  onToggle,
}: ColumnToggleMenuProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex py-5"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel className="text-[10px]">Select columns to view</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allColumns.map((col) => (
          <DropdownMenuCheckboxItem
            key={String(col.key)}
            className="capitalize text-[10px]"
            checked={visibleColumns.includes(col.key)}
            onSelect={(e) => e.preventDefault()} 
            onCheckedChange={(checked) => onToggle(col.key, Boolean(checked))}
          >
            {col.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
