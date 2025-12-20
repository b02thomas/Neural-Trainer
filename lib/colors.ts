import { ColorName, ColorDictionary } from '@/types/game';

// Color configuration for the Stroop test
// Each color has display name, hex value, and Tailwind CSS classes
export const COLORS: ColorDictionary = {
  RED: {
    displayName: 'Red',
    hexValue: '#EF4444',
    tailwindClass: 'text-red-500',
    buttonClass: 'bg-red-500 hover:bg-red-600 active:bg-red-700 !text-black',
  },
  BLUE: {
    displayName: 'Blue',
    hexValue: '#3B82F6',
    tailwindClass: 'text-blue-500',
    buttonClass: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 !text-black',
  },
  GREEN: {
    displayName: 'Green',
    hexValue: '#22C55E',
    tailwindClass: 'text-green-500',
    buttonClass: 'bg-green-500 hover:bg-green-600 active:bg-green-700 !text-black',
  },
  YELLOW: {
    displayName: 'Yellow',
    hexValue: '#EAB308',
    tailwindClass: 'text-yellow-500',
    buttonClass: 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 !text-black',
  },
  BLACK: {
    displayName: 'White',
    hexValue: '#F3F4F6',
    tailwindClass: 'text-gray-100',
    buttonClass: 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 !text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:!text-white',
  },
  PURPLE: {
    displayName: 'Purple',
    hexValue: '#A855F7',
    tailwindClass: 'text-purple-500',
    buttonClass: 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700 !text-black',
  },
  ORANGE: {
    displayName: 'Orange',
    hexValue: '#F97316',
    tailwindClass: 'text-orange-500',
    buttonClass: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 !text-black',
  },
  PINK: {
    displayName: 'Pink',
    hexValue: '#EC4899',
    tailwindClass: 'text-pink-500',
    buttonClass: 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700 !text-black',
  },
  CYAN: {
    displayName: 'Cyan',
    hexValue: '#06B6D4',
    tailwindClass: 'text-cyan-500',
    buttonClass: 'bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 !text-black',
  },
};

// Array of all color names
export const COLOR_NAMES: ColorName[] = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'BLACK', 'PURPLE', 'ORANGE', 'PINK', 'CYAN'];

// Helper function to get color config by name
export function getColor(colorName: ColorName) {
  return COLORS[colorName];
}

// Helper function to get random color from a specific set
export function getRandomColor(exclude?: ColorName[], fromColors?: ColorName[]): ColorName {
  const colorPool = fromColors || COLOR_NAMES;
  const availableColors = exclude && exclude.length > 0
    ? colorPool.filter(color => !exclude.includes(color))
    : colorPool;

  if (availableColors.length === 0) {
    throw new Error('No colors available to select');
  }

  return availableColors[Math.floor(Math.random() * availableColors.length)];
}

// Helper function to shuffle an array (Fisher-Yates)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
