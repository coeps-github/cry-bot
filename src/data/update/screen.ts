import { Console, ConsoleScreen } from '../../console/model';
import { Binance } from '../../binance/model';
import { extractCommandValues } from '../../console/helpers';
import { periods } from '../../binance/helpers';

export function getDataUpdateScreen(console: Console, binance: Binance): ConsoleScreen {
  let symbol = 'BTCUSDT';
  let isRunning = false;
  let visible = false;
  let cache: (() => void)[] = [];

  const update = () => {
    isRunning = true;
    periods.forEach(period => binance.getCandleStickHistoryLocal(symbol, period, { limit: 1000000000 }).subscribe({
      error: (error) => writeAndCache(() => console.writeError(`${period} error: ${error.message}!`)),
      complete: () => writeAndCache(() => console.write(`${period} done!`))
    }));
  };

  const writeAndCache = (fn: () => void) => {
    if (visible) {
      fn();
    }
    cache = [...cache, fn];
    if (cache.length >= periods.length) {
      if (visible) {
        console.write('Updating Data done!');
      }
      cache = [];
      isRunning = false;
    }
  };

  return {
    name: 'DataUpdate',
    isRunning: () => isRunning,
    canShow: (command: string) => {
      const symbolValues = extractCommandValues(['du', 'dataUpdate'], command);
      const symbolValue = symbolValues[0];
      if (symbolValue) {
        symbol = symbolValue;
      }
      return command === 'du' || command === 'dataUpdate';
    },
    show: () => {
      visible = true;
      console.clear();
      console.write('Updating Data ...');
      cache.forEach(fn => fn());
      if (!isRunning) {
        update();
      }
    },
    hide: () => {
      visible = false;
    },
    help: () => {
      console.write('du   / dataUpdate:              Update Data                 (default: BTCUSDT)');
      console.write('ducr / setDataUpdateCachedRows: Set Data Update Cached Rows (default: 50)');
    }
  };
}
