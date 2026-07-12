export const dimensions = ["探索", "创造", "共鸣", "理解", "感知", "扎根", "点燃", "超越"] as const;

export type Dimension = (typeof dimensions)[number];
export type Scores = Record<Dimension, number>;

export function scoreAnswers(
  answers: number[],
  questions: { options: { dims: readonly Dimension[] }[] }[],
): Scores {
  const scores = Object.fromEntries(dimensions.map((dimension) => [dimension, 0])) as Scores;

  answers.slice(0, 8).forEach((answer, questionIndex) => {
    questions[questionIndex]?.options[answer]?.dims.forEach((dimension) => scores[dimension]++);
  });

  return scores;
}

export function relativeIndices(scores: Scores): Scores {
  const values = dimensions.map((dimension) => scores[dimension]);
  const max = Math.max(...values);
  const min = Math.min(...values);

  return Object.fromEntries(dimensions.map((dimension) => [
    dimension,
    max === min ? 65 : Math.round(35 + 65 * (scores[dimension] - min) / (max - min)),
  ])) as Scores;
}

export function primaryCandidates(
  scores: Scores,
  answers: number[],
  questions: { options: { dims: readonly Dimension[] }[] }[],
): Dimension[] {
  const highest = Math.max(...dimensions.map((dimension) => scores[dimension]));
  const tied = dimensions.filter((dimension) => scores[dimension] === highest);
  if (tied.length <= 1) return tied;

  const laterCounts = Object.fromEntries(tied.map((dimension) => [dimension, 0])) as Partial<Scores>;
  answers.slice(4, 8).forEach((answer, offset) => {
    questions[offset + 4]?.options[answer]?.dims.forEach((dimension) => {
      if (dimension in laterCounts) laterCounts[dimension] = (laterCounts[dimension] ?? 0) + 1;
    });
  });
  const highestLaterCount = Math.max(...tied.map((dimension) => laterCounts[dimension] ?? 0));
  return tied.filter((dimension) => laterCounts[dimension] === highestLaterCount);
}
