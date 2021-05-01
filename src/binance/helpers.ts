import { Period } from './model';

export function getFileName(symbol: string, period: Period): string {
  const timeMap: Record<string, string> = {
    m: 'minute',
    h: 'hour',
    d: 'day',
    w: 'week',
    M: 'month'
  };
  const key = period.substr(period.length - 1);
  const number = +period.substring(0, period.length - 1);
  const time = `${number}${timeMap[key]}`;
  const longPeriod = number > 1 ? `${time}s` : time;
  return `binance-${symbol}-${longPeriod}`;
}

export function isWithinPeriod(period: Period, prevTimestamp: number, nextTimestamp: number): boolean {
  const timeMs = periodMsMap[period];
  if (period === '1M') {
    const lowerBound = timeMs;
    const upperBound = timeMs + oneDayMs * 3;
    return prevTimestamp + lowerBound <= nextTimestamp && prevTimestamp + upperBound >= nextTimestamp;
  }
  return prevTimestamp + timeMs === nextTimestamp;
}

export const periods: Period[] = [
  '1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'
];

export const oneMinuteMs = 1000 * 60;
export const threeMinuteMs = oneMinuteMs * 3;
export const fiveMinuteMs = oneMinuteMs * 5;
export const fifteenMinuteMs = oneMinuteMs * 15;
export const thirtyMinuteMs = oneMinuteMs * 30;
export const oneHourMs = oneMinuteMs * 60;
export const twoHoursMs = oneHourMs * 2;
export const fourHoursMs = oneHourMs * 4;
export const sixHoursMs = oneHourMs * 6;
export const eightHoursMs = oneHourMs * 8;
export const twelveHoursMs = oneHourMs * 12;
export const oneDayMs = oneHourMs * 24;
export const threeDaysMs = oneDayMs * 3;
export const oneWeekMs = oneDayMs * 7;
export const oneMonthMs = oneWeekMs * 4;

export const periodMsMap: Record<string, number> = {
  '1m': oneMinuteMs,
  '3m': threeMinuteMs,
  '5m': fiveMinuteMs,
  '15m': fifteenMinuteMs,
  '30m': thirtyMinuteMs,
  '1h': oneHourMs,
  '2h': twoHoursMs,
  '4h': fourHoursMs,
  '6h': sixHoursMs,
  '8h': eightHoursMs,
  '12h': twelveHoursMs,
  '1d': oneDayMs,
  '3d': threeDaysMs,
  '1w': oneWeekMs,
  '1M': oneMonthMs
};
