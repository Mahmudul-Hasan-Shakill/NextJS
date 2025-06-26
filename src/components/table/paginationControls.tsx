"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;
  onPageChange: (page: number) => void;
  currentCount: number;
  totalCount: number;
};

export function PaginationControls({
  currentPage,
  totalPages,
  rowsPerPage,
  onRowsPerPageChange,
  onPageChange,
  currentCount,
  totalCount,
}: PaginationControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
      <div className="text-xs">
        {currentCount} of {totalCount} row(s) selected
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span>Rows per page</span>
        <Select
          value={String(rowsPerPage)}
          onValueChange={(value) => {
            onRowsPerPageChange(Number(value));
            onPageChange(1);
          }}
        >
          <SelectTrigger className="w-[80px] text-xs">
            <SelectValue placeholder="Rows" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((num) => (
              <SelectItem key={num} value={String(num)} className="text-xs">
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button variant="outline" size="sm" onClick={() => onPageChange(1)}>
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
