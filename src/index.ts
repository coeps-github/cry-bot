import { getBinance } from './binance/binance';
import { getConfig } from './config/config';

const config = getConfig();
const binance = getBinance(config.binance);

binance.getCandleSticks().subscribe((update) => {
  console.log(`CandleSticks: ${JSON.stringify(update)}`);
});

binance.getChart().subscribe((update) => {
  console.log(`Chart: ${JSON.stringify(update)}`);
});
