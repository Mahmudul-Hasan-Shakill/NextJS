"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "motion/react";
import * as Popover from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  values: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  name?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  values,
  onChange,
  options,
  placeholder = "Select",
  className,
  name,
}) => {
  const radius = 100;
  const [visible, setVisible] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const toggleValue = (val: string) => {
    const newValues = values.includes(val)
      ? values.filter((v) => v !== val)
      : [...values, val];

    const syntheticEvent = {
      target: {
        value: newValues,
        id: name ?? "",
      },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;

    onChange(syntheticEvent);
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabels = options
    .filter((opt) => values.includes(opt.value))
    .map((opt) => opt.label)
    .join(", ");

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${
              visible ? radius + "px" : "0px"
            } circle at ${mouseX}px ${mouseY}px,
            #3b82f6,
            transparent 80%
          )
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="group/input rounded-lg p-[2px] transition duration-300"
    >
      <Popover.Root>
        <Popover.Trigger
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-black dark:text-white shadow-input focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span className="truncate">{selectedLabels || placeholder}</span>
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="z-50 mt-1 w-full max-w-[300px] overflow-hidden rounded-md border bg-white dark:bg-zinc-800 shadow-md p-2"
            side="bottom"
            align="start"
          >
            <div className="mb-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-8 text-xs px-2"
              />
            </div>

            <div className="max-h-60 overflow-y-auto scrollbar-hidden">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className="flex items-center justify-between px-3 py-2 text-sm text-black dark:text-white hover:bg-blue-100 dark:hover:bg-zinc-700 rounded-sm cursor-pointer"
                    onClick={() => toggleValue(opt.value)}
                  >
                    <span>{opt.label}</span>
                    {values.includes(opt.value) && (
                      <CheckIcon className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  No matching options
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </motion.div>
  );
};

MultiSelect.displayName = "MultiSelect";
