import BinanceApi from 'node-binance-api';
import {
  Binance,
  BinanceConfig,
  CandleStickHistoryAPI,
  CandleStickHistoryLimitOptions,
  CandleStickHistoryOptions,
  CandleStickHistoryRecursiveOptions,
  CandleSticksOptions,
  CandleSticksWithHistoryOptions,
  CandleStickWrapper,
  CandleStickWrapperAPI,
  Chart,
  ChartExtended,
  ChartWrapper,
  Period
} from './model';
import { concat, EMPTY, Observable } from 'rxjs';
import { concatMap, filter, map, share, tap } from 'rxjs/operators';
import { getFileName } from './helpers';
import { File } from '../file/model';
import { chain } from '../shared/chain';

export function getBinance(config: BinanceConfig, file: File): Binance {
  const binanceApi = BinanceApi().options(config);
  const apiHistoryLimit = 1000;
  const getChart: Binance['getChart'] = (symbol = 'BTCUSDT', period: Period = '1m') => {
    return new Observable<ChartWrapper>(observer => {
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
  };
  const getCandleSticks: Binance['getCandleSticks'] = (
    symbol = 'BTCUSDT',
    period: Period = '1m',
    options: CandleSticksOptions = { finalOnly: true }
  ) => {
    return new Observable<CandleStickWrapperAPI>(observer => {
      binanceApi.websockets.candlesticks([symbol], period, (candleSticks: CandleStickWrapperAPI) => observer.next(candleSticks));
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
  };
  const getCandleStickHistory: Binance['getCandleStickHistory'] = (
    symbol = 'BTCUSDT',
    period: Period = '1m',
    options: CandleStickHistoryOptions = { limit: apiHistoryLimit }
  ) => {
    const optionsLimit = options.limit || apiHistoryLimit;
    const nextLimit = optionsLimit > apiHistoryLimit ? apiHistoryLimit : optionsLimit;
    return new Observable<CandleStickHistoryAPI[]>(observer => {
      const apiCall = (errorCount: number) => binanceApi.candlesticks(
        symbol,
        period,
        (error: unknown, candleSticks: CandleStickHistoryAPI[]) => {
          if (error) {
            if (errorCount < 0) {
              observer.error(error);
            } else {
              console.error(error);
              apiCall(errorCount - 1);
            }
          } else {
            observer.next(candleSticks);
            observer.complete();
          }
        },
        {
          limit: nextLimit,
          startTime: options.startTime,
          endTime: options.endTime
        }
      );
      apiCall(3);
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
      })),
      concatMap(candleSticks => candleSticks)
    );
  };
  const getCandleStickHistoryRecursive: Binance['getCandleStickHistoryRecursive'] = (
    symbol: string,
    period: Period = '1m',
    lastCandleStick = undefined,
    options: CandleStickHistoryRecursiveOptions = { limit: 100000 }
  ) => {
    const optionsLimit = options.limit || apiHistoryLimit;
    const nextLimit = optionsLimit > apiHistoryLimit ? optionsLimit - apiHistoryLimit : 0;
    return chain(
      getCandleStickHistory(symbol, period, {
        limit: optionsLimit,
        startTime: options.startTime
      }),
      candleStick => {
        if (
          nextLimit > 0 &&
          lastCandleStick?.tick?.eventTime !== candleStick?.tick?.eventTime
        ) {
          return getCandleStickHistoryRecursive(symbol, period, candleStick, {
            limit: nextLimit,
            startTime: candleStick?.tick?.closeTime || 0
          });
        } else {
          return EMPTY;
        }
      }
    );
  };
  const getCandleStickHistoryLocal: Binance['getCandleStickHistoryLocal'] = (
    symbol = 'BTCUSDT',
    period: Period = '1m',
    options: CandleStickHistoryLimitOptions = { limit: 100000 }
  ) => {
    const fileName = getFileName(symbol, period);
    const fileHistory = file.readLines<CandleStickWrapper>(fileName);
    return chain(fileHistory, candleStick => getCandleStickHistoryRecursive(symbol, period, undefined, {
      limit: options.limit,
      startTime: candleStick?.tick?.closeTime || 0
    }).pipe(
      tap(history => file.appendLine(fileName, history))
    ));
  };
  const getCandleSticksWithHistory: Binance['getCandleSticksWithHistory'] = (
    symbol = 'BTCUSDT',
    period: Period = '1m',
    options: CandleSticksWithHistoryOptions = { finalOnly: true, limit: 100000 }
  ) => {
    const history = getCandleStickHistoryRecursive(symbol, period, undefined, { limit: options.limit });
    const candles = getCandleSticks(symbol, period, options);
    return concat(history, candles);
  };
  const getCandleSticksWithHistoryLocal: Binance['getCandleSticksWithHistoryLocal'] = (
    symbol = 'BTCUSDT',
    period: Period = '1m',
    options: CandleSticksWithHistoryOptions = { finalOnly: true, limit: 100000 }
  ) => {
    const history = getCandleStickHistoryLocal(symbol, period, { limit: options.limit });
    const candles = getCandleSticks(symbol, period, options);
    return concat(history, candles);
  };
  return {
    getChart,
    getCandleSticks,
    getCandleStickHistory,
    getCandleStickHistoryLocal,
    getCandleSticksWithHistory,
    getCandleSticksWithHistoryLocal
  } as Binance;
}
