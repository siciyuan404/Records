'use client';

import { useReducedMotion } from 'framer-motion';

interface AnimationOptions {
  duration?: number;
  delay?: number;
  ease?: 'easeOut' | 'easeInOut' | 'linear';
}

export function useOptimizedAnimation(options: AnimationOptions = {}) {
  const { duration = 0.3, delay = 0, ease = 'easeOut' } = options;
  const shouldReduceMotion = useReducedMotion();

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 300, damping: 30 };

  const fadeTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration, delay, ease };

  const slideTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: duration * 1.5, delay, ease: 'easeOut' as const };

  return {
    shouldReduceMotion,
    springTransition,
    fadeTransition,
    slideTransition,
    containerVariants: {
      hidden: { opacity: shouldReduceMotion ? 1 : 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.1,
        },
      },
    },
    itemVariants: {
      hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: shouldReduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 300, damping: 30 },
      },
    },
  };
}

export const optimizedTransition = {
  quick: { duration: 0.15, ease: 'easeOut' as const },
  normal: { duration: 0.3, ease: 'easeOut' as const },
  slow: { duration: 0.5, ease: 'easeOut' as const },
};

export function useStaggerAnimation(itemCount: number) {
  const shouldReduceMotion = useReducedMotion();

  return {
    container: {
      hidden: { opacity: shouldReduceMotion ? 1 : 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.05,
          delayChildren: shouldReduceMotion ? 0 : 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: shouldReduceMotion ? 0 : 0.3,
          ease: 'easeOut' as const,
        },
      },
    },
  };
}
