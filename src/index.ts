import { getBinance } from './binance/binance';
import { getConfig } from './config/config';

const config = getConfig();
const binance = getBinance(config.binance);

binance.getCandleSticks().subscribe((update) => {
  console.log(update);
});

binance.getCandleSticks().subscribe((update) => {
  console.log(update);
});
