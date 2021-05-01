import { Console, ConsoleScreen } from '../../console/model';
import { Binance } from '../../binance/model';
import { extractCommandValues } from '../../console/helpers';
import { periods } from '../../binance/helpers';

export function getDataVerifyScreen(console: Console, binance: Binance): ConsoleScreen {
  let symbol = 'BTCUSDT';
  let isRunning = false;
  let visible = false;
  let cache: (() => void)[] = [];

  const update = () => {
    isRunning = true;
    periods.forEach(period => binance.checkCandleStickHistoryLocal(symbol, period).subscribe({
      next: (result) => writeAndCache(() => console.write(`${period} ${result ? 'data verified' : 'data inconsistent'}!`)),
      error: (error) => writeAndCache(() => console.writeError(`${period} error: ${error.message}!`))
    }));
  };

  const writeAndCache = (fn: () => void) => {
    if (visible) {
      fn();
    }
    cache = [...cache, fn];
    if (cache.length >= periods.length) {
      if (visible) {
        console.write('Verifying Data done!');
      }
      cache = [];
      isRunning = false;
    }
  };

  return {
    name: 'DataVerify',
    isRunning: () => isRunning,
    canShow: (command: string) => {
      const symbolValues = extractCommandValues(['dv', 'dataVerify'], command);
      const symbolValue = symbolValues[0];
      if (symbolValue) {
        symbol = symbolValue;
      }
      return command === 'dv' || command === 'dataVerify';
    },
    show: () => {
      visible = true;
      console.clear();
      console.write('Verifying Data ...');
      cache.forEach(fn => fn());
      if (!isRunning) {
        update();
      }
    },
    hide: () => {
      visible = false;
    },
    help: () => {
      console.write('dv   / dataVerify:              Verify Data                 (default: BTCUSDT)');
      console.write('dvcr / setDataVerifyCachedRows: Set Data Update Cached Rows (default: 50)');
    }
  };
}
