export enum AgeGroup {
  Toddler = "toddler",
  Young = "young",
  Middle = "middle",
  Older = "older",
}

export enum ExpLevel {
  Zero = 0,
  Exposure = 1,
  Early = 2,
  Training = 3,
  Systematic = 4,
}

export interface TestState {
  ageGroup: AgeGroup | null;
  expLevel: ExpLevel | null;
  goal: string | null;

  listeningScore: number; // 0-5
  oralScore: number | null; // 0-1
  vocabScore: number; // 0-1
  readingScore: number | null; // 0-1
  grammarScore: number | null; // 0-1

  oralTriggered: boolean;
  readingTriggered: boolean;
  grammarTriggered: boolean;

  vocabStartRange: "A" | "B" | "C";
}

export const LEVEL_MAP: Record<string, string> = {
  L1: "启蒙级 (Pre-A1)",
  L2: "基础级 (A1 Low)",
  L3: "进阶级 (A1 High)",
  L4: "中级 (A2 Low)",
  L5: "强化级 (A2 High)",
  L6: "高级 (B1 Low)",
  L7: "卓越级 (B1 High)",
};

export function calculateFinalLevel(state: TestState): number {
  const weights: Record<string, number> = {
    listening: 0.35,
    vocab: 0.4,
    oral: state.oralTriggered ? 0.1 : 0,
    reading: state.readingTriggered ? 0.1 : 0,
    grammar: 0.05,
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const normalizedWeights = Object.fromEntries(
    Object.entries(weights).map(([k, v]) => [k, v / totalWeight]),
  ) as Record<string, number>;

  let compositeScore = 0;
  compositeScore += (state.listeningScore / 5) * normalizedWeights.listening;
  compositeScore += state.vocabScore * normalizedWeights.vocab;
  if (state.oralScore !== null) compositeScore += state.oralScore * normalizedWeights.oral;
  if (state.readingScore !== null)
    compositeScore += state.readingScore * normalizedWeights.reading;
  if (state.grammarScore !== null)
    compositeScore += state.grammarScore * normalizedWeights.grammar;

  let levelRaw = 1;
  if (compositeScore < 0.15) levelRaw = 1;
  else if (compositeScore < 0.28) levelRaw = 2;
  else if (compositeScore < 0.42) levelRaw = 3;
  else if (compositeScore < 0.55) levelRaw = 4;
  else if (compositeScore < 0.68) levelRaw = 5;
  else if (compositeScore < 0.82) levelRaw = 6;
  else levelRaw = 7;

  // Oral Adjustment
  if (state.oralScore !== null) {
    const expectedOral = state.listeningScore / 5.0;
    if (state.oralScore > expectedOral + 0.3) levelRaw += 0.5;
    else if (state.oralScore < expectedOral - 0.3) levelRaw -= 0.5;
  }

  return Math.max(1, Math.min(7, Math.round(levelRaw)));
}

export type AbilityTestResult = {
  finalLevel: number; // 1-7
  testState: TestState;
};

