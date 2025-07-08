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
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  RotateCcwKey,
  CircleCheckBig,
} from "lucide-react";

type RowActionsMenuProps<T> = {
  row: T;
  onView?: (row: T) => void;
  onApprove?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onReset?: (row: T) => void;
  showView?: boolean;
  showApprove?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showReset?: boolean;
};

export function RowActionsMenu<T>({
  row,
  onView,
  onApprove,
  onEdit,
  onDelete,
  onReset,
  showView = true,
  showApprove = false,
  showEdit = true,
  showDelete = true,
  showReset = false,
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
        {showView && (
          <DropdownMenuItem
            className="text-[10px]"
            onClick={() => onView?.(row)}
          >
            <span className="flex justify-between w-full">
              <span>View</span>
              <Eye className="h-4 w-4" />
            </span>
          </DropdownMenuItem>
        )}
        {showApprove && hasIsActive(row) && !row.isActive && (
          <DropdownMenuItem
            onClick={() => onApprove?.(row)}
            className="text-[10px]"
          >
            <span className="flex justify-between w-full">
              <span>Approve</span>
              <CircleCheckBig className="h-4 w-4" />
            </span>
          </DropdownMenuItem>
        )}

        {showReset && (
          <DropdownMenuItem
            className="text-[10px]"
            onClick={() => onReset?.(row)}
          >
            <span className="flex justify-between w-full">
              <span>Reset</span>
              <RotateCcwKey className="h-4 w-4" />
            </span>
          </DropdownMenuItem>
        )}
        {showEdit && (
          <DropdownMenuItem
            className="text-[10px]"
            onClick={() => onEdit?.(row)}
          >
            <span className="flex justify-between w-full">
              <span>Edit</span>
              <Edit className="h-4 w-4" />
            </span>
          </DropdownMenuItem>
        )}
        {showDelete && (
          <DropdownMenuItem
            onClick={() => onDelete?.(row)}
            className="text-[10px] text-red-600 dark:text-red-400"
          >
            <span className="flex justify-between w-full">
              <span>Delete</span>
              <Trash className="h-4 w-4" />
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function hasIsActive(row: any): row is { isActive: boolean } {
  return typeof row?.isActive === "boolean";
}
