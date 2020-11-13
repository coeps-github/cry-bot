import { Period } from './model';

export function getFileName(symbol: string, period: Period): string {
  return `binance-${symbol}-${period}`;
}
