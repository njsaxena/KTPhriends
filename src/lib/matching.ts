// ─────────────────────────────────────────────────────────
// KTPhriends — Matching Algorithm
//
// All pure functions — no Supabase or React dependencies.
// Safe to import in both server and client code.
// ─────────────────────────────────────────────────────────

import type { Profile, Availability, MatchWeights, ScoreBreakdown, BrotherWithScore } from "@/types";

// ── Default weights (must sum to 1.0) ───────────────────
export const DEFAULT_WEIGHTS: MatchWeights = {
  budget:    0.30,
  proximity: 0.25,
  time:      0.20,
  food:      0.12,
  sports:    0.07,
  hobbies:   0.06,
};

// ── Individual dimension scorers (all return 0.0–1.0) ───

/**
 * Budget score: how well the pledge's max budget covers the brother's expected spend.
 * Full score if pledge budget >= brother budget; partial if pledge budget is lower.
 */
export function scoreBudget(pledgeBudget: number, brotherBudget: number): number {
  if (brotherBudget === 0) return 1;
  if (pledgeBudget >= brotherBudget) return 1;
  return Math.max(0, pledgeBudget / brotherBudget);
}

/**
 * Proximity score: fraction of pledge's preferred locations that the brother also prefers.
 */
export function scoreProximity(pledgeLocs: string[], brotherLocs: string[]): number {
  if (pledgeLocs.length === 0) return 0;
  const brotherSet = new Set(brotherLocs);
  const matches = pledgeLocs.filter((l) => brotherSet.has(l));
  return matches.length / pledgeLocs.length;
}

/**
 * Time overlap score: count overlapping 30-min blocks, capped at 6 to prevent
 * a highly available brother from dominating everyone else.
 */
export function scoreTime(
  pledgeBlocks: string[],
  brotherBlocks: string[]
): number {
  const CAP = 6;
  const pledgeSet = new Set(pledgeBlocks);
  const overlap = brotherBlocks.filter((b) => pledgeSet.has(b)).length;
  return Math.min(overlap, CAP) / CAP;
}

/**
 * Jaccard similarity: |A ∩ B| / |A ∪ B|
 * Used for food, sports, and hobbies.
 */
export function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 0;
  const setA = new Set(a);
  const intersection = b.filter((x) => setA.has(x));
  const union = new Set([...a, ...b]);
  return intersection.length / union.size;
}

// ── Main scorer ──────────────────────────────────────────

/**
 * Compute a full score breakdown between a pledge and a brother.
 * Returns individual dimension scores and a weighted total (0–100).
 */
export function computeScore(
  pledge: Profile,
  pledgeAvail: Availability | null,
  brother: Profile,
  brotherAvail: Availability | null,
  weights: MatchWeights = DEFAULT_WEIGHTS
): ScoreBreakdown {
  const pledgeBlocks  = pledgeAvail?.time_blocks  ?? [];
  const brotherBlocks = brotherAvail?.time_blocks ?? [];

  const budget    = scoreBudget(pledge.budget_max, brother.budget_max);
  const proximity = scoreProximity(pledge.locations, brother.locations);
  const time      = scoreTime(pledgeBlocks, brotherBlocks);
  const food      = jaccardSimilarity(pledge.food_prefs, brother.food_prefs);
  const sports    = jaccardSimilarity(pledge.sports, brother.sports);
  const hobbies   = jaccardSimilarity(pledge.hobbies, brother.hobbies);

  const total =
    weights.budget    * budget    +
    weights.proximity * proximity +
    weights.time      * time      +
    weights.food      * food      +
    weights.sports    * sports    +
    weights.hobbies   * hobbies;

  return {
    total:    Math.round(total * 100),
    budget:   Math.round(budget    * 100),
    proximity:Math.round(proximity * 100),
    time:     Math.round(time      * 100),
    food:     Math.round(food      * 100),
    sports:   Math.round(sports    * 100),
    hobbies:  Math.round(hobbies   * 100),
  };
}

/**
 * Score and sort a list of brothers for a given pledge.
 * Returns brothers sorted by descending match score.
 */
export function rankBrothers(
  pledge: Profile,
  pledgeAvail: Availability | null,
  brothers: Profile[],
  brotherAvails: Map<string, Availability>,
  weights: MatchWeights = DEFAULT_WEIGHTS
): BrotherWithScore[] {
  return brothers
    .map((brother) => {
      const avail = brotherAvails.get(brother.id) ?? null;
      const breakdown = computeScore(pledge, pledgeAvail, brother, avail, weights);
      return {
        ...brother,
        score: breakdown.total,
        scoreBreakdown: breakdown,
        availability: avail,
      };
    })
    .sort((a, b) => b.score - a.score);
}

// ── Score color helper ───────────────────────────────────
export type ScoreTier = "high" | "mid" | "low";

export function scoreTier(score: number): ScoreTier {
  if (score >= 80) return "high";
  if (score >= 60) return "mid";
  return "low";
}
