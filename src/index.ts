import { getBinance } from './binance/binance';
import { getConfig } from './config/config';

const config = getConfig();
const binance = getBinance(config.binance);

binance.getTicks(['BTCUSDT', 'ETHUSDT'], '1m').subscribe(update => console.log(update));
