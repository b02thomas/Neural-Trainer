import { describe, it, expect } from 'vitest';
import { COLORS, COLOR_NAMES, getColor, getRandomColor } from '../colors';
import { ColorName } from '@/types/game';

describe('COLORS', () => {
  it('should have all 9 colors defined', () => {
    expect(Object.keys(COLORS)).toHaveLength(9);
    expect(COLORS.RED).toBeDefined();
    expect(COLORS.BLUE).toBeDefined();
    expect(COLORS.GREEN).toBeDefined();
    expect(COLORS.YELLOW).toBeDefined();
    expect(COLORS.BLACK).toBeDefined();
    expect(COLORS.PURPLE).toBeDefined();
    expect(COLORS.ORANGE).toBeDefined();
    expect(COLORS.PINK).toBeDefined();
    expect(COLORS.CYAN).toBeDefined();
  });

  it('should have correct structure for each color', () => {
    const colorNames: ColorName[] = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'BLACK'];

    colorNames.forEach(colorName => {
      const color = COLORS[colorName];
      expect(color).toBeDefined();
      expect(color.displayName).toBeDefined();
      expect(typeof color.displayName).toBe('string');
      expect(color.hexValue).toBeDefined();
      expect(color.hexValue).toMatch(/^#[0-9A-F]{6}$/i);
      expect(color.tailwindClass).toBeDefined();
      expect(typeof color.tailwindClass).toBe('string');
      expect(color.buttonClass).toBeDefined();
      expect(typeof color.buttonClass).toBe('string');
    });
  });

  it('should have unique hex values for all colors', () => {
    const hexValues = Object.values(COLORS).map(c => c.hexValue);
    const uniqueHexValues = new Set(hexValues);
    expect(uniqueHexValues.size).toBe(9);
  });

  it('should have English display names', () => {
    expect(COLORS.RED.displayName).toBe('Red');
    expect(COLORS.BLUE.displayName).toBe('Blue');
    expect(COLORS.GREEN.displayName).toBe('Green');
    expect(COLORS.YELLOW.displayName).toBe('Yellow');
    expect(COLORS.BLACK.displayName).toBe('White');
  });
});

describe('COLOR_NAMES', () => {
  it('should contain all 9 color names', () => {
    expect(COLOR_NAMES).toHaveLength(9);
    expect(COLOR_NAMES).toContain('RED');
    expect(COLOR_NAMES).toContain('BLUE');
    expect(COLOR_NAMES).toContain('GREEN');
    expect(COLOR_NAMES).toContain('YELLOW');
    expect(COLOR_NAMES).toContain('BLACK');
    expect(COLOR_NAMES).toContain('PURPLE');
    expect(COLOR_NAMES).toContain('ORANGE');
    expect(COLOR_NAMES).toContain('PINK');
    expect(COLOR_NAMES).toContain('CYAN');
  });

  it('should not have duplicates', () => {
    const uniqueNames = new Set(COLOR_NAMES);
    expect(uniqueNames.size).toBe(COLOR_NAMES.length);
  });
});

describe('getColor', () => {
  it('should return correct config for RED', () => {
    const color = getColor('RED');
    expect(color.displayName).toBe('Red');
    expect(color.hexValue).toBe('#EF4444');
    expect(color.tailwindClass).toBe('text-red-500');
  });

  it('should return correct config for BLUE', () => {
    const color = getColor('BLUE');
    expect(color.displayName).toBe('Blue');
    expect(color.hexValue).toBe('#3B82F6');
    expect(color.tailwindClass).toBe('text-blue-500');
  });

  it('should return correct config for GREEN', () => {
    const color = getColor('GREEN');
    expect(color.displayName).toBe('Green');
    expect(color.hexValue).toBe('#22C55E');
    expect(color.tailwindClass).toBe('text-green-500');
  });

  it('should return correct config for YELLOW', () => {
    const color = getColor('YELLOW');
    expect(color.displayName).toBe('Yellow');
    expect(color.hexValue).toBe('#EAB308');
    expect(color.tailwindClass).toBe('text-yellow-500');
  });

  it('should return correct config for BLACK', () => {
    const color = getColor('BLACK');
    expect(color.displayName).toBe('White');
    expect(color.hexValue).toBe('#1F2937');
    expect(color.tailwindClass).toBe('text-gray-800 dark:text-gray-200');
  });

  it('should return same reference as COLORS object', () => {
    expect(getColor('RED')).toBe(COLORS.RED);
    expect(getColor('BLUE')).toBe(COLORS.BLUE);
  });
});

describe('getRandomColor', () => {
  it('should return a valid color name without exclusions', () => {
    for (let i = 0; i < 50; i++) {
      const color = getRandomColor();
      expect(Object.keys(COLORS)).toContain(color);
    }
  });

  it('should return different colors over multiple calls', () => {
    const colors = Array.from({ length: 50 }, () => getRandomColor());
    const uniqueColors = new Set(colors);

    // With 50 calls, we should get at least 2 different colors
    expect(uniqueColors.size).toBeGreaterThan(1);
  });

  it('should exclude specified colors', () => {
    for (let i = 0; i < 20; i++) {
      const color = getRandomColor(['RED']);
      expect(color).not.toBe('RED');
    }
  });

  it('should handle multiple exclusions', () => {
    for (let i = 0; i < 20; i++) {
      const color = getRandomColor(['RED', 'BLUE', 'GREEN']);
      expect(['RED', 'BLUE', 'GREEN']).not.toContain(color);
    }
  });

  it('should handle empty exclude array', () => {
    const color = getRandomColor([]);
    expect(Object.keys(COLORS)).toContain(color);
  });

  it('should handle undefined exclude parameter', () => {
    const color = getRandomColor(undefined);
    expect(Object.keys(COLORS)).toContain(color);
  });
});
