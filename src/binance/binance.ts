import BinanceApi from 'node-binance-api';
import { Binance, BinanceConfig, CandleSticks, CandleSticksShort, Chart, ChartWrapper, Period } from './model';
import { Observable } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';

export function getBinance(config: BinanceConfig): Binance {
  const binance = BinanceApi().options(config);
  return {
    getChart: (symbol = 'BTCUSDT', period: Period = '1m') => {
      return new Observable<ChartWrapper>((observer) => {
        binance.websockets.chart(symbol, period, (symbol: string, interval: string, chart: Chart) => observer.next({
          symbol,
          interval,
          chart
        }));
        return () => {
          // empty
        };
      }).pipe(
        share(),
        map((chartWrapper: ChartWrapper) => {
          const lastTickTime = binance.last(chartWrapper.chart);
          const lastTick = chartWrapper.chart[lastTickTime];
          return {
            ...chartWrapper,
            lastTickTime,
            lastTick
          };
        })
      );
    },
    getCandleSticks: (symbols = ['BTCUSDT'], period: Period = '1m', finalOnly = true) => {
      return new Observable<CandleSticksShort>((observer) => {
        binance.websockets.candlesticks(symbols, period, (candleSticks: CandleSticksShort) => observer.next(candleSticks));
        return () => {
          // empty
        };
      }).pipe(
        share(),
        map((candleSticks: CandleSticksShort) => {
          const { e: eventType, E: eventTime, s: symbol, k: ticks } = candleSticks;
          const { o: open, h: high, l: low, c: close, v: volume, n: trades, i: interval, x: isFinal, q: quoteVolume, V: buyVolume, Q: quoteBuyVolume } = ticks;
          return {
            eventType,
            eventTime,
            symbol,
            ticks: {
              open,
              high,
              low,
              close,
              volume,
              trades,
              interval,
              isFinal,
              quoteVolume,
              buyVolume,
              quoteBuyVolume
            }
          };
        }),
        filter((candleSticks: CandleSticks) => (finalOnly && candleSticks.ticks.isFinal) || !finalOnly)
      );
    }
  };
}
