"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "motion/react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  name?: string;
}

export const Select = React.forwardRef<HTMLButtonElement, CustomSelectProps>(
  (
    { value, onChange, options, placeholder = "Select", className, name },
    ref
  ) => {
    const radius = 100;
    const [visible, setVisible] = React.useState(false);
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
        <SelectPrimitive.Root
          value={value}
          onValueChange={(val) => {
            const syntheticEvent = {
              target: {
                value: val,
                id: name ?? "",
              },
            } as React.ChangeEvent<HTMLSelectElement>;

            onChange(syntheticEvent);
          }}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-black dark:text-white shadow-input focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon asChild>
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className="z-50 mt-1 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border bg-white dark:bg-zinc-800 shadow-md"
              position="popper"
            >
              <SelectPrimitive.Viewport className="w-full p-1 max-h-60 overflow-y-auto scrollbar-hidden">
                {options.map((opt) => (
                  <SelectPrimitive.Item
                    key={opt.value}
                    value={opt.value}
                    className="relative flex text-[10px] cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm text-black dark:text-white hover:bg-blue-100 dark:hover:bg-zinc-700 focus:bg-blue-100 dark:focus:bg-zinc-700"
                  >
                    <SelectPrimitive.ItemText>
                      {opt.label}
                    </SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="absolute right-2">
                      <CheckIcon className="h-4 w-4" />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </motion.div>
    );
  }
);

Select.displayName = "Select";
