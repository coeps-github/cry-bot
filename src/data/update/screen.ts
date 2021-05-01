import { Console, ConsoleScreen } from '../../console/model';
import { Binance } from '../../binance/model';

export function getDataUpdateScreen(console: Console, binance: Binance): ConsoleScreen {
  let visible = false;
  let cache: (() => void)[] = [];

  const update = () => {
    binance.getCandleStickHistoryLocal('BTCUSDT', '1m', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('1m error!')),
      complete: () => writeAndCache(() => console.write('1m done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '3m', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('3m error!')),
      complete: () => writeAndCache(() => console.write('3m done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '5m', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('5m error!')),
      complete: () => writeAndCache(() => console.write('5m done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '15m', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('15m error!')),
      complete: () => writeAndCache(() => console.write('15m done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '30m', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('30m error!')),
      complete: () => writeAndCache(() => console.write('30m done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '1h', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('1h error!')),
      complete: () => writeAndCache(() => console.write('1h done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '2h', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('2h error!')),
      complete: () => writeAndCache(() => console.write('2h done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '4h', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('4h error!')),
      complete: () => writeAndCache(() => console.write('4h done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '6h', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('6h error!')),
      complete: () => writeAndCache(() => console.write('6h done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '8h', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('8h error!')),
      complete: () => writeAndCache(() => console.write('8h done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '12h', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('12h error!')),
      complete: () => writeAndCache(() => console.write('12h done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '1d', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('1d error!')),
      complete: () => writeAndCache(() => console.write('1d done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '3d', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('3d error!')),
      complete: () => writeAndCache(() => console.write('3d done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '1w', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('1w error!')),
      complete: () => writeAndCache(() => console.write('1w done!'))
    });
    binance.getCandleStickHistoryLocal('BTCUSDT', '1M', { limit: 1000000000 }).subscribe({
      error: () => writeAndCache(() => console.writeError('1M error!')),
      complete: () => writeAndCache(() => console.write('1M done!'))
    });
  };

  const writeAndCache = (fn: () => void) => {
    if (visible) {
      fn();
    }
    cache = [...cache, fn];
    if (cache.length >= 15) {
      if (visible) {
        console.write('Updating Data done!');
      }
      cache = [];
    }
  };

  return {
    canShow: (command: string) => {
      return command === 'du' || command === 'dataUpdate';
    },
    show: () => {
      visible = true;
      console.clear();
      console.write('Updating Data ...');
      cache.forEach(fn => fn());
      if (!cache.length) {
        update();
      }
    },
    hide: () => {
      visible = false;
    },
    help: () => {
      console.write('du   / dataUpdate:              Update Data');
      console.write('ducr / setDataUpdateCachedRows: Set Data Update Cached Rows (default: 50)');
    }
  };
}
