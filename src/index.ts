import { getBinance } from './binance/binance';
import { getConfig } from './config/config';
import { getStatistics } from './statistics/statistics';

const config = getConfig();
const binance = getBinance(config.binance);
const statistics = getStatistics(binance);

statistics.analyzeCandles(['BTCUSDT', 'ETHUSDT'], '1m')
  .subscribe(statistics => console.log(Object.keys(statistics).map(key => JSON.stringify(statistics[key])).join('\n')));
