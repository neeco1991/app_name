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
  @Input() size = [1500, 500];

  period: Period = '1y';
  graphType: GraphType = 'line';

  onSetPeriod(period: Period) {
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
}
