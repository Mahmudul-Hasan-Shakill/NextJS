// // src/components/dashboard/core/AddWidgetDialog.tsx
// "use client";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import type { BaseWidgetMeta } from "./types";

// export default function AddWidgetDialog<TType extends string>({
//   open,
//   onClose,
//   existingTypes,
//   onAdd,
//   allWidgets,
// }: {
//   open: boolean;
//   onClose: () => void;
//   existingTypes: TType[];
//   onAdd: (type: TType) => void;
//   allWidgets: BaseWidgetMeta<TType>[];
// }) {
//   const candidates = allWidgets.filter((w) => !existingTypes.includes(w.type));
//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Add Widget</DialogTitle>
//         </DialogHeader>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
//           {candidates.map((w) => (
//             <button
//               key={w.type as string}
//               className="rounded-xl border p-3 text-left hover:bg-muted/40 transition"
//               onClick={() => {
//                 onAdd(w.type);
//                 onClose();
//               }}
//             >
//               <div className="text-sm font-medium">{w.title}</div>
//               <div className="text-[11px] text-muted-foreground mt-1">
//                 {w.type}
//               </div>
//             </button>
//           ))}
//           {!candidates.length && (
//             <div className="text-[12px] text-muted-foreground">
//               All widgets are already added.
//             </div>
//           )}
//         </div>
//         <div className="flex justify-end">
//           <Button variant="ghost" onClick={onClose}>
//             Close
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// src/components/dashboard/core/AddWidgetDialog.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { BaseWidgetMeta } from "./types";

export default function AddWidgetDialog<TType extends string>({
  open,
  onClose,
  existingTypes,
  onAdd,
  allWidgets,
}: {
  open: boolean;
  onClose: () => void;
  existingTypes: TType[];
  onAdd: (type: TType) => void;
  allWidgets: BaseWidgetMeta<TType>[];
}) {
  const candidates = allWidgets.filter((w) => !existingTypes.includes(w.type));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Widget
          </DialogTitle>
          <DialogDescription>
            Select a widget to add to your dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {candidates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {candidates.map((w) => (
                <button
                  key={w.type as string}
                  className="group rounded-lg border border-border p-4 text-left hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => {
                    onAdd(w.type);
                    onClose();
                  }}
                  aria-label={`Add ${w.title} widget`}
                >
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {w.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">
                    {w.type}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <div className="text-sm text-muted-foreground">
                All available widgets have been added to your dashboard.
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
