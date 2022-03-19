import { Component, Input, OnInit } from '@angular/core';
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
export class LineCandleChartComponent implements OnInit {
  @Input() data: Candles;
  @Input() size = [1500, 500];
  @Input() title: string;
  @Input() bigNumbers: boolean = false;
  @Input() currency: string | null;

  period: Period = '1y';
  graphType: GraphType = 'line';
  lastValue: number;

  ngOnInit(): void {
    this.lastValue = this.data.close[this.data.close.length - 1];
  }

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
