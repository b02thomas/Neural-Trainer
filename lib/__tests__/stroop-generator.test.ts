import { describe, it, expect } from 'vitest';
import { generateChallenge, validateAnswer, isChallengeValid } from '../stroop-generator';
import { ColorName } from '@/types/game';

describe('generateChallenge', () => {
  it('should generate a valid challenge with word and inkColor', () => {
    const challenge = generateChallenge();

    expect(challenge).toBeDefined();
    expect(challenge.id).toBeDefined();
    expect(challenge.word).toBeDefined();
    expect(challenge.inkColor).toBeDefined();
    expect(challenge.createdAt).toBeDefined();
    expect(typeof challenge.createdAt).toBe('number');
  });

  it('should ensure word never equals inkColor (1000 iterations)', () => {
    for (let i = 0; i < 1000; i++) {
      const challenge = generateChallenge();
      expect(challenge.word).not.toBe(challenge.inkColor);
      expect(isChallengeValid(challenge)).toBe(true);
    }
  });

  it('should not repeat previous word when previousChallenge is provided', () => {
    const first = generateChallenge();

    // Generate multiple challenges and verify none repeat the first word
    for (let i = 0; i < 20; i++) {
      const second = generateChallenge(first);
      expect(second.word).not.toBe(first.word);
    }
  });

  it('should generate challenges with valid color names', () => {
    const validColors: ColorName[] = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'BLACK', 'PURPLE', 'ORANGE', 'PINK', 'CYAN'];

    for (let i = 0; i < 50; i++) {
      const challenge = generateChallenge();
      expect(validColors).toContain(challenge.word);
      expect(validColors).toContain(challenge.inkColor);
    }
  });

  it('should generate unique IDs for each challenge', () => {
    const challenges = Array.from({ length: 100 }, () => generateChallenge());
    const ids = challenges.map(c => c.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(100);
  });
});

describe('validateAnswer', () => {
  it('should return "success" when user selects ink color', () => {
    const challenge = {
      id: '1',
      word: 'RED' as ColorName,
      inkColor: 'BLUE' as ColorName,
      createdAt: Date.now(),
    };

    const outcome = validateAnswer(challenge, 'BLUE');
    expect(outcome).toBe('success');
  });

  it('should return "impulse_error" when user selects the word', () => {
    const challenge = {
      id: '2',
      word: 'RED' as ColorName,
      inkColor: 'BLUE' as ColorName,
      createdAt: Date.now(),
    };

    const outcome = validateAnswer(challenge, 'RED');
    expect(outcome).toBe('impulse_error');
  });

  it('should return "wrong_choice" when user selects neither word nor ink color', () => {
    const challenge = {
      id: '3',
      word: 'RED' as ColorName,
      inkColor: 'BLUE' as ColorName,
      createdAt: Date.now(),
    };

    const outcome = validateAnswer(challenge, 'GREEN');
    expect(outcome).toBe('wrong_choice');
  });

  it('should correctly handle all three outcome types', () => {
    const challenge = {
      id: '4',
      word: 'YELLOW' as ColorName,
      inkColor: 'BLACK' as ColorName,
      createdAt: Date.now(),
    };

    expect(validateAnswer(challenge, 'BLACK')).toBe('success');
    expect(validateAnswer(challenge, 'YELLOW')).toBe('impulse_error');
    expect(validateAnswer(challenge, 'RED')).toBe('wrong_choice');
    expect(validateAnswer(challenge, 'BLUE')).toBe('wrong_choice');
    expect(validateAnswer(challenge, 'GREEN')).toBe('wrong_choice');
  });
});

describe('isChallengeValid', () => {
  it('should return true for valid challenges (word !== inkColor)', () => {
    const validChallenge = {
      id: '1',
      word: 'RED' as ColorName,
      inkColor: 'BLUE' as ColorName,
      createdAt: Date.now(),
    };

    expect(isChallengeValid(validChallenge)).toBe(true);
  });

  it('should return false for invalid challenges (word === inkColor)', () => {
    const invalidChallenge = {
      id: '2',
      word: 'RED' as ColorName,
      inkColor: 'RED' as ColorName,
      createdAt: Date.now(),
    };

    expect(isChallengeValid(invalidChallenge)).toBe(false);
  });

  it('should validate all generated challenges', () => {
    for (let i = 0; i < 100; i++) {
      const challenge = generateChallenge();
      expect(isChallengeValid(challenge)).toBe(true);
    }
  });
});
