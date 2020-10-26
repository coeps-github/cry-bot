import { getBinance } from './binance/binance';
import { getConfig } from './config/config';

const config = getConfig();
const binance = getBinance(config.binance);

binance.getCandleSticks((update) => {
  console.log(update);
});
