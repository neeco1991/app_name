import { Candles } from 'src/app/stocks/store';
import { Am5Candle } from '../components/charts/candle-chart/candle-chart.component';

export const serialize = (data: Candles): Am5Candle[] => {
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
