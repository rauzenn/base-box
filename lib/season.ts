// Season configuration and utilities

export interface Season {
  id: string;
  startDate: Date;
  endDate: Date;
  lengthDays: number;
  resetHourUTC: number;
  tags: string[];
}

// Current season (hardcoded for MVP, later from DB/KV)
export const CURRENT_SEASON: Season = {
  id: 'season_1',
  startDate: new Date('2025-01-01T00:00:00Z'),
  endDate: new Date('2025-01-31T00:00:00Z'),
  lengthDays: 30,
  resetHourUTC: 0,
  tags: ['#gmBase']
};

/**
 * Get current day index within a season (0-based)
 * Day 0 = first day of season
 */
export function getCurrentDayIndex(seasonId: string): number {
  const season = CURRENT_SEASON; // TODO: fetch from KV if multiple seasons
  const now = new Date();
  const start = season.startDate;
  
  const diffMs = now.getTime() - start.getTime();
  const dayIdx = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  return Math.max(0, dayIdx);
}

/**
 * Get day window boundaries [start, end) for a given day index
 */
export function getDayWindow(
  seasonId: string,
  dayIdx: number
): { start: Date; end: Date } {
  const season = CURRENT_SEASON;
  const start = new Date(season.startDate);
  start.setUTCDate(start.getUTCDate() + dayIdx);
  start.setUTCHours(season.resetHourUTC, 0, 0, 0);
  
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  
  return { start, end };
}

/**
 * Check if a timestamp is within a day window
 */
export function isInDayWindow(
  timestamp: Date,
  seasonId: string,
  dayIdx: number
): boolean {
  const { start, end } = getDayWindow(seasonId, dayIdx);
  return timestamp >= start && timestamp < end;
}

/**
 * Check if season is active
 */
export function isSeasonActive(seasonId: string): boolean {
  const season = CURRENT_SEASON;
  const now = new Date();
  return now >= season.startDate && now <= season.endDate;
}