import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { CurrencyPipe } from 'src/app/shared/pipes/currency.pipe';
// import am5themes_Responsive from '@amcharts/amcharts5/themes/Responsive';

import { Period } from '../period-selector/period-selector.component';

export interface Am5Point {
  date: number;
  value: number;
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private zone: NgZone
  ) {}

  @Input() data: Am5Point[];
  @Input() size = [1500, 500];
  @Input() id = 'chartDiv';
  @Input() bigNumbers = false;
  @Input() currency: string | null;

  private period: Period = '1y';

  private root: am5.Root;
  private series: any;
  private scrollbarSeries: any;
  private xAxis: any;

  // private upColor = '#90ee90';
  // private downColor = '#ff7f7f';

  private currencyPipe = new CurrencyPipe();

  ngAfterViewInit() {
    this.browserOnly(() => {
      this.root = this.lineChart();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].previousValue) {
      this.setScrollbar();
      // this.setColor();
    }
  }

  ngOnDestroy() {
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }

  private browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  private lineChart() {
    let root = am5.Root.new(this.id);

    root.setThemes([am5themes_Animated.new(root)]);

    root.numberFormatter.setAll({
      numberFormat: '#a',
      bigNumberPrefixes: [
        { number: 1e6, suffix: 'M' },
        { number: 1e9, suffix: 'B' },
        { number: 1e12, suffix: 'T' },
      ],
    });

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        // wheelX: 'panX',
        wheelY: 'zoomX',
        layout: root.verticalLayout,
        maxTooltipDistance: 0,
      })
    );

    let cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
      })
    );
    cursor.lineY.set('visible', false);

    this.xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.5,
        baseInterval: {
          timeUnit: 'day',
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(root, {
          pan: 'zoom',
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yStyle: any = {
      numberFormat: `#${this.currencyPipe.transform(this.currency)}`,
    };
    if (this.bigNumbers) {
      yStyle['numberFormat'] = `#a${this.currencyPipe.transform(
        this.currency
      )}`;
    }

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        ...yStyle,
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(root, {
          pan: 'zoom',
        }),
      })
    );

    this.series = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: 'Series',
        xAxis: this.xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',

        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY}',
        }),
      })
    );

    this.series.fills.template.setAll({
      visible: true,
      fillOpacity: 0.2,
    });

    let scrollbar = am5xy.XYChartScrollbar.new(root, {
      orientation: 'horizontal',
      height: 50,
    });
    chart.bottomAxesContainer.children.push(scrollbar);
    let sbxAxis = scrollbar.chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        groupData: true,
        groupIntervals: [{ timeUnit: 'week', count: 1 }],
        baseInterval: { timeUnit: 'day', count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          opposite: false,
          strokeOpacity: 0,
        }),
      })
    );
    let sbyAxis = scrollbar.chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );
    this.scrollbarSeries = scrollbar.chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: sbxAxis,
        yAxis: sbyAxis,
        valueYField: 'value',
        valueXField: 'date',
      })
    );
    chart.set('scrollbarX', scrollbar);

    this.setScrollbar();

    this.series.data.setAll(this.data);
    this.scrollbarSeries.data.setAll(this.data);

    this.series.appear(1000);
    chart.appear(1000, 100);

    return root;
  }

  onSetPeriod(period: Period) {
    this.period = period;
    // this.setScrollbar();
  }

  // private setColor() {
  //   const isGoingUp =
  //     this.data[this.data.length - 1].value - this.data[0].value > 0;
  //   const fillColor = isGoingUp ? this.upColor : this.downColor;
  //   this.series.set('fill', fillColor);
  //   this.series.set('stroke', fillColor);
  // }

  private setScrollbar() {
    this.series.data.setAll(this.data);

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

    const from =
      startDate < new Date(this.data[0].date) || this.period === 'all'
        ? new Date(this.data[0].date)
        : startDate;
    this.series.events.once('datavalidated', (ev: any, target: any) => {
      this.xAxis.zoomToDates(from, new Date());
    });
  }
}
