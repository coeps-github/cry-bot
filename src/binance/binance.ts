import BinanceApi from 'node-binance-api';
import {
  Binance,
  BinanceConfig,
  CandleStickHistoryAPI,
  CandleStickHistoryOptions,
  CandleStickOptions,
  CandleStickWrapper,
  CandleStickWrapperAPI,
  Chart,
  ChartWrapper,
  Period
} from './model';
import { concat, forkJoin, Observable } from 'rxjs';
import { concatMap, filter, map, share, take } from 'rxjs/operators';

export function getBinance(config: BinanceConfig): Binance {
  const binanceApi = BinanceApi().options(config);
  const binance = {
    getChart: (symbol = 'BTCUSDT', period: Period = '1m') => {
      return new Observable<ChartWrapper>((observer) => {
        binanceApi.websockets.chart(symbol, period, (symbol: string, interval: string, chart: Chart) => observer.next({
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
          const lastTickTime = binanceApi.last(chartWrapper.chart);
          const lastTick = chartWrapper.chart[lastTickTime];
          return {
            ...chartWrapper,
            lastTickTime,
            lastTick
          };
        })
      );
    },
    getCandleStickHistory: (
      symbol = 'BTCUSDT',
      period: Period = '1m',
      options: CandleStickHistoryOptions = { finalOnly: true, limit: 10000 }
    ) => {
      return new Observable<CandleStickHistoryAPI[]>((observer) => {
        binanceApi.candlesticks(
          symbol,
          period,
          (error: unknown, candleSticks: CandleStickHistoryAPI[]) => error ?
            observer.error(error) :
            observer.next(candleSticks),
          options
        );
        return () => {
          // empty
        };
      }).pipe(
        share(),
        concatMap(candleSticks => candleSticks.map(candleStick => ({
          symbol,
          interval: period,
          tick: {
            eventTime: candleStick.time,
            isFinal: !candleStick.ignored,
            trades: candleStick.trades,
            quoteVolume: candleStick.assetVolume,
            buyVolume: candleStick.buyBaseVolume,
            quoteBuyVolume: candleStick.buyAssetVolume,
            open: candleStick.open,
            high: candleStick.high,
            low: candleStick.low,
            close: candleStick.close,
            volume: candleStick.volume
          }
        }))),
        filter((candleSticks: CandleStickWrapper) => (options?.finalOnly && candleSticks.tick.isFinal) || !options?.finalOnly)
      );
    },
    getCandleSticks: (
      symbols = ['BTCUSDT'],
      period: Period = '1m',
      options: CandleStickOptions = { finalOnly: true }
    ) => {
      return new Observable<CandleStickWrapperAPI>((observer) => {
        binanceApi.websockets.candlesticks(symbols, period, (candleSticks: CandleStickWrapperAPI) => observer.next(candleSticks));
        return () => {
          // empty
        };
      }).pipe(
        share(),
        map((candleSticks: CandleStickWrapperAPI) => {
          const { e: eventType, E: eventTime, s: symbol, k: ticks } = candleSticks;
          const { o: open, h: high, l: low, c: close, v: volume, n: trades, i: interval, x: isFinal, q: quoteVolume, V: buyVolume, Q: quoteBuyVolume } = ticks;
          return {
            symbol,
            interval,
            tick: {
              eventType,
              eventTime,
              isFinal,
              trades,
              quoteVolume,
              buyVolume,
              quoteBuyVolume,
              open,
              high,
              low,
              close,
              volume
            }
          };
        }),
        filter((candleSticks: CandleStickWrapper) => (options?.finalOnly && candleSticks.tick.isFinal) || !options?.finalOnly)
      );
    }
  };
  return {
    ...binance,
    getCandleSticksWithHistory: (
      symbols = ['BTCUSDT'],
      period: Period = '1m',
      options: CandleStickHistoryOptions = { finalOnly: true, limit: 10000 }
    ) => {
      const history = symbols.map(symbol => binance.getCandleStickHistory(symbol, period, options).pipe(take(1)));
      const joinedHistory = forkJoin(history).pipe(
        concatMap(history => ([] as CandleStickWrapper[])
          .concat(...history)
          .sort((a, b) => a.tick.eventTime === b.tick.eventTime ? 0 : a.tick.eventTime < b.tick.eventTime ? -1 : 1))
      );
      const candles = binance.getCandleSticks(symbols, period, options);
      return concat(joinedHistory, candles);
    }
  } as Binance;
}
