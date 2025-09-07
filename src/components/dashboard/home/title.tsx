"use client";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function Title() {
  const words = ["precision", "efficiency", "clarity"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className={cn(
        "relative mb-2 max-w-2xl text-center text-xl leading-normal font-bold tracking-tight text-zinc-700 md:text-5xl dark:text-zinc-100"
      )}
      layout
    >
      <div className="inline-block">
        Manage your inventory with{" "}
        <ContainerTextFlip
          words={words}
          className="mx-1"
          textClassName="text-black dark:text-white"
        />
      </div>
    </motion.div>
  );
}
