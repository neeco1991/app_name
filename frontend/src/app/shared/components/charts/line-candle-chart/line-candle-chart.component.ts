import { Component, Input } from '@angular/core';
import { Am5Candle } from '../candle-chart/candle-chart.component';

type Period = '1w' | '1m' | '3m' | '6m' | '1y' | '3y' | '5y' | 'ytd' | 'all';
type GraphType = 'candle' | 'line';

@Component({
  selector: 'app-line-candle-chart',
  templateUrl: './line-candle-chart.component.html',
  styleUrls: ['./line-candle-chart.component.scss'],
})
export class LineCandleChartComponent {
  @Input() data: Am5Candle[];

  period: Period = '1y';
  graphType: GraphType = 'candle';

  setPeriod(period: Period) {
    this.period = period;
  }

  setGraphType(graphType: GraphType) {
    this.graphType = graphType;
  }

  filterWIthPeriod(data: Am5Candle[]): Am5Candle[] {
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
