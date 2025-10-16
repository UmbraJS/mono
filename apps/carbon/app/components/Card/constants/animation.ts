/**
 * Animation constants for card cooldown and dash timeline effects
 */

export const DASH_ANIMATION = {
  /** Multiplier for segment duration to determine total dash animation duration (0.3 = 30% of segment) */
  TOTAL_DURATION: 0.3,

  /** Size multiplier for pulse elements */
  PULSE_SIZE: 4,

  /** Percentage of total duration for growth/shrink phases */
  PULSE_PERCENT: 30,

  /** Percentage of path to draw during growth phase */
  GROWTH_DRAW_PERCENT: 10,

  /** Percentage of path to start shrink phase */
  SHRINK_START_PERCENT: 90,

  /** Slight delay before hit effect in seconds */
  HIT_DELAY: 0.0,
} as const

export const COOLDOWN_STATES = {
  frozen: {
    state: 'frozen',
    colorClass: 'base-info',
    priority: 3
  },
  slow: {
    state: 'slow',
    colorClass: 'base-warning',
    priority: 2
  },
  haste: {
    state: 'haste',
    colorClass: 'base-success',
    priority: 1
  },
  normal: {
    state: 'normal',
    colorClass: 'base-120',
    priority: 0
  }
} as const

export type CooldownStateName = keyof typeof COOLDOWN_STATES
