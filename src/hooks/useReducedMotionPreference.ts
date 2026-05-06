import { useReducedMotion } from "framer-motion";

/**
 * Wrapper around framer-motion's useReducedMotion that returns a boolean.
 * Use this in components to gate animations:
 *
 * const reduceMotion = useReducedMotionPreference();
 * <motion.div animate={reduceMotion ? {} : { y: -20 }}>
 */
export function useReducedMotionPreference(): boolean {
  const shouldReduce = useReducedMotion();
  return !!shouldReduce;
}
