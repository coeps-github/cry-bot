import { aggregateCandleCountStatistics } from './candle-count';
import { CandleStickWrapper } from '../../binance/model';

describe('statistics - candle-count', () => {

  describe('aggregateCandleCountStatistics', () => {

    it('should start counting when only going up', () => {
      const candleSticks = [
        {
          symbol: 'A',
          tick: {
            open: '0',
            close: '1'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '3'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '3',
            close: '6'
          }
        }
      ] as CandleStickWrapper[];
      const combinations = [
        {
          up: 0, down: 0
        },
        {
          up: 1, down: 1
        },
        {
          up: 2, down: 1
        }
      ];
      const result = candleSticks.reduce((statistics, candleStick) => aggregateCandleCountStatistics(statistics, candleStick, combinations), {});
      expect(result).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0
              },
              hits: 0,
              upCount: 3,
              downCount: 0,
              currentWin: 5,
              totalWin: 5,
              maxWin: 3,
              minWin: 0,
              avgWin: 0,
              buy: false,
              sell: false
            },
            {
              combination: {
                up: 1, down: 1
              },
              hits: 0,
              upCount: 3,
              downCount: 0,
              currentWin: 5,
              totalWin: 5,
              maxWin: 3,
              minWin: 0,
              avgWin: 0,
              buy: false,
              sell: false
            },
            {
              combination: {
                up: 2, down: 1
              },
              hits: 0,
              upCount: 3,
              downCount: 0,
              currentWin: 3,
              totalWin: 3,
              maxWin: 3,
              minWin: 0,
              avgWin: 0,
              buy: false,
              sell: false
            }
          ],
          quoteStatistic: {
            totalWin: 6,
            totalTicks: 3
          }
        }
      });
    });

    it('should not start counting when only going down', () => {
      const candleSticks = [
        {
          symbol: 'A',
          tick: {
            open: '6',
            close: '3'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '3',
            close: '1'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '0'
          }
        }
      ] as CandleStickWrapper[];
      const combinations = [
        {
          up: 0, down: 0
        },
        {
          up: 1, down: 1
        },
        {
          up: 2, down: 1
        }
      ];
      const result = candleSticks.reduce((statistics, candleStick) => aggregateCandleCountStatistics(statistics, candleStick, combinations), {});
      expect(result).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0
              },
              hits: 0,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: 0,
              maxWin: 0,
              minWin: 0,
              avgWin: 0,
              buy: false,
              sell: false
            },
            {
              combination: {
                up: 1, down: 1
              },
              hits: 0,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: 0,
              maxWin: 0,
              minWin: 0,
              avgWin: 0,
              buy: false,
              sell: false
            },
            {
              combination: {
                up: 2, down: 1
              },
              hits: 0,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: 0,
              maxWin: 0,
              minWin: 0,
              avgWin: 0,
              buy: false,
              sell: false
            }
          ],
          quoteStatistic: {
            totalWin: -6,
            totalTicks: 3
          }
        }
      });
    });

    it('should start counting when going down and then up', () => {
      const candleSticks = [
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '0'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '0',
            close: '1'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '3'
          }
        }
      ] as CandleStickWrapper[];
      const combinations = [
        {
          up: 0, down: 0
        },
        {
          up: 1, down: 1
        },
        {
          up: 2, down: 1
        }
      ];
      const result = candleSticks.reduce((statistics, candleStick) => aggregateCandleCountStatistics(statistics, candleStick, combinations), {});
      expect(result).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0
              },
              hits: 0,
              upCount: 2,
              downCount: 0,
              currentWin: 2,
              totalWin: 2,
              maxWin: 2,
              minWin: 0,
              avgWin: 0,
              buy: false,
              sell: false
            },
            {
              combination: {
                up: 1, down: 1
              },
              hits: 0,
              upCount: 2,
              downCount: 0,
              currentWin: 2,
              totalWin: 2,
              maxWin: 2,
              minWin: 0,
              avgWin: 0,
              buy: false,
              sell: false
            },
            {
              combination: {
                up: 2, down: 1
              },
              hits: 0,
              upCount: 2,
              downCount: 0,
              currentWin: 0,
              totalWin: 0,
              maxWin: 0,
              minWin: 0,
              avgWin: 0,
              buy: true,
              sell: false
            }
          ],
          quoteStatistic: {
            totalWin: 2,
            totalTicks: 3
          }
        }
      });
    });

    it('should start counting when going up and then down', () => {
      const candleSticks = [
        {
          symbol: 'A',
          tick: {
            open: '0',
            close: '1'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '3'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '3',
            close: '1'
          }
        }
      ] as CandleStickWrapper[];
      const combinations = [
        {
          up: 0, down: 0
        },
        {
          up: 1, down: 1
        },
        {
          up: 2, down: 1
        }
      ];
      const result = candleSticks.reduce((statistics, candleStick) => aggregateCandleCountStatistics(statistics, candleStick, combinations), {});
      expect(result).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0
              },
              hits: 1,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: 0,
              maxWin: 2,
              minWin: -2,
              avgWin: 0,
              buy: false,
              sell: true
            },
            {
              combination: {
                up: 1, down: 1
              },
              hits: 1,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: 0,
              maxWin: 2,
              minWin: -2,
              avgWin: 0,
              buy: false,
              sell: true
            },
            {
              combination: {
                up: 2, down: 1
              },
              hits: 1,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: -2,
              maxWin: 0,
              minWin: -2,
              avgWin: -2,
              buy: false,
              sell: true
            }
          ],
          quoteStatistic: {
            totalWin: 1,
            totalTicks: 3
          }
        }
      });

    });

    it('should stop counting when going up and then down', () => {
      const candleSticks = [
        {
          symbol: 'A',
          tick: {
            open: '0',
            close: '1'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '3'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '3',
            close: '1'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '0'
          }
        }
      ] as CandleStickWrapper[];
      const combinations = [
        {
          up: 0, down: 0
        },
        {
          up: 1, down: 1
        },
        {
          up: 2, down: 1
        }
      ];
      const result = candleSticks.reduce((statistics, candleStick) => aggregateCandleCountStatistics(statistics, candleStick, combinations), {});
      expect(result).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0
              },
              hits: 1,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: 0,
              maxWin: 2,
              minWin: -2,
              avgWin: 0,
              buy: false,
              sell: false
            },
            {
              combination: {
                up: 1, down: 1
              },
              hits: 1,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: 0,
              maxWin: 2,
              minWin: -2,
              avgWin: 0,
              buy: false,
              sell: false
            },
            {
              combination: {
                up: 2, down: 1
              },
              hits: 1,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: -2,
              maxWin: 0,
              minWin: -2,
              avgWin: -2,
              buy: false,
              sell: false
            }
          ],
          quoteStatistic: {
            totalWin: 0,
            totalTicks: 4
          }
        }
      });
    });

    it('should continuously start and stop counting when going up and down multiple times', () => {
      const candleSticks = [
        {
          symbol: 'A',
          tick: {
            open: '0',
            close: '1'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '3'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '3',
            close: '1'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '0'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '0',
            close: '1'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '3'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '3',
            close: '6'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '6',
            close: '3'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '3',
            close: '1'
          }
        }
      ] as CandleStickWrapper[];
      const combinations = [
        {
          up: 0, down: 0
        },
        {
          up: 1, down: 1
        },
        {
          up: 2, down: 1
        }
      ];
      const result = candleSticks.reduce((statistics, candleStick) => aggregateCandleCountStatistics(statistics, candleStick, combinations), {});
      expect(result).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0
              },
              hits: 2,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: 2,
              maxWin: 3,
              minWin: -3,
              avgWin: 1,
              buy: false,
              sell: false
            },
            {
              combination: {
                up: 1, down: 1
              },
              hits: 2,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: 2,
              maxWin: 3,
              minWin: -3,
              avgWin: 1,
              buy: false,
              sell: false
            },
            {
              combination: {
                up: 2, down: 1
              },
              hits: 2,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: -2,
              maxWin: 3,
              minWin: -3,
              avgWin: -1,
              buy: false,
              sell: false
            }
          ],
          quoteStatistic: {
            totalWin: 1,
            totalTicks: 9
          }
        }
      });
    });

    it('should continuously start and stop counting when going up and down multiple times and have counts when stopping going up', () => {
      const candleSticks = [
        {
          symbol: 'A',
          tick: {
            open: '0',
            close: '1'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '3'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '3',
            close: '1'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '0'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '0',
            close: '1'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '3'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '3',
            close: '6'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '6',
            close: '3'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '3',
            close: '1'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '1',
            close: '3'
          }
        },
        {
          symbol: 'A',
          tick: {
            open: '3',
            close: '6'
          }
        }
      ] as CandleStickWrapper[];
      const combinations = [
        {
          up: 0, down: 0
        },
        {
          up: 1, down: 1
        },
        {
          up: 2, down: 1
        }
      ];
      const result = candleSticks.reduce((statistics, candleStick) => aggregateCandleCountStatistics(statistics, candleStick, combinations), {});
      expect(result).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0
              },
              hits: 2,
              upCount: 2,
              downCount: 0,
              currentWin: 3,
              totalWin: 5,
              maxWin: 3,
              minWin: -3,
              avgWin: 2.5,
              buy: false,
              sell: false
            },
            {
              combination: {
                up: 1, down: 1
              },
              hits: 2,
              upCount: 2,
              downCount: 0,
              currentWin: 3,
              totalWin: 5,
              maxWin: 3,
              minWin: -3,
              avgWin: 2.5,
              buy: false,
              sell: false
            },
            {
              combination: {
                up: 2, down: 1
              },
              hits: 2,
              upCount: 2,
              downCount: 0,
              currentWin: 0,
              totalWin: -2,
              maxWin: 3,
              minWin: -3,
              avgWin: -1,
              buy: true,
              sell: false
            }
          ],
          quoteStatistic: {
            totalWin: 6,
            totalTicks: 11
          }
        }
      });
    });

  });

});
