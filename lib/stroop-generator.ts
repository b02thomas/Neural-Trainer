import { StroopChallenge, ColorName, AnswerOutcome } from '@/types/game';
import { getRandomColor } from './colors';

/**
 * Generates a new Stroop challenge
 * CRITICAL CONSTRAINT: word !== inkColor (guaranteed conflict)
 *
 * @param previousChallenge Optional previous challenge to avoid immediate word repetition
 * @param activeColors Optional array of colors to use (defaults to all colors)
 * @returns A new StroopChallenge with guaranteed word/ink mismatch
 */
export function generateChallenge(previousChallenge?: StroopChallenge, activeColors?: ColorName[]): StroopChallenge {
  // Step 1: Select random word (optionally different from previous)
  let word: ColorName;
  if (previousChallenge) {
    word = getRandomColor([previousChallenge.word], activeColors);
  } else {
    word = getRandomColor(undefined, activeColors);
  }

  // Step 2: Select ink color that is DIFFERENT from the word
  // This is the core Stroop effect - the word and ink color must conflict
  const inkColor = getRandomColor([word], activeColors);

  // Step 3: Create and return the challenge
  return {
    id: crypto.randomUUID(),
    word,
    inkColor,
    createdAt: Date.now(),
  };
}

/**
 * Validates the user's answer and determines the outcome type
 *
 * @param challenge The current Stroop challenge
 * @param selectedColor The color the user selected
 * @returns 'success' if correct, 'impulse_error' if user read the word, 'wrong_choice' otherwise
 */
export function validateAnswer(
  challenge: StroopChallenge,
  selectedColor: ColorName
): AnswerOutcome {
  // Success: User correctly identified the ink color
  if (selectedColor === challenge.inkColor) {
    return 'success';
  }

  // Impulse error: User read the word instead of identifying the ink color
  // This is the classic Stroop interference - the user failed to resist the automatic reading response
  if (selectedColor === challenge.word) {
    return 'impulse_error';
  }

  // Wrong choice: User selected neither the word nor the ink color
  return 'wrong_choice';
}

/**
 * Utility function to verify challenge validity (for testing)
 * Ensures word and inkColor are different
 */
export function isChallengeValid(challenge: StroopChallenge): boolean {
  return challenge.word !== challenge.inkColor;
}
