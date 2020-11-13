import { getBinance } from './binance/binance';
import { getConfig } from './config/config';
import { getStatistics } from './statistics/statistics';
import { getConsole } from './console/console';
import { debounceTime } from 'rxjs/operators';
import { getFile } from './file/file';

const config = getConfig();
const file = getFile(config.file);
const binance = getBinance(config.binance, file);
const console = getConsole(config.console);
const statistics = getStatistics(binance, console);

const testData = [
  { open: 13999, close: 14000.27, text: 'buy bla bla' },
  { open: 14000.27, close: 14001.87, text: '' },
  { open: 14001.87, close: 14003, text: '' },
  { open: 14003, close: 14007, text: '' },
  { open: 14007, close: 14002, text: '' },
  { open: 14002, close: 13990, text: 'sell bla bla' },
  { open: 13990, close: 14010, text: '' },
  { open: 14010, close: 14019, text: 'aasdf' },
  { open: 14019, close: 14020, text: '' },
  { open: 14020, close: 14009, text: '' },
  { open: 14009, close: 14021, text: '' },
  { open: 14021, close: 14001, text: '' },
  { open: 14001, close: 14000, text: '' },
  { open: 14000, close: 14003, text: '' },
  { open: 14003, close: 14004, text: 'buy aa aa' },
  { open: 14004, close: 14004, text: '' },
  { open: 14004, close: 13990, text: 'very very very long text here' }
];

console.execute('showGraph');
testData.forEach(data => console.writeGraph(data));

statistics.analyzeCandleCount('BTCUSDT', '1m', { finalOnly: true, limit: 200000 })
  .pipe(debounceTime(5000))
  .subscribe(result =>
    console.write(Object.keys(result)
      .map(key => JSON.stringify(result[key]))
      .join('\n')));

// statistics.analyzeMovingAverageCount('BTCUSDT', '1m', { finalOnly: true, limit: 200000 })
//   .pipe(debounceTime(5000))
//   .subscribe(result =>
//     console.write(Object.keys(result)
//       .map(key => JSON.stringify({
//         ...result[key],
//         statistics: result[key].statistics.map(statistic => ({ ...statistic, sma: {} }))
//       }))
//       .join('\n')));
