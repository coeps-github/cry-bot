import BinanceApi from 'node-binance-api';
import {
  Binance,
  BinanceConfig,
  CandleStickHistoryAPI,
  CandleStickHistoryFutureOptions,
  CandleStickHistoryOptions,
  CandleStickHistoryPastOptions,
  CandleSticksOptions,
  CandleSticksWithHistoryOptions,
  CandleStickWrapper,
  CandleStickWrapperAPI,
  Chart,
  ChartExtended,
  ChartWrapper,
  Period
} from './model';
import { concat, forkJoin, Observable, of } from 'rxjs';
import { concatMap, filter, map, share, take } from 'rxjs/operators';
import { sortCandleSticks } from './helpers';

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
          } as ChartExtended;
        })
      );
    },
    getCandleStickHistory: (
      symbol = 'BTCUSDT',
      period: Period = '1m',
      options: CandleStickHistoryOptions = { limit: 1000 }
    ) => {
      return new Observable<CandleStickHistoryAPI[]>((observer) => {
        binanceApi.candlesticks(
          symbol,
          period,
          (error: unknown, candleSticks: CandleStickHistoryAPI[]) => error ?
            observer.error(error) :
            observer.next(candleSticks),
          {
            limit: options.limit,
            startTime: options.startTime,
            endTime: options.endTime
          }
        );
        return () => {
          // empty
        };
      }).pipe(
        share(),
        map(candleSticks => candleSticks.map(candleStick => {
          const [eventTime, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume] = candleStick;
          return {
            symbol,
            interval: period,
            tick: {
              eventTime,
              closeTime,
              isFinal: true,
              trades,
              quoteVolume: assetVolume,
              buyVolume: buyBaseVolume,
              quoteBuyVolume: buyAssetVolume,
              open: open,
              high: high,
              low: low,
              close: close,
              volume: volume
            }
          } as CandleStickWrapper;
        }))
      );
    },
    getCandleSticks: (
      symbols = ['BTCUSDT'],
      period: Period = '1m',
      options: CandleSticksOptions = { finalOnly: true }
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
          } as CandleStickWrapper;
        }),
        filter((candleSticks: CandleStickWrapper) => (options?.finalOnly && candleSticks.tick.isFinal) || !options?.finalOnly)
      );
    }
  };
  const getCandleStickHistoryPastRecursive: Binance['getCandleStickHistoryPastRecursive'] = (
    symbol: string,
    period: Period = '1m',
    futureHistory: CandleStickWrapper[] = [],
    options: CandleStickHistoryPastOptions = { limit: 100000 }
  ) => {
    return binance.getCandleStickHistory(symbol, period, {
      limit: options.limit,
      endTime: options.endTime
    }).pipe(
      take(1),
      concatMap(pastHistory => {
        const history = [...pastHistory, ...futureHistory];
        const limit = options.limit || history.length;
        if (pastHistory.length > 0 && history.length < limit) {
          return getCandleStickHistoryPastRecursive(symbol, period, history, {
            limit: (limit - history.length) || 1000,
            endTime: history[0].tick.eventTime
          });
        }
        return of(history.slice(history.length - limit));
      })
    );
  };
  const getCandleStickHistoryFutureRecursive: Binance['getCandleStickHistoryFutureRecursive'] = (
    symbol: string,
    period: Period = '1m',
    pastHistory: CandleStickWrapper[] = [],
    options: CandleStickHistoryFutureOptions = { limit: 100000 }
  ) => {
    return binance.getCandleStickHistory(symbol, period, {
      limit: options.limit,
      startTime: options.startTime
    }).pipe(
      take(1),
      concatMap(futureHistory => {
        const history = [...pastHistory, ...futureHistory];
        const limit = options.limit || history.length;
        if (futureHistory.length > 0 && history.length < limit) {
          return getCandleStickHistoryFutureRecursive(symbol, period, history, {
            limit: (limit - history.length) || 1000,
            startTime: history[history.length - 1].tick.closeTime
          });
        }
        return of(history.slice(history.length - limit));
      })
    );
  };
  return {
    ...binance,
    getCandleStickHistoryPastRecursive,
    getCandleStickHistoryFutureRecursive,
    getCandleSticksWithHistory: (
      symbols = ['BTCUSDT'],
      period: Period = '1m',
      options: CandleSticksWithHistoryOptions = { finalOnly: true, limit: 100000 }
    ) => {
      const history = symbols.map(symbol => getCandleStickHistoryPastRecursive(symbol, period, undefined, options)
        .pipe(concatMap(pastHistory => getCandleStickHistoryFutureRecursive(symbol, period, pastHistory, {
          ...options,
          startTime: pastHistory[pastHistory.length - 1].tick.closeTime
        }))));
      const joinedHistory = forkJoin(history).pipe(
        concatMap(history => ([] as CandleStickWrapper[])
          .concat(...history)
          .sort(sortCandleSticks))
      );
      const candles = binance.getCandleSticks(symbols, period, options);
      return concat(joinedHistory, candles);
    }
  } as Binance;
}
