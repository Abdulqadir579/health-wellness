"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay before the animation starts (seconds). */
  delay?: number;
  /** Vertical offset to animate from (px). */
  y?: number;
  /**
   * How much of the element must be visible before animating.
   * Defaults to "some" so it also works for sections taller than the viewport
   * (a numeric fraction can never be met by very tall sections).
   */
  amount?: number | "some" | "all";
};

/**
 * Fades + slides its children in once they scroll into view.
 * Safe to wrap around server components — it only adds a client boundary here.
 */
const Reveal = ({
  children,
  className,
  delay = 0,
  y = 40,
  amount = "some",
}: RevealProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
