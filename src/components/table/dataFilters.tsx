"use client";

import React, { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Funnel } from "lucide-react";

interface DataFilterProps<T> {
  columnKey: keyof T;
  data: T[];
  selectedFilters: any[];
  onFilterChange: (selected: any[]) => void;
}

export function DataFilter<T extends object>({
  columnKey,
  data,
  selectedFilters,
  onFilterChange,
}: DataFilterProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const uniqueValues = useMemo(() => {
    const allValues = data.map((item) => item[columnKey]);
    return Array.from(new Set(allValues));
  }, [data, columnKey]);

  const filteredValues = useMemo(() => {
    return uniqueValues.filter((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  }, [uniqueValues, search]);


  const isAllSelected =
    uniqueValues.length > 0 && selectedFilters.length === uniqueValues.length;

  const handleSelectAllToggle = () => {
    onFilterChange(isAllSelected ? [] : uniqueValues);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="p-0 w-4 h-4 text-gray-500"
          title="Filter"
        >
          <Funnel className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-h-60 overflow-y-auto text-xs min-w-[170px] px-2 py-2 space-y-1">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 text-[10px]"
        />

        <DropdownMenuCheckboxItem
          checked={isAllSelected}
          onCheckedChange={handleSelectAllToggle}
          className="font-semibold text-[10px]"
        >
          {isAllSelected ? "Deselect All" : "Select All"}
        </DropdownMenuCheckboxItem>

        <div className="max-h-40 overflow-y-auto">
          {filteredValues.length > 0 ? (
            filteredValues.map((value, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={selectedFilters.includes(value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onFilterChange([...selectedFilters, value]);
                  } else {
                    onFilterChange(selectedFilters.filter((v) => v !== value));
                  }
                }}
                className="text-[10px]"
              >
                {typeof value === "boolean"
                  ? value
                    ? "True"
                    : "False"
                  : String(value)}
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            <div className="px-2 py-1 text-muted-foreground text-xs">
              No matching values
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
