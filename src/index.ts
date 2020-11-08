// import { getBinance } from './binance/binance';
// import { getConfig } from './config/config';
// import { getStatistics } from './statistics/statistics';
import { getConsole } from './console/console';

// const config = getConfig();
// const binance = getBinance(config.binance);
// const statistics = getStatistics(binance);

const cons = getConsole();
cons.execute('help');

// statistics.analyzeCandleCount(['BTCUSDT'], '1m')
//   .subscribe(statistics => console.log(Object.keys(statistics).map(key => JSON.stringify(statistics[key])).join('\n')));

// statistics.analyzeMovingAverageCount(['BTCUSDT'], '1m', { finalOnly: true, limit: 200000 })
//   .subscribe(statistics => console.log(Object.keys(statistics)
//     .map(key => JSON.stringify(statistics[key]
//       .map(statistic => ({ ...statistic, sma: {} }))))
//     .join('\n')));
