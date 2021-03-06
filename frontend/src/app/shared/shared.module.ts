import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingComponent } from './components/loading/loading.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { PageOverlayComponent } from './components/page-overlay/page-overlay.component';
import { LineCandleChartComponent } from './components/charts/line-candle-chart/line-candle-chart.component';
import { CandleChartComponent } from './components/charts/candle-chart/candle-chart.component';
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';
import { PeriodSelectorComponent } from './components/charts/period-selector/period-selector.component';
import { CardComponent } from './components/card/card.component';
import { ChartTitleComponent } from './components/charts/chart-title/chart-title.component';
import { BigNumberPipe } from './pipes/big-number.pipe';
import { CurrencyPipe } from './pipes/currency.pipe';
import { ControlBarComponent } from './components/charts/control-bar/control-bar.component';
import { ChartTypeSelectorComponent } from './components/charts/line-candle-chart/chart-type-selector/chart-type-selector.component';

@NgModule({
  declarations: [
    CapitalizePipe,
    CurrencyPipe,
    BigNumberPipe,
    LoadingComponent,
    PageOverlayComponent,
    LineCandleChartComponent,
    CandleChartComponent,
    LineChartComponent,
    PeriodSelectorComponent,
    CardComponent,
    ChartTitleComponent,
    ControlBarComponent,
    ChartTypeSelectorComponent,
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    CapitalizePipe,
    CurrencyPipe,
    BigNumberPipe,
    LoadingComponent,
    PageOverlayComponent,
    LineCandleChartComponent,
    CardComponent,
    ControlBarComponent,
  ],
})
export class SharedModule {}
