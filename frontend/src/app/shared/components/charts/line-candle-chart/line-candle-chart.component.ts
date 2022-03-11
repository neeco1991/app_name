import { Component, Input } from '@angular/core';
import {
  serializeCandles,
  serializePoints,
} from 'src/app/shared/serializers/amc5.serializer';
import { Candles } from 'src/app/stocks/store';
import { Am5Candle } from '../candle-chart/candle-chart.component';
import { Am5Point } from '../line-chart/line-chart.component';
import { Period } from '../period-selector/period-selector.component';

type GraphType = 'candle' | 'line';

@Component({
  selector: 'app-line-candle-chart',
  templateUrl: './line-candle-chart.component.html',
  styleUrls: ['./line-candle-chart.component.scss'],
})
export class LineCandleChartComponent {
  @Input() data: Candles;

  period: Period = '1y';
  graphType: GraphType = 'line';

  onSetPeriod(period: Period) {
    console.log(period);
    this.period = period;
  }

  setGraphType(graphType: GraphType) {
    this.graphType = graphType;
  }

  getCandles(): Am5Candle[] {
    return serializeCandles(this.data);
  }

  getPoints(): Am5Point[] {
    return serializePoints(this.data);
  }

  filterWIthPeriod(data: Am5Candle[] | Am5Point[]): Am5Candle[] | Am5Point[] {
    if (this.period === 'all') {
      return data;
    }
    const startDate = new Date();
    if (this.period === 'ytd') {
      startDate.setMonth(0);
      startDate.setDate(1);
    } else if (this.period.endsWith('y')) {
      const numberOfYears = +this.period[0];
      startDate.setFullYear(startDate.getFullYear() - numberOfYears);
    } else if (this.period.endsWith('m')) {
      const numberOfMonths = +this.period[0];
      const year =
        startDate.getMonth() - numberOfMonths >= 0
          ? startDate.getFullYear()
          : startDate.getFullYear() - 1;
      startDate.setMonth(startDate.getMonth() - numberOfMonths);
      startDate.setFullYear(year);
    } else if (this.period.endsWith('w')) {
      startDate.setDate(startDate.getDate() - 7);
    }

    let lastValueIndex = data.length;
    while (
      data[lastValueIndex - 1].date > startDate.getTime() &&
      lastValueIndex > 1
    )
      lastValueIndex--;

    return data.slice(lastValueIndex);
  }
}
