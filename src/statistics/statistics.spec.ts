import { getStatistics } from './statistics';
import { Binance } from '../binance/model';
import { from } from 'rxjs';
import { skip } from 'rxjs/operators';

describe('statistics', () => {

  describe('analyzeCandles', () => {

    it('should start counting when only going up', (done) => {
      const statistics = getStatistics({
        getTicks: () => from([
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
        ])
      } as Binance);
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
      statistics.analyzeCandles(undefined, undefined, combinations).pipe(skip(2)).subscribe(result => {
        expect(result).toEqual({
          A: [
            {
              combination: {
                up: 0, down: 0
              },
              downCount: 0,
              hits: 0,
              upCount: 3,
              win: 5
            },
            {
              combination: {
                up: 1, down: 1
              },
              downCount: 0,
              hits: 0,
              upCount: 3,
              win: 5
            },
            {
              combination: {
                up: 2, down: 1
              },
              downCount: 0,
              hits: 0,
              upCount: 3,
              win: 3
            }
          ]
        });
        done();
      });
    });

    it('should not start counting when only going down', (done) => {
      const statistics = getStatistics({
        getTicks: () => from([
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
        ])
      } as Binance);
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
      statistics.analyzeCandles(undefined, undefined, combinations).pipe(skip(2)).subscribe(result => {
        expect(result).toEqual({
          A: [
            {
              combination: {
                up: 0, down: 0
              },
              downCount: 0,
              hits: 0,
              upCount: 0,
              win: 0
            },
            {
              combination: {
                up: 1, down: 1
              },
              downCount: 0,
              hits: 0,
              upCount: 0,
              win: 0
            },
            {
              combination: {
                up: 2, down: 1
              },
              downCount: 0,
              hits: 0,
              upCount: 0,
              win: 0
            }
          ]
        });
        done();
      });
    });

    it('should start counting when going down and then up', (done) => {
      const statistics = getStatistics({
        getTicks: () => from([
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
        ])
      } as Binance);
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
      statistics.analyzeCandles(undefined, undefined, combinations).pipe(skip(2)).subscribe(result => {
        expect(result).toEqual({
          A: [
            {
              combination: {
                up: 0, down: 0
              },
              downCount: 0,
              hits: 0,
              upCount: 2,
              win: 2
            },
            {
              combination: {
                up: 1, down: 1
              },
              downCount: 0,
              hits: 0,
              upCount: 2,
              win: 2
            },
            {
              combination: {
                up: 2, down: 1
              },
              downCount: 0,
              hits: 0,
              upCount: 2,
              win: 0
            }
          ]
        });
        done();
      });
    });

    it('should stop counting when going up and then down', (done) => {
      const statistics = getStatistics({
        getTicks: () => from([
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
        ])
      } as Binance);
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
      statistics.analyzeCandles(undefined, undefined, combinations).pipe(skip(2)).subscribe(result => {
        expect(result).toEqual({
          A: [
            {
              combination: {
                up: 0, down: 0
              },
              downCount: 1,
              hits: 1,
              upCount: 2,
              win: 0
            },
            {
              combination: {
                up: 1, down: 1
              },
              downCount: 1,
              hits: 1,
              upCount: 2,
              win: 0
            },
            {
              combination: {
                up: 2, down: 1
              },
              downCount: 1,
              hits: 1,
              upCount: 2,
              win: -2
            }
          ]
        });
        done();
      });
    });

  });

});
