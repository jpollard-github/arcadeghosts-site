export const ambientTimeModes = ["morning", "afternoon", "evening", "late-night"] as const;

export type AmbientTimeMode = (typeof ambientTimeModes)[number];

function isAmbientTimeMode(value: string): value is AmbientTimeMode {
  return ambientTimeModes.includes(value as AmbientTimeMode);
}

export function normalizeAmbientTimeMode(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "late-night" || normalized === "latenight") {
    return "late-night" as const;
  }

  return isAmbientTimeMode(normalized) ? normalized : null;
}

export function getAmbientTimeModeForHour(hour: number): AmbientTimeMode {
  if (hour >= 6 && hour < 12) {
    return "morning";
  }

  if (hour >= 12 && hour < 17) {
    return "afternoon";
  }

  if (hour >= 17 && hour < 23) {
    return "evening";
  }

  return "late-night";
}
