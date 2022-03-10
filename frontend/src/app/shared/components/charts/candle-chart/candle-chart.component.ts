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

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Period } from '../line-candle-chart/line-candle-chart.component';

export interface Am5Candle {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

@Component({
  selector: 'app-candle-chart',
  templateUrl: './candle-chart.component.html',
  styleUrls: ['./candle-chart.component.scss'],
})
export class CandleChartComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private zone: NgZone
  ) {}

  @Input() data: Am5Candle[];
  @Input() period: Period;

  private root: am5.Root;
  private series: any;
  private scrollbarSeries: any;
  private xAxis: any;

  private upColor = '#76b041';
  private downColor = '#e4572e';

  ngAfterViewInit() {
    this.browserOnly(() => {
      this.root = this.candleChart();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].previousValue) {
      this.setScrollbar();
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

  private candleChart() {
    let root = am5.Root.new('candlechartdiv');

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        wheelY: 'zoomX',
        layout: root.verticalLayout,
        maxTooltipDistance: 0,
        // tooltip: am5.Tooltip.new(root, {}),
      })
    );

    // Create Y-axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Create X-Axis
    this.xAxis = chart.xAxes.push(
      am5xy.GaplessDateAxis.new(root, {
        baseInterval: { timeUnit: 'day', count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50,
        }),
      })
    );

    // Create series
    this.series = chart.series.push(
      am5xy.CandlestickSeries.new(root, {
        name: 'Series',
        xAxis: this.xAxis,
        yAxis: yAxis,

        openValueYField: 'open',
        highValueYField: 'high',
        lowValueYField: 'low',
        valueYField: 'close',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(root, {
          autoTextColor: false,
          // showTooltipOn: 'always',
          labelText: `Open: [{color}]{openValueY}[/] High: [{color}]{highValueY}[/] Low: [{color}]{lowValueY}[/] Close: [{color}]{valueY}[/] Change: [{color}]{percentage}[/]`,
        }),
      })
    );

    this.series.columns.template.states.create('riseFromOpen', {
      fill: am5.color(this.upColor),
      stroke: am5.color(this.upColor),
    });
    this.series.columns.template.states.create('dropFromOpen', {
      fill: am5.color(this.downColor),
      stroke: am5.color(this.downColor),
    });

    const seriesTooltip = this.series.get('tooltip');
    seriesTooltip?.get('background')?.setAll({
      fillOpacity: 0,
      strokeOpacity: 0,
    });

    seriesTooltip?.label.setAll({
      fill: am5.color(0x000000),
    });

    seriesTooltip?.adapters.add('y', function (y: any, target: any) {
      return seriesTooltip.height() / 2 + 5;
    });

    seriesTooltip?.adapters.add('x', function (y: any, target: any) {
      return chart.width() / 2;
    });

    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      })
    );

    // andrebbero tornate così dal BE
    // this.pushData();

    const additionalData = this.data.map((candle, index) => {
      if (index === 0) {
        return { percentage: '---', color: 0x000000 };
      }
      const change = candle.close / this.data[index - 1].close - 1;
      let color = this.downColor;
      let addPlus = '';
      if (change > 0) {
        color = this.upColor;
        addPlus = '+';
      }
      return { percentage: `${addPlus}${(change * 100).toFixed(2)}%`, color };
    });

    this.series.data.setAll(
      this.data.map((day, index) => ({
        ...day,
        ...additionalData[index],
      }))
    );

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
        valueYField: 'close',
        valueXField: 'date',
      })
    );
    chart.set('scrollbarX', scrollbar);

    this.setScrollbar();

    this.series.data.setAll(this.data);
    this.scrollbarSeries.data.setAll(this.data);

    // Add cursor
    chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'zoomXY',
        xAxis: this.xAxis,
      })
    );

    this.xAxis.set(
      'tooltip',
      am5.Tooltip.new(root, {
        themeTags: ['axis'],
      })
    );

    yAxis.set(
      'tooltip',
      am5.Tooltip.new(root, {
        themeTags: ['axis'],
      })
    );

    return root;
  }

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
