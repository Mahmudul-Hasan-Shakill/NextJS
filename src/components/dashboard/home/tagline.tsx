"use client";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export function Tagline() {
  const words = [
    { text: "Track" },
    { text: "every" },
    { text: "movement," },
    { text: "optimize" },
    { text: "every", className: "text-blue-500 dark:text-blue-500" },
    { text: "process." },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full px-4">
      <TypewriterEffectSmooth words={words} className="text-center" />
    </div>
  );
}
