import { Candles } from 'src/app/stocks/store';
import { Am5Candle } from '../components/charts/candle-chart/candle-chart.component';
import { Am5Point } from '../components/charts/line-chart/line-chart.component';

export const serializeCandles = (data: Candles): Am5Candle[] => {
  const candles: Am5Candle[] = [];
  for (let i = 0; i < data.time.length; i++) {
    candles.push({
      open: data.open[i],
      close: data.close[i],
      high: data.high[i],
      low: data.low[i],
      date: data.time[i].getTime(),
    });
  }

  return candles;
};

export const serializePoints = (data: Candles): Am5Point[] => {
  const points: Am5Point[] = [];
  for (let i = 0; i < data.time.length; i++) {
    points.push({
      date: data.time[i].getTime(),
      value: data.close[i],
    });
  }

  return points;
};
