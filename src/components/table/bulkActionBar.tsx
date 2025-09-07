// import { Button } from "@/components/ui/button";

// interface BulkActionsProps<T> {
//   selectedRowIds: (string | number)[];
//   onBulkDelete?: (ids: (string | number)[]) => void;
// }

// export function BulkActions<T>({
//   selectedRowIds,
//   onBulkDelete,
// }: BulkActionsProps<T>) {
//   if (selectedRowIds.length === 0) return null;

//   return (
//     <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-1 py-0.5">
//       <span className="text-xs font-medium text-gray-700 dark:text-gray-200 pr-2">
//         {selectedRowIds.length} row(s) selected
//       </span>
//       {onBulkDelete && (
//         <Button
//           variant="destructive"
//           size="sm"
//           className="text-xs"
//           onClick={() => onBulkDelete(selectedRowIds)}
//         >
//           Delete Selected
//         </Button>
//       )}
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";

interface BulkActionsProps<T> {
  selectedRowIds: (string | number)[];
  onBulkDelete?: (ids: (string | number)[]) => void;
  onBulkEdit?: (ids: (string | number)[]) => void; // 🆕
}

export function BulkActions<T>({
  selectedRowIds,
  onBulkDelete,
  onBulkEdit, // 🆕
}: BulkActionsProps<T>) {
  if (selectedRowIds.length === 0) return null;

  return (
    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-1 py-0.5">
      <span className="text-xs font-medium text-gray-700 dark:text-gray-200 pr-2">
        {selectedRowIds.length} row(s) selected
      </span>
      <div className="flex items-center gap-1">
        {onBulkEdit && (
          <Button
            variant="default"
            size="sm"
            className="text-xs"
            onClick={() => onBulkEdit(selectedRowIds)}
          >
            Edit Selected
          </Button>
        )}
        {onBulkDelete && (
          <Button
            variant="destructive"
            size="sm"
            className="text-xs"
            onClick={() => onBulkDelete(selectedRowIds)}
          >
            Delete Selected
          </Button>
        )}
      </div>
    </div>
  );
}
