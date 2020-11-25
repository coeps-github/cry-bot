import { Period } from './model';

export function getFileName(symbol: string, period: Period): string {
  const timeMap: { [key: string]: string } = {
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
