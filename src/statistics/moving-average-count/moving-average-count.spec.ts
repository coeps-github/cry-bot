import { aggregateMovingAverageCountStatistics } from './moving-average-count';
import { convertSmaToObject } from './helpers';
import { CandleStickWrapper } from '../../binance/model';

describe('statistics - moving-average-count', () => {

  describe('aggregateMovingAverageCountStatistics', () => {

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
        },
        {
          symbol: 'A',
          tick: {
            open: '6',
            close: '10'
          }
        }
      ] as CandleStickWrapper[];
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
      const result = candleSticks.reduce((statistics, candleStick) => aggregateMovingAverageCountStatistics(statistics, candleStick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0, sma: 2
              },
              hits: 0,
              upCount: 2,
              downCount: 0,
              currentWin: 4,
              totalWin: 4,
              maxWin: 4,
              minWin: 0,
              avgWin: 0,
              buy: false,
              sell: false,
              sma: {
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
                up: 1, down: 1, sma: 2
              },
              hits: 0,
              upCount: 2,
              downCount: 0,
              currentWin: 4,
              totalWin: 4,
              maxWin: 4,
              minWin: 0,
              avgWin: 0,
              buy: false,
              sell: false,
              sma: {
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
                up: 2, down: 1, sma: 2
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
              sell: false,
              sma: {
                interval: 2,
                prices: [
                  '6',
                  '10'
                ],
                result: '8'
              }
            }
          ],
          quoteStatistic: {
            totalWin: 10,
            totalTicks: 4
          }
        }
      });
    });

    it('should not start counting when only going down', () => {
      const candleSticks = [
        {
          symbol: 'A',
          tick: {
            open: '10',
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
            close: '0'
          }
        }
      ] as CandleStickWrapper[];
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
      const result = candleSticks.reduce((statistics, candleStick) => aggregateMovingAverageCountStatistics(statistics, candleStick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0, sma: 2
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
              sell: false,
              sma: {
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
                up: 1, down: 1, sma: 2
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
              sell: false,
              sma: {
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
                up: 2, down: 1, sma: 2
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
              sell: false,
              sma: {
                interval: 2,
                prices: [
                  '1',
                  '0'
                ],
                result: '0.5'
              }
            }
          ],
          quoteStatistic: {
            totalWin: -10,
            totalTicks: 4
          }
        }
      });
    });

    it('should start counting when going down and then up', () => {
      const candleSticks = [
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
        }
      ] as CandleStickWrapper[];
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
      const result = candleSticks.reduce((statistics, candleStick) => aggregateMovingAverageCountStatistics(statistics, candleStick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0, sma: 2
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
              sell: false,
              sma: {
                interval: 2,
                prices: [
                  '1',
                  '3'
                ],
                result: '2'
              }
            },
            {
              combination: {
                up: 1, down: 1, sma: 2
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
              sell: false,
              sma: {
                interval: 2,
                prices: [
                  '1',
                  '3'
                ],
                result: '2'
              }
            },
            {
              combination: {
                up: 2, down: 1, sma: 2
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
              sell: false,
              sma: {
                interval: 2,
                prices: [
                  '1',
                  '3'
                ],
                result: '2'
              }
            }
          ],
          quoteStatistic: {
            totalWin: 0,
            totalTicks: 4
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
          up: 0, down: 0, sma: 2
        },
        {
          up: 1, down: 1, sma: 2
        },
        {
          up: 2, down: 1, sma: 2
        }
      ];
      const result = candleSticks.reduce((statistics, candleStick) => aggregateMovingAverageCountStatistics(statistics, candleStick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0, sma: 2
              },
              hits: 1,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: -1,
              maxWin: 0,
              minWin: -1,
              avgWin: -1,
              buy: false,
              sell: true,
              sma: {
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
                up: 1, down: 1, sma: 2
              },
              hits: 1,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: -1,
              maxWin: 0,
              minWin: -1,
              avgWin: -1,
              buy: false,
              sell: true,
              sma: {
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
                up: 2, down: 1, sma: 2
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
              sell: false,
              sma: {
                interval: 2,
                prices: [
                  '1',
                  '0'
                ],
                result: '0.5'
              }
            }
          ],
          quoteStatistic: {
            totalWin: 0,
            totalTicks: 4
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
            close: '0'
          }
        }
      ] as CandleStickWrapper[];
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
      const result = candleSticks.reduce((statistics, candleStick) => aggregateMovingAverageCountStatistics(statistics, candleStick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0, sma: 2
              },
              hits: 1,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: -5,
              maxWin: 0,
              minWin: -3,
              avgWin: -5,
              buy: false,
              sell: false,
              sma: {
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
                up: 1, down: 1, sma: 2
              },
              hits: 1,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: -5,
              maxWin: 0,
              minWin: -3,
              avgWin: -5,
              buy: false,
              sell: false,
              sma: {
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
                up: 2, down: 1, sma: 2
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
              sell: false,
              sma: {
                interval: 2,
                prices: [
                  '1',
                  '0'
                ],
                result: '0.5'
              }
            }
          ],
          quoteStatistic: {
            totalWin: 0,
            totalTicks: 6
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
          up: 0, down: 0, sma: 2
        },
        {
          up: 1, down: 1, sma: 2
        },
        {
          up: 2, down: 1, sma: 2
        }
      ];
      const result = candleSticks.reduce((statistics, candleStick) => aggregateMovingAverageCountStatistics(statistics, candleStick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0, sma: 2
              },
              hits: 2,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: -1,
              maxWin: 3,
              minWin: -3,
              avgWin: -0.5,
              buy: false,
              sell: false,
              sma: {
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
                up: 1, down: 1, sma: 2
              },
              hits: 2,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: -1,
              maxWin: 3,
              minWin: -3,
              avgWin: -0.5,
              buy: false,
              sell: false,
              sma: {
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
                up: 2, down: 1, sma: 2
              },
              hits: 1,
              upCount: 0,
              downCount: 0,
              currentWin: 0,
              totalWin: -2,
              maxWin: 3,
              minWin: -3,
              avgWin: -2,
              buy: false,
              sell: false,
              sma: {
                interval: 2,
                prices: [
                  '1',
                  '0'
                ],
                result: '0.5'
              }
            }
          ],
          quoteStatistic: {
            totalWin: 0,
            totalTicks: 10
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
        },
        {
          symbol: 'A',
          tick: {
            open: '6',
            close: '10'
          }
        }
      ] as CandleStickWrapper[];
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
      const result = candleSticks.reduce((statistics, candleStick) => aggregateMovingAverageCountStatistics(statistics, candleStick, combinations), {});
      expect(convertSmaToObject(result)).toEqual({
        A: {
          statistics: [
            {
              combination: {
                up: 0, down: 0, sma: 2
              },
              hits: 2,
              upCount: 3,
              downCount: 0,
              currentWin: 7,
              totalWin: 6,
              maxWin: 4,
              minWin: -3,
              avgWin: 3,
              buy: false,
              sell: false,
              sma: {
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
                up: 1, down: 1, sma: 2
              },
              hits: 2,
              upCount: 3,
              downCount: 0,
              currentWin: 7,
              totalWin: 6,
              maxWin: 4,
              minWin: -3,
              avgWin: 3,
              buy: false,
              sell: false,
              sma: {
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
                up: 2, down: 1, sma: 2
              },
              hits: 1,
              upCount: 3,
              downCount: 0,
              currentWin: 4,
              totalWin: 2,
              maxWin: 4,
              minWin: -3,
              avgWin: 2,
              buy: false,
              sell: false,
              sma: {
                interval: 2,
                prices: [
                  '6',
                  '10'
                ],
                result: '8'
              }
            }
          ],
          quoteStatistic: {
            totalWin: 10,
            totalTicks: 12
          }
        }
      });
    });

  });

});
