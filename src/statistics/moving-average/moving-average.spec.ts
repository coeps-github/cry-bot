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
        }
      ] as TickExtended[];
      const combinations = [
        {
          up: 0, down: 0, sma: 2
        },
        {
          up: 1, down: 1, sma: 2
        },
        {
          up: 2, down: 1, sma: 2
        }
      ];
      const result = ticks.reduce((statistics, tick) => aggregateMovingAverageStatistics(statistics, tick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: [
          {
            combination: {
              up: 0, down: 0
            },
            downCount: 0,
            hits: 0,
            upCount: 3,
            currentWin: 5,
            totalWin: 5,
            maxWin: 3,
            minWin: 0,
            avgWin: 0
          },
          {
            combination: {
              up: 1, down: 1
            },
            downCount: 0,
            hits: 0,
            upCount: 3,
            currentWin: 5,
            totalWin: 5,
            maxWin: 3,
            minWin: 0,
            avgWin: 0
          },
          {
            combination: {
              up: 2, down: 1
            },
            downCount: 0,
            hits: 0,
            upCount: 3,
            currentWin: 3,
            totalWin: 3,
            maxWin: 3,
            minWin: 0,
            avgWin: 0
          }
        ]
      });
    });

    it('should not start counting when only going down', () => {
      const ticks = [
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
          up: 0, down: 0, sma: 2
        },
        {
          up: 1, down: 1, sma: 2
        },
        {
          up: 2, down: 1, sma: 2
        }
      ];
      const result = ticks.reduce((statistics, tick) => aggregateMovingAverageStatistics(statistics, tick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: [
          {
            combination: {
              up: 0, down: 0
            },
            downCount: 0,
            hits: 0,
            upCount: 0,
            currentWin: 0,
            totalWin: 0,
            maxWin: 0,
            minWin: 0,
            avgWin: 0
          },
          {
            combination: {
              up: 1, down: 1
            },
            downCount: 0,
            hits: 0,
            upCount: 0,
            currentWin: 0,
            totalWin: 0,
            maxWin: 0,
            minWin: 0,
            avgWin: 0
          },
          {
            combination: {
              up: 2, down: 1
            },
            downCount: 0,
            hits: 0,
            upCount: 0,
            currentWin: 0,
            totalWin: 0,
            maxWin: 0,
            minWin: 0,
            avgWin: 0
          }
        ]
      });
    });

    it('should start counting when going down and then up', () => {
      const ticks = [
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
        }
      ] as TickExtended[];
      const combinations = [
        {
          up: 0, down: 0, sma: 2
        },
        {
          up: 1, down: 1, sma: 2
        },
        {
          up: 2, down: 1, sma: 2
        }
      ];
      const result = ticks.reduce((statistics, tick) => aggregateMovingAverageStatistics(statistics, tick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: [
          {
            combination: {
              up: 0, down: 0
            },
            downCount: 0,
            hits: 0,
            upCount: 2,
            currentWin: 2,
            totalWin: 2,
            maxWin: 2,
            minWin: 0,
            avgWin: 0
          },
          {
            combination: {
              up: 1, down: 1
            },
            downCount: 0,
            hits: 0,
            upCount: 2,
            currentWin: 2,
            totalWin: 2,
            maxWin: 2,
            minWin: 0,
            avgWin: 0
          },
          {
            combination: {
              up: 2, down: 1
            },
            downCount: 0,
            hits: 0,
            upCount: 2,
            currentWin: 0,
            totalWin: 0,
            maxWin: 0,
            minWin: 0,
            avgWin: 0
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
          close: '1'
        }
      ] as TickExtended[];
      const combinations = [
        {
          up: 0, down: 0, sma: 2
        },
        {
          up: 1, down: 1, sma: 2
        },
        {
          up: 2, down: 1, sma: 2
        }
      ];
      const result = ticks.reduce((statistics, tick) => aggregateMovingAverageStatistics(statistics, tick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: [
          {
            combination: {
              up: 0, down: 0
            },
            downCount: 0,
            hits: 1,
            upCount: 0,
            currentWin: 0,
            totalWin: 0,
            maxWin: 2,
            minWin: -2,
            avgWin: 0
          },
          {
            combination: {
              up: 1, down: 1
            },
            downCount: 0,
            hits: 1,
            upCount: 0,
            currentWin: 0,
            totalWin: 0,
            maxWin: 2,
            minWin: -2,
            avgWin: 0
          },
          {
            combination: {
              up: 2, down: 1
            },
            downCount: 0,
            hits: 1,
            upCount: 0,
            currentWin: 0,
            totalWin: -2,
            maxWin: 0,
            minWin: -2,
            avgWin: -2
          }
        ]
      });

    });

    it('should stop counting when going up and then down', () => {
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
          up: 0, down: 0, sma: 2
        },
        {
          up: 1, down: 1, sma: 2
        },
        {
          up: 2, down: 1, sma: 2
        }
      ];
      const result = ticks.reduce((statistics, tick) => aggregateMovingAverageStatistics(statistics, tick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: [
          {
            combination: {
              up: 0, down: 0
            },
            downCount: 0,
            hits: 1,
            upCount: 0,
            currentWin: 0,
            totalWin: 0,
            maxWin: 2,
            minWin: -2,
            avgWin: 0
          },
          {
            combination: {
              up: 1, down: 1
            },
            downCount: 0,
            hits: 1,
            upCount: 0,
            currentWin: 0,
            totalWin: 0,
            maxWin: 2,
            minWin: -2,
            avgWin: 0
          },
          {
            combination: {
              up: 2, down: 1
            },
            downCount: 0,
            hits: 1,
            upCount: 0,
            currentWin: 0,
            totalWin: -2,
            maxWin: 0,
            minWin: -2,
            avgWin: -2
          }
        ]
      });
    });

    it('should continuously start and stop counting when going up and down multiple times', () => {
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
          close: '3'
        },
        {
          symbol: 'A',
          open: '3',
          close: '1'
        }
      ] as TickExtended[];
      const combinations = [
        {
          up: 0, down: 0, sma: 2
        },
        {
          up: 1, down: 1, sma: 2
        },
        {
          up: 2, down: 1, sma: 2
        }
      ];
      const result = ticks.reduce((statistics, tick) => aggregateMovingAverageStatistics(statistics, tick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: [
          {
            combination: {
              up: 0, down: 0
            },
            downCount: 0,
            hits: 2,
            upCount: 0,
            currentWin: 0,
            totalWin: 2,
            maxWin: 3,
            minWin: -3,
            avgWin: 1
          },
          {
            combination: {
              up: 1, down: 1
            },
            downCount: 0,
            hits: 2,
            upCount: 0,
            currentWin: 0,
            totalWin: 2,
            maxWin: 3,
            minWin: -3,
            avgWin: 1
          },
          {
            combination: {
              up: 2, down: 1
            },
            downCount: 0,
            hits: 2,
            upCount: 0,
            currentWin: 0,
            totalWin: -2,
            maxWin: 3,
            minWin: -3,
            avgWin: -1
          }
        ]
      });
    });

    it('should continuously start and stop counting when going up and down multiple times and have counts when stopping going up', () => {
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
          close: '3'
        },
        {
          symbol: 'A',
          open: '3',
          close: '6'
        }
      ] as TickExtended[];
      const combinations = [
        {
          up: 0, down: 0, sma: 2
        },
        {
          up: 1, down: 1, sma: 2
        },
        {
          up: 2, down: 1, sma: 2
        }
      ];
      const result = ticks.reduce((statistics, tick) => aggregateMovingAverageStatistics(statistics, tick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: [
          {
            combination: {
              up: 0, down: 0
            },
            downCount: 0,
            hits: 2,
            upCount: 2,
            currentWin: 3,
            totalWin: 5,
            maxWin: 3,
            minWin: -3,
            avgWin: 2.5
          },
          {
            combination: {
              up: 1, down: 1
            },
            downCount: 0,
            hits: 2,
            upCount: 2,
            currentWin: 3,
            totalWin: 5,
            maxWin: 3,
            minWin: -3,
            avgWin: 2.5
          },
          {
            combination: {
              up: 2, down: 1
            },
            downCount: 0,
            hits: 2,
            upCount: 2,
            currentWin: 0,
            totalWin: -2,
            maxWin: 3,
            minWin: -3,
            avgWin: -1
          }
        ]
      });
    });

  });

});
