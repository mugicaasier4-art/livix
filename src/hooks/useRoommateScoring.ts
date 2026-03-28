import type { RoommateProfile } from './useRoommateProfiles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CompatibilityResult {
  score: number; // 0–99
  label: 'excellent' | 'good' | 'acceptable';
  breakdown: {
    dimension: string;
    label: string;
    score: number; // 0–100 per dimension
  }[];
  sharedHobbies: string[];
  sameUniversity: boolean;
}

/**
 * Extended view of a RoommateProfile with lifestyle fields extracted from
 * the `lifestyle_preferences` JSON column for easier scoring access.
 *
 * Any field may be null/undefined — the algorithm skips dimensions where
 * either profile lacks data.
 */
export interface ScoringProfile extends RoommateProfile {
  // Lifestyle dimensions (extracted from lifestyle_preferences)
  sleep_time?: number | null; // 0–23 (hour)
  cleanliness?: number | null; // 1–5
  noise_tolerance?: number | null; // 1–5
  guest_frequency?: number | null; // 1–5
  intro_extro?: number | null; // 1–5
  cooking?: number | null; // 1–5
  party_frequency?: number | null; // 1–5

  // Extra fields that may live in lifestyle_preferences or top-level
  hobbies?: string[] | null;
  university?: string | null;
  city?: string | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

interface Dimension {
  key: keyof ScoringProfile;
  label: string;
  weight: number;
  maxRange: number;
  circular?: boolean;
}

const DIMENSIONS: Dimension[] = [
  // Tier 2 — weight 3
  { key: 'sleep_time', label: 'Horario de sueño', weight: 3, maxRange: 6, circular: true },
  { key: 'cleanliness', label: 'Limpieza', weight: 3, maxRange: 4 },
  { key: 'noise_tolerance', label: 'Tolerancia al ruido', weight: 3, maxRange: 4 },
  { key: 'guest_frequency', label: 'Frecuencia de visitas', weight: 3, maxRange: 4 },
  // Tier 3 — weight 2
  { key: 'intro_extro', label: 'Introversión / Extroversión', weight: 2, maxRange: 4 },
  { key: 'cooking', label: 'Cocina', weight: 2, maxRange: 4 },
  // Tier 4 — weight 1
  { key: 'party_frequency', label: 'Frecuencia de fiestas', weight: 1, maxRange: 4 },
];

const HOBBY_BONUS = 2; // % per shared hobby
const MAX_HOBBY_BONUS = 10; // % cap
const UNIVERSITY_BONUS = 3; // %
const MIN_SCORE_THRESHOLD = 50;
const MAX_SCORE = 99;
const BUDGET_OVERLAP_THRESHOLD = 0.2; // 20 %

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Hydrate a RoommateProfile by pulling lifestyle fields out of the
 * `lifestyle_preferences` JSON blob so the scoring code can access them
 * as top-level properties.
 */
export function hydrateScoringProfile(profile: RoommateProfile): ScoringProfile {
  const lp = (profile as any).lifestyle_preferences as Record<string, unknown> | null | undefined;
  const hydrated: ScoringProfile = { ...profile };

  if (lp && typeof lp === 'object') {
    const numOrNull = (v: unknown): number | null =>
      typeof v === 'number' ? v : null;

    hydrated.sleep_time = numOrNull(lp.sleep_time);
    hydrated.cleanliness = numOrNull(lp.cleanliness);
    hydrated.noise_tolerance = numOrNull(lp.noise_tolerance);
    hydrated.guest_frequency = numOrNull(lp.guest_frequency);
    hydrated.intro_extro = numOrNull(lp.intro_extro);
    hydrated.cooking = numOrNull(lp.cooking);
    hydrated.party_frequency = numOrNull(lp.party_frequency);

    if (Array.isArray(lp.hobbies)) {
      hydrated.hobbies = lp.hobbies as string[];
    }
    if (typeof lp.university === 'string') {
      hydrated.university = lp.university;
    }
    if (typeof lp.city === 'string') {
      hydrated.city = lp.city;
    }
  }

  // Fall back to top-level interests as hobbies if not set in lifestyle_preferences
  if (!hydrated.hobbies && Array.isArray(profile.interests)) {
    hydrated.hobbies = profile.interests;
  }

  // Fall back to preferred_location as city
  if (!hydrated.city && profile.preferred_location) {
    hydrated.city = profile.preferred_location;
  }

  return hydrated;
}

function circularDistance(a: number, b: number, period: number = 24): number {
  const diff = Math.abs(a - b);
  return Math.min(diff, period - diff);
}

function budgetOverlapRatio(
  minA: number,
  maxA: number,
  minB: number,
  maxB: number,
): number {
  const overlapStart = Math.max(minA, minB);
  const overlapEnd = Math.min(maxA, maxB);
  const overlap = Math.max(0, overlapEnd - overlapStart);
  const rangeA = maxA - minA;
  const rangeB = maxB - minB;
  const minRange = Math.min(rangeA, rangeB);

  if (minRange <= 0) {
    // If either range is zero-width (exact budget), check containment
    return overlap > 0 ? 1 : 0;
  }

  return overlap / minRange;
}

function getSharedHobbies(a: string[] | null | undefined, b: string[] | null | undefined): string[] {
  if (!a?.length || !b?.length) return [];
  const setB = new Set(b.map((h) => h.toLowerCase().trim()));
  return a.filter((h) => setB.has(h.toLowerCase().trim()));
}

function isSameUniversity(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  return a.toLowerCase().trim() === b.toLowerCase().trim();
}

function scoreLabel(score: number): 'excellent' | 'good' | 'acceptable' {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  return 'acceptable';
}

// ---------------------------------------------------------------------------
// Core scoring functions (pure, no React)
// ---------------------------------------------------------------------------

function checkDealBreakers(a: ScoringProfile, b: ScoringProfile): boolean {
  // Smoking
  if (a.smoking_allowed === false && b.smoking_allowed === true) return false;
  if (b.smoking_allowed === false && a.smoking_allowed === true) return false;

  // Pets — boolean check (true = has/wants pet, false = no pets accepted)
  if (a.pets_allowed === false && b.pets_allowed === true) return false;
  if (b.pets_allowed === false && a.pets_allowed === true) return false;

  // Gender preference
  // Skip if either is null/undefined or "any"
  if (a.gender_preference && a.gender_preference !== 'any' && b.gender_preference && b.gender_preference !== 'any') {
    if (a.gender_preference !== b.gender_preference) return false;
  }

  // Budget overlap >= 20 %
  if (
    a.budget_min != null &&
    a.budget_max != null &&
    b.budget_min != null &&
    b.budget_max != null
  ) {
    if (budgetOverlapRatio(a.budget_min, a.budget_max, b.budget_min, b.budget_max) < BUDGET_OVERLAP_THRESHOLD) {
      return false;
    }
  }

  // City must match (if both provided)
  if (a.city && b.city) {
    if (a.city.toLowerCase().trim() !== b.city.toLowerCase().trim()) return false;
  }

  return true;
}

function computeWeightedScore(
  a: ScoringProfile,
  b: ScoringProfile,
): { rawScore: number; breakdown: CompatibilityResult['breakdown'] } {
  let weightedSum = 0;
  let totalWeight = 0;
  const breakdown: CompatibilityResult['breakdown'] = [];

  for (const dim of DIMENSIONS) {
    const valA = a[dim.key] as number | null | undefined;
    const valB = b[dim.key] as number | null | undefined;

    // Skip if either value is missing
    if (valA == null || valB == null) continue;

    let distance: number;
    if (dim.circular) {
      distance = circularDistance(valA, valB);
    } else {
      distance = Math.abs(valA - valB);
    }

    // Cap distance at maxRange for score calculation
    const cappedDistance = Math.min(distance, dim.maxRange);
    const dimScore = (1 - cappedDistance / dim.maxRange) * 100;

    weightedSum += dim.weight * dimScore;
    totalWeight += dim.weight;

    breakdown.push({
      dimension: dim.key as string,
      label: dim.label,
      score: Math.round(dimScore),
    });
  }

  if (totalWeight === 0) {
    // No dimensions could be scored — return neutral 50
    return { rawScore: 50, breakdown };
  }

  const rawScore = weightedSum / totalWeight;
  return { rawScore, breakdown };
}

function computeCompatibility(
  profileA: ScoringProfile,
  profileB: ScoringProfile,
): CompatibilityResult | null {
  // Layer 1: deal-breakers
  if (!checkDealBreakers(profileA, profileB)) return null;

  // Layer 2: weighted similarity
  const { rawScore, breakdown } = computeWeightedScore(profileA, profileB);

  // Bonuses
  const sharedHobbies = getSharedHobbies(profileA.hobbies, profileB.hobbies);
  const hobbyBonus = Math.min(sharedHobbies.length * HOBBY_BONUS, MAX_HOBBY_BONUS);

  const sameUniversity = isSameUniversity(profileA.university, profileB.university);
  const uniBonus = sameUniversity ? UNIVERSITY_BONUS : 0;

  let finalScore = rawScore + hobbyBonus + uniBonus;

  // Cap and threshold
  finalScore = Math.min(Math.round(finalScore), MAX_SCORE);

  if (finalScore < MIN_SCORE_THRESHOLD) return null;

  return {
    score: finalScore,
    label: scoreLabel(finalScore),
    breakdown,
    sharedHobbies,
    sameUniversity,
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useRoommateScoring = () => {
  /**
   * Calculate pairwise compatibility between two profiles.
   * Returns null if deal-breakers fail or score < 50%.
   */
  const calculateCompatibility = (
    profileA: RoommateProfile,
    profileB: RoommateProfile,
  ): CompatibilityResult | null => {
    const a = hydrateScoringProfile(profileA);
    const b = hydrateScoringProfile(profileB);
    return computeCompatibility(a, b);
  };

  /**
   * Quick check: do two profiles pass all deal-breaker filters?
   */
  const passDealBreakers = (
    profileA: RoommateProfile,
    profileB: RoommateProfile,
  ): boolean => {
    const a = hydrateScoringProfile(profileA);
    const b = hydrateScoringProfile(profileB);
    return checkDealBreakers(a, b);
  };

  /**
   * Score a candidate against an existing group.
   * Result score = MIN compatibility with any group member.
   * Returns null if any pair fails deal-breakers or min < 50%.
   */
  const calculateGroupCompatibility = (
    groupMembers: RoommateProfile[],
    candidate: RoommateProfile,
  ): CompatibilityResult | null => {
    if (groupMembers.length === 0) return null;

    let worstResult: CompatibilityResult | null = null;

    for (const member of groupMembers) {
      const result = calculateCompatibility(member, candidate);
      if (!result) return null; // deal-breaker or below threshold with any member

      if (!worstResult || result.score < worstResult.score) {
        worstResult = result;
      }
    }

    return worstResult;
  };

  /**
   * Score and rank a list of candidates against a reference profile.
   * Only returns candidates that pass deal-breakers and score >= 50%.
   * Sorted descending by score.
   */
  const scoreAndRankProfiles = (
    myProfile: RoommateProfile,
    candidates: RoommateProfile[],
  ): (RoommateProfile & { compatibility: CompatibilityResult })[] => {
    const results: (RoommateProfile & { compatibility: CompatibilityResult })[] = [];

    for (const candidate of candidates) {
      const compatibility = calculateCompatibility(myProfile, candidate);
      if (compatibility) {
        results.push({ ...candidate, compatibility });
      }
    }

    results.sort((a, b) => b.compatibility.score - a.compatibility.score);
    return results;
  };

  return {
    calculateCompatibility,
    passDealBreakers,
    calculateGroupCompatibility,
    scoreAndRankProfiles,
  };
};
