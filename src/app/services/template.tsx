"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Re-mounts on every navigation into (and within) /services, so this entrance
 * animation runs each time the user enters a services page.
 *
 * Intentionally opacity-only: transform/filter/blur would make this wrapper the
 * containing block for the `position: fixed` Navbar and break its scroll behavior.
 */
export default function ServicesTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
