import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export interface Am5Candle {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

@Component({
  selector: 'app-line-candle-chart',
  templateUrl: './line-candle-chart.component.html',
  styleUrls: ['./line-candle-chart.component.scss'],
})
export class LineCandleChartComponent implements AfterViewInit, OnDestroy {
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private zone: NgZone
  ) {}

  @Input() data: Am5Candle[];

  private root: am5.Root;

  private upColor = '#76b041';
  private downColor = '#e4572e';

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      this.root = this.createChart();
    });
  }

  createChart() {
    let root = am5.Root.new('chartdiv');

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
    let xAxis = chart.xAxes.push(
      am5xy.GaplessDateAxis.new(root, {
        baseInterval: { timeUnit: 'day', count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50,
        }),
      })
    );

    // Create series
    let series = chart.series.push(
      am5xy.CandlestickSeries.new(root, {
        name: 'Series',
        xAxis: xAxis,
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

    series.columns.template.states.create('riseFromOpen', {
      fill: am5.color(this.upColor),
      stroke: am5.color(this.upColor),
    });
    series.columns.template.states.create('dropFromOpen', {
      fill: am5.color(this.downColor),
      stroke: am5.color(this.downColor),
    });

    // chart.set('tooltipText', 'test {series.valueY}');

    // let tooltip = am5.Tooltip.new(root, {});

    // tooltip.get('background')?.setAll({
    //   fill: am5.color(0xeeeeee),
    // });

    // chart.set('tooltip', tooltip);

    // chart.set('tooltipText', 'test');

    const seriesTooltip = series.get('tooltip');
    seriesTooltip?.get('background')?.setAll({
      fillOpacity: 0,
      strokeOpacity: 0,
    });

    seriesTooltip?.label.setAll({
      fill: am5.color(0x000000),
    });

    // chart.get('tooltip')?.label.set('text', 'test');

    // const tooltip = chart.get('tooltip');
    // tooltip?.label.set(
    //   'text',
    //   '[bold]{valueX.formatDate()}[/]\nOpen: {openValueY}\nHigh: {highValueY}\nLow: {lowValueY}\nClose: {valueY}'
    // );
    // // tooltip?.set('opacity', 0.1);

    seriesTooltip?.adapters.add('y', function (y, target) {
      return seriesTooltip.height() / 2 + 5;
    });

    seriesTooltip?.adapters.add('x', function (x, target) {
      return seriesTooltip.width() / 2 + 42;
    });

    // andrebbero tornate così dal BE
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

    series.data.setAll(
      this.data.map((day, index) => ({
        ...day,
        ...additionalData[index],
      }))
    );

    // Add cursor
    chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'zoomXY',
        xAxis: xAxis,
      })
    );

    xAxis.set(
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

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
