export interface ManualEntry {
  name: string;
  calories: number;
}

// Matches patterns like:
//   "500"           → Manual Entry — 500 kcal
//   "500 cal"       → Manual Entry — 500 kcal
//   "500 kcal"      → Manual Entry — 500 kcal
//   "500 calories"  → Manual Entry — 500 kcal
//   "chicken 350"   → Chicken — 350 kcal
//   "lunch 800 cal" → Lunch — 800 kcal
const CALORIE_UNIT = /\s*(cal(?:ories)?|kcal)\s*$/i;

export function parseManualCalories(input: string): ManualEntry | null {
  const trimmed = input.trim();

  // Strip trailing calorie unit to isolate the numeric part
  const withoutUnit = trimmed.replace(CALORIE_UNIT, '').trim();

  // Pattern: optional label followed by a number
  // e.g. "chicken 350", "800", "big mac 550"
  const match = withoutUnit.match(/^(.*?)\s*(\d{1,5})\s*$/);
  if (!match) return null;

  const calories = parseInt(match[2], 10);
  if (calories <= 0 || calories > 10000) return null;

  // If there's a unit suffix OR a numeric-only entry, treat as manual
  const hasUnit = CALORIE_UNIT.test(trimmed);
  const isNumericOnly = /^\d+$/.test(trimmed);
  const label = match[1].trim();

  // Require a unit OR a purely numeric input — naked "chicken 3" should go to AI
  // unless the number looks like calories (≥ 50)
  if (!hasUnit && !isNumericOnly && calories < 50) return null;

  const name = label
    ? label.charAt(0).toUpperCase() + label.slice(1)
    : 'Manual Entry';

  return { name, calories };
}
