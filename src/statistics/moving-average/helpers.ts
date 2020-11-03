import { MovingAverageStatistic, MovingAverageStatistics } from './model';

export function buy(prevMovingAverageStatistic: MovingAverageStatistic): boolean {
  return prevMovingAverageStatistic.smallSMA.isStable && prevMovingAverageStatistic.bigSMA.isStable &&
    prevMovingAverageStatistic.smallSMA.getResult().gte(prevMovingAverageStatistic.bigSMA.getResult());
}

export function sell(prevMovingAverageStatistic: MovingAverageStatistic): boolean {
  return prevMovingAverageStatistic.smallSMA.isStable && prevMovingAverageStatistic.bigSMA.isStable &&
    prevMovingAverageStatistic.smallSMA.getResult().lt(prevMovingAverageStatistic.bigSMA.getResult());
}

export function convertSmaToObject(movingAverageStatistics: MovingAverageStatistics): MovingAverageStatistics {
  return Object.keys(movingAverageStatistics).reduce((mass, key) => {
    return {
      ...mass,
      [key]: movingAverageStatistics[key].map(mas => ({
        ...mas,
        smallSMA: {
          ...mas.smallSMA,
          prices: (mas.smallSMA as any).prices.map((price: any) => price.toString()),
          result: mas.smallSMA.isStable && mas.smallSMA.getResult().valueOf()
        },
        bigSMA: {
          ...mas.bigSMA,
          prices: (mas.bigSMA as any).prices.map((price: any) => price.toString()),
          result: mas.bigSMA.isStable && mas.bigSMA.getResult().valueOf()
        }
      }))
    };
  }, {});
}
