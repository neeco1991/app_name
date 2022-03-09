import {
  AfterViewInit,
  Component,
  OnInit,
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

  private root: am5.Root;
  private series: any;

  private upColor = '#90ee90';
  private downColor = '#ff7f7f';

  ngAfterViewInit() {
    this.browserOnly(() => {
      this.root = this.lineChart();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].previousValue) {
      this.pushData();
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
    let root = am5.Root.new('linechartdiv');

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
      })
    );

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
      })
    );
    cursor.lineY.set('visible', false);

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(
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

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(root, {
          pan: 'zoom',
        }),
      })
    );

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    this.series = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: 'Series',
        xAxis: xAxis,
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

    // this.setColor();

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      })
    );

    this.pushData();

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    this.series.appear(1000);
    chart.appear(1000, 100);

    return root;
  }

  private setColor() {
    const isGoingUp =
      this.data[this.data.length - 1].value - this.data[0].value > 0;
    const fillColor = isGoingUp ? this.upColor : this.downColor;
    this.series.set('fill', fillColor);
    this.series.set('stroke', fillColor);
  }

  private pushData() {
    this.series.data.setAll(this.data);
  }
}
