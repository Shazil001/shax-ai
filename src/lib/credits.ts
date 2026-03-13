export const CREDIT_COSTS = {
  note_summary: 1,
  youtube_summary: 3,
  job_search: 2,
  resume_generation: 5,
  cover_letter: 3,
  document_summary: 3,
  meeting_notes: 3,
  ai_assistant: 1,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

export function getCreditCost(action: CreditAction): number {
  return CREDIT_COSTS[action];
}

export function hasEnoughCredits(
  currentCredits: number,
  action: CreditAction
): boolean {
  return currentCredits >= CREDIT_COSTS[action];
}
