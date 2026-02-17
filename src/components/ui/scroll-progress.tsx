'use client'
import { cn } from "@/lib/utils";
import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressProps {
  className?: string;
}

export default function ScrollProgress({ className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  return (
    <motion.div
      //@ts-ignore
      className={cn(
        "fixed inset-x-0 top-0 z-[1000] h-1 origin-left bg-gradient-to-r from-[var(--primary-blue)] via-[#1a5f8a] to-[var(--accent-gold)]",
        className,
      )}
      style={{
        scaleX,
      }}
    />
  );
}
