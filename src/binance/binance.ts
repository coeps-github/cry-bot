import BinanceApi from 'node-binance-api';
import {
  Binance,
  BinanceConfig,
  CandleSticks,
  CandleSticksShort,
  Chart,
  ChartWrapper,
  Period,
  Tick,
  TickExtended
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
    getCandleSticks: (symbols = ['BTCUSDT'], period: Period = '1m', finalOnly = true) => {
      return new Observable<CandleSticksShort>((observer) => {
        binanceApi.websockets.candlesticks(symbols, period, (candleSticks: CandleSticksShort) => observer.next(candleSticks));
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
  return {
    ...binance,
    getTicks: (symbols = ['BTCUSDT'], period: Period = '1m') => {
      const charts = symbols.map(symbol => binance.getChart(symbol, period).pipe(
        take(1),
        map(chart => Object.keys(chart.chart)
          .reduce((arr, key) => [...arr, { ...chart.chart[key], eventTime: +key }], [] as Tick[])
          .slice(0, -1)
          .map(tick => ({
            ...tick,
            symbol: chart.symbol,
            isFinal: true
          } as TickExtended)))
      ));
      const joinedCharts = forkJoin(charts).pipe(
        concatMap(charts => ([] as TickExtended[])
          .concat(...charts)
          .sort((a, b) => a.eventTime === b.eventTime ? 0 : a.eventTime < b.eventTime ? -1 : 1))
      );
      const candles = binance.getCandleSticks(symbols, period).pipe(
        map(candle => ({
          open: candle.ticks.open,
          high: candle.ticks.high,
          low: candle.ticks.low,
          close: candle.ticks.close,
          volume: candle.ticks.volume,
          eventTime: candle.eventTime,
          symbol: candle.symbol,
          isFinal: candle.ticks.isFinal
        } as TickExtended))
      );
      return concat(joinedCharts, candles);
    }
  } as Binance;
}
