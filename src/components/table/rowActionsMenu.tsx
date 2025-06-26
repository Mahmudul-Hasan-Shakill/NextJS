"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";

type RowActionsMenuProps<T> = {
  row: T;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
};

export function RowActionsMenu<T>({
  row,
  onView,
  onEdit,
  onDelete,
}: RowActionsMenuProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-[10px]">Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-[10px]" onClick={() => onView?.(row)}>
          <span className="flex justify-between w-full">
            <span>View</span>
            <Eye className="h-4 w-4" />
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[10px]" onClick={() => onEdit?.(row)}>
          <span className="flex justify-between w-full">
            <span>Edit</span>
            <Edit className="h-4 w-4" />
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete?.(row)}
          className="text-[10px] text-red-600 dark:text-red-400"
        >
          <span className="flex justify-between w-full">
            <span>Delete</span>
            <Trash className="h-4 w-4" />
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
