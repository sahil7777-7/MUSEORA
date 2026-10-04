/**
 * MUSEORA — Cinematic Editorial Motion System
 * Precision easing and entrance variants inspired by luxury museum curation.
 * Standard easing: cubic-bezier(0.16, 1, 0.3, 1)
 */

export const MUSEO_EASE = [0.16, 1, 0.3, 1];

// Stagger container orchestrator
export const museoStagger = (staggerChildren = 0.08, delayChildren = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Editorial vertical reveal
export const museoFadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: MUSEO_EASE,
    },
  },
};

// Grand hero headline entrance
export const museoHeroTitle = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.0,
      delay: 0.35,
      ease: MUSEO_EASE,
    },
  },
};

// Delicate eyebrow / badge entrance
export const museoHeroEyebrow = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.15,
      ease: MUSEO_EASE,
    },
  },
};

// Subheading editorial reveal
export const museoHeroSubtitle = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      delay: 0.55,
      ease: MUSEO_EASE,
    },
  },
};

// Hero CTA buttons reveal
export const museoHeroCta = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: 0.75,
      ease: MUSEO_EASE,
    },
  },
};

// Subtle scale & elevation reveal for cards & media frames
export const museoScaleReveal = {
  hidden: { opacity: 0, scale: 0.97, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: MUSEO_EASE,
    },
  },
};

// Directional lateral reveals
export const museoSlideLeft = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      ease: MUSEO_EASE,
    },
  },
};

export const museoSlideRight = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      ease: MUSEO_EASE,
    },
  },
};
