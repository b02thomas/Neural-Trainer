import { useEffect, useMemo } from 'react';
import { ColorName } from '@/types/game';
import { getColor } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ColorButtonsProps {
  onColorSelect: (color: ColorName) => void;
  buttonOrder: ColorName[];
  disabled?: boolean;
  className?: string;
}

// Letter mappings for keyboard shortcuts
const COLOR_LETTERS: Record<ColorName, string> = {
  RED: 'R',
  BLUE: 'B',
  GREEN: 'G',
  YELLOW: 'Y',
  BLACK: 'W',
  PURPLE: 'P',
  ORANGE: 'O',
  PINK: 'I',
  CYAN: 'C',
};

export function ColorButtons({ onColorSelect, buttonOrder, disabled = false, className }: ColorButtonsProps) {
  // Build dynamic keyboard mappings based on current button order
  const keyMappings = useMemo(() => {
    const mappings: Record<string, ColorName> = {};
    buttonOrder.forEach((color, index) => {
      mappings[String(index + 1)] = color;
      const letter = COLOR_LETTERS[color];
      mappings[letter.toLowerCase()] = color;
      mappings[letter.toUpperCase()] = color;
    });
    return mappings;
  }, [buttonOrder]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (disabled) return;
      const color = keyMappings[e.key];
      if (color) {
        e.preventDefault();
        onColorSelect(color);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onColorSelect, disabled, keyMappings]);

  // Determine grid columns based on number of colors
  const gridCols = buttonOrder.length <= 5
    ? 'grid-cols-5'
    : buttonOrder.length <= 6
      ? 'grid-cols-3 md:grid-cols-6'
      : 'grid-cols-3 md:grid-cols-5';

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <div className={cn("grid gap-1.5 md:gap-3", gridCols)}>
        <AnimatePresence mode="popLayout">
          {buttonOrder.map((colorName, index) => {
            const colorConfig = getColor(colorName);
            const keyHint = index + 1;
            const letterHint = COLOR_LETTERS[colorName];

            return (
              <motion.button
                key={colorName}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={disabled ? {} : { scale: 1.05, y: -2 }}
                whileTap={disabled ? {} : { scale: 0.95 }}
                onClick={() => !disabled && onColorSelect(colorName)}
                disabled={disabled}
                className={cn(
                  "relative h-14 md:h-20 rounded-lg md:rounded-xl font-semibold transition-all duration-200",
                  "border border-foreground/10",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                  disabled
                    ? "opacity-40 cursor-not-allowed bg-foreground/5"
                    : "cursor-pointer hover:border-foreground/30"
                )}
                style={{
                  backgroundColor: disabled ? 'hsl(var(--muted) / 0.3)' : `${colorConfig.hexValue}20`,
                  boxShadow: disabled ? 'none' : `0 0 20px ${colorConfig.hexValue}30, inset 0 0 20px ${colorConfig.hexValue}10`,
                }}
              >
                {/* Glow effect on hover */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-lg md:rounded-xl opacity-0 transition-opacity duration-200",
                    !disabled && "group-hover:opacity-100"
                  )}
                  style={{
                    boxShadow: `0 0 30px ${colorConfig.hexValue}50`,
                  }}
                />

                {/* Content */}
                <div className="relative flex flex-col items-center justify-center h-full">
                  <span
                    className="text-xs md:text-base font-bold"
                    style={{ color: disabled ? 'hsl(var(--muted-foreground))' : colorConfig.hexValue }}
                  >
                    {colorConfig.displayName}
                  </span>
                  {/* Hide keyboard hints on mobile - not useful for touch */}
                  <span className="hidden md:block text-xs text-muted-foreground mt-1 font-mono">
                    {keyHint} / {letterHint}
                  </span>
                </div>

                {/* Active indicator */}
                {!disabled && (
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-full"
                    style={{ backgroundColor: `${colorConfig.hexValue}60` }}
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Hide keyboard hints on mobile */}
      <div className="hidden md:block mt-3 text-center text-xs text-muted-foreground font-mono">
        KEYS: 1-{buttonOrder.length} | {buttonOrder.map(c => COLOR_LETTERS[c]).join(' ')}
      </div>
    </div>
  );
}
