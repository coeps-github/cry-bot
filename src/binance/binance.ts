import BinanceApi from 'node-binance-api';
import { Binance, BinanceConfig, CandleSticks, CandleSticksCallback, CandleSticksShort } from './model';

export function getBinance(config: BinanceConfig): Binance {
  const binance = BinanceApi().options(config);
  return {
    getCandleSticks: (callback: CandleSticksCallback, symbol = 'BTCUSDT', period = '1m', finalOnly = true) => {
      binance.websockets.candlesticks([symbol], period, (candlesticks: CandleSticksShort) => {
        const { e: eventType, E: eventTime, s: symbol, k: ticks } = candlesticks;
        const { o: open, h: high, l: low, c: close, v: volume, n: trades, i: interval, x: isFinal, q: quoteVolume, V: buyVolume, Q: quoteBuyVolume } = ticks;
        if ((finalOnly && isFinal) || !finalOnly) {
          const update: CandleSticks = {
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
          callback(update);
        }
      });
    }
  };
}
