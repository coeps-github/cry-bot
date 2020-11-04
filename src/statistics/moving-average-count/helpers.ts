import { MovingAverageCountStatistic, MovingAverageCountStatisticsMap } from './model';
import { Tick } from '../../binance/model';

export function updateSmaAndReturnIsUp(tick: Tick, prevMovingAverageStatistic: MovingAverageCountStatistic): boolean {
  const sma = prevMovingAverageStatistic.sma;
  const prevValue = sma.isStable && sma.getResult();
  sma.update(tick.close);
  const currValue = sma.isStable && sma.getResult();
  return prevValue && currValue && currValue.gte(prevValue);
}

export function convertSmaToObject(movingAverageStatistics: MovingAverageCountStatisticsMap): MovingAverageCountStatisticsMap {
  return Object.keys(movingAverageStatistics).reduce((mass, key) => {
    return {
      ...mass,
      [key]: movingAverageStatistics[key].map(mas => ({
        ...mas,
        sma: {
          ...mas.sma,
          prices: (mas.sma as any).prices.map((price: any) => price.toString()),
          result: mas.sma.isStable && mas.sma.getResult().valueOf()
        }
      }))
    };
  }, {});
}
