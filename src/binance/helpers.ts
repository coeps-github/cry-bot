import { CandleStickWrapper } from './model';

export function sortCandleSticks(a: CandleStickWrapper, b: CandleStickWrapper): 0 | 1 | -1 {
  return a.tick.eventTime === b.tick.eventTime ? 0 : a.tick.eventTime < b.tick.eventTime ? -1 : 1;
}
