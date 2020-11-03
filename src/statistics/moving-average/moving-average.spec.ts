import { TickExtended } from '../../binance/model';
import { aggregateMovingAverageStatistics } from './moving-average';
import { convertSmaToObject } from './helpers';

describe('statistics - moving-average', () => {

  describe('aggregateMovingAverageStatistics', () => {

    it('should start counting when only going up', () => {
      const ticks = [
        {
          symbol: 'A',
          open: '0',
          close: '1'
        },
        {
          symbol: 'A',
          open: '1',
          close: '3'
        },
        {
          symbol: 'A',
          open: '3',
          close: '6'
        },
        {
          symbol: 'A',
          open: '6',
          close: '10'
        }
      ] as TickExtended[];
      const combinations = [
        {
          small: 1, big: 2
        },
        {
          small: 2, big: 3
        },
        {
          small: 3, big: 4
        }
      ];
      const result = ticks.reduce((statistics, tick) => aggregateMovingAverageStatistics(statistics, tick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: [
          {
            combination: {
              small: 1, big: 2
            },
            hits: 0,
            currentWin: 7,
            totalWin: 7,
            maxWin: 4,
            minWin: 0,
            avgWin: 0,
            smallSMA: {
              interval: 1,
              prices: [
                '10'
              ],
              result: '10'
            },
            bigSMA: {
              interval: 2,
              prices: [
                '6',
                '10'
              ],
              result: '8'
            }
          },
          {
            combination: {
              small: 2, big: 3
            },
            hits: 0,
            currentWin: 4,
            totalWin: 4,
            maxWin: 4,
            minWin: 0,
            avgWin: 0,
            smallSMA: {
              interval: 2,
              prices: [
                '6',
                '10'
              ],
              result: '8'
            },
            bigSMA: {
              interval: 3,
              prices: [
                '3',
                '6',
                '10'
              ],
              result: '6.33333333333333333333'
            }
          },
          {
            combination: {
              small: 3, big: 4
            },
            hits: 0,
            currentWin: 0,
            totalWin: 0,
            maxWin: 0,
            minWin: 0,
            avgWin: 0,
            smallSMA: {
              interval: 3,
              prices: [
                '3',
                '6',
                '10'
              ],
              result: '6.33333333333333333333'
            },
            bigSMA: {
              interval: 4,
              prices: [
                '1',
                '3',
                '6',
                '10'
              ],
              result: '5'
            }
          }
        ]
      });
    });

    it('should not start counting when only going down', () => {
      const ticks = [
        {
          symbol: 'A',
          open: '10',
          close: '6'
        },
        {
          symbol: 'A',
          open: '6',
          close: '3'
        },
        {
          symbol: 'A',
          open: '3',
          close: '1'
        },
        {
          symbol: 'A',
          open: '1',
          close: '0'
        }
      ] as TickExtended[];
      const combinations = [
        {
          small: 1, big: 2
        },
        {
          small: 2, big: 3
        },
        {
          small: 3, big: 4
        }
      ];
      const result = ticks.reduce((statistics, tick) => aggregateMovingAverageStatistics(statistics, tick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: [
          {
            combination: {
              small: 1, big: 2
            },
            hits: 0,
            currentWin: 0,
            totalWin: 0,
            maxWin: 0,
            minWin: 0,
            avgWin: 0,
            smallSMA: {
              interval: 1,
              prices: [
                '0'
              ],
              result: '0'
            },
            bigSMA: {
              interval: 2,
              prices: [
                '1',
                '0'
              ],
              result: '0.5'
            }
          },
          {
            combination: {
              small: 2, big: 3
            },
            hits: 0,
            currentWin: 0,
            totalWin: 0,
            maxWin: 0,
            minWin: 0,
            avgWin: 0,
            smallSMA: {
              interval: 2,
              prices: [
                '1',
                '0'
              ],
              result: '0.5'
            },
            bigSMA: {
              interval: 3,
              prices: [
                '3',
                '1',
                '0'
              ],
              result: '1.33333333333333333333'
            }
          },
          {
            combination: {
              small: 3, big: 4
            },
            hits: 0,
            currentWin: 0,
            totalWin: 0,
            maxWin: 0,
            minWin: 0,
            avgWin: 0,
            smallSMA: {
              interval: 3,
              prices: [
                '3',
                '1',
                '0'
              ],
              result: '1.33333333333333333333'
            },
            bigSMA: {
              interval: 4,
              prices: [
                '6',
                '3',
                '1',
                '0'
              ],
              result: '2.5'
            }
          }
        ]
      });
    });

    it('should start counting when going down and then up', () => {
      const ticks = [
        {
          symbol: 'A',
          open: '10',
          close: '6'
        },
        {
          symbol: 'A',
          open: '6',
          close: '3'
        },
        {
          symbol: 'A',
          open: '3',
          close: '1'
        },
        {
          symbol: 'A',
          open: '1',
          close: '0'
        },
        {
          symbol: 'A',
          open: '0',
          close: '1'
        },
        {
          symbol: 'A',
          open: '1',
          close: '3'
        },
        {
          symbol: 'A',
          open: '3',
          close: '6'
        },
        {
          symbol: 'A',
          open: '6',
          close: '10'
        }
      ] as TickExtended[];
      const combinations = [
        {
          small: 1, big: 2
        },
        {
          small: 2, big: 3
        },
        {
          small: 3, big: 4
        }
      ];
      const result = ticks.reduce((statistics, tick) => aggregateMovingAverageStatistics(statistics, tick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: [
          {
            combination: {
              small: 1, big: 2
            },
            hits: 0,
            currentWin: 9,
            totalWin: 9,
            maxWin: 4,
            minWin: 0,
            avgWin: 0,
            smallSMA: {
              interval: 1,
              prices: [
                '10'
              ],
              result: '10'
            },
            bigSMA: {
              interval: 2,
              prices: [
                '6',
                '10'
              ],
              result: '8'
            }
          },
          {
            combination: {
              small: 2, big: 3
            },
            hits: 0,
            currentWin: 7,
            totalWin: 7,
            maxWin: 4,
            minWin: 0,
            avgWin: 0,
            smallSMA: {
              interval: 2,
              prices: [
                '6',
                '10'
              ],
              result: '8'
            },
            bigSMA: {
              interval: 3,
              prices: [
                '3',
                '6',
                '10'
              ],
              result: '6.33333333333333333333'
            }
          },
          {
            combination: {
              small: 3, big: 4
            },
            hits: 0,
            currentWin: 7,
            totalWin: 7,
            maxWin: 4,
            minWin: 0,
            avgWin: 0,
            smallSMA: {
              interval: 3,
              prices: [
                '3',
                '6',
                '10'
              ],
              result: '6.33333333333333333333'
            },
            bigSMA: {
              interval: 4,
              prices: [
                '1',
                '3',
                '6',
                '10'
              ],
              result: '5'
            }
          }
        ]
      });
    });

    it('should start counting when going up and then down', () => {
      const ticks = [
        {
          symbol: 'A',
          open: '0',
          close: '1'
        },
        {
          symbol: 'A',
          open: '1',
          close: '3'
        },
        {
          symbol: 'A',
          open: '3',
          close: '6'
        },
        {
          symbol: 'A',
          open: '6',
          close: '10'
        },
        {
          symbol: 'A',
          open: '10',
          close: '6'
        },
        {
          symbol: 'A',
          open: '6',
          close: '3'
        },
        {
          symbol: 'A',
          open: '3',
          close: '1'
        },
        {
          symbol: 'A',
          open: '1',
          close: '0'
        }
      ] as TickExtended[];
      const combinations = [
        {
          small: 1, big: 2
        },
        {
          small: 2, big: 3
        },
        {
          small: 3, big: 4
        }
      ];
      const result = ticks.reduce((statistics, tick) => aggregateMovingAverageStatistics(statistics, tick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: [
          {
            combination: {
              small: 1, big: 2
            },
            hits: 1,
            currentWin: 0,
            totalWin: 3,
            maxWin: 4,
            minWin: -4,
            avgWin: 3,
            smallSMA: {
              interval: 1,
              prices: [
                '0'
              ],
              result: '0'
            },
            bigSMA: {
              interval: 2,
              prices: [
                '1',
                '0'
              ],
              result: '0.5'
            }
          },
          {
            combination: {
              small: 2, big: 3
            },
            hits: 1,
            currentWin: 0,
            totalWin: -3,
            maxWin: 4,
            minWin: -4,
            avgWin: -3,
            smallSMA: {
              interval: 2,
              prices: [
                '1',
                '0'
              ],
              result: '0.5'
            },
            bigSMA: {
              interval: 3,
              prices: [
                '3',
                '1',
                '0'
              ],
              result: '1.33333333333333333333'
            }
          },
          {
            combination: {
              small: 3, big: 4
            },
            hits: 1,
            currentWin: 0,
            totalWin: -9,
            maxWin: 0,
            minWin: -4,
            avgWin: -9,
            smallSMA: {
              interval: 3,
              prices: [
                '3',
                '1',
                '0'
              ],
              result: '1.33333333333333333333'
            },
            bigSMA: {
              interval: 4,
              prices: [
                '6',
                '3',
                '1',
                '0'
              ],
              result: '2.5'
            }
          }
        ]
      });
    });

  });

});
