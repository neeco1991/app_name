import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingComponent } from './components/loading/loading.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { PageOverlayComponent } from './components/page-overlay/page-overlay.component';
import { LineCandleChartComponent } from './components/charts/line-candle-chart/line-candle-chart.component';
import { CandleChartComponent } from './components/charts/candle-chart/candle-chart.component';
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';
import { PeriodSelectorComponent } from './components/charts/period-selector/period-selector.component';

@NgModule({
  declarations: [
    CapitalizePipe,
    LoadingComponent,
    PageOverlayComponent,
    LineCandleChartComponent,
    CandleChartComponent,
    LineChartComponent,
    PeriodSelectorComponent,
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    CapitalizePipe,
    LoadingComponent,
    PageOverlayComponent,
    LineCandleChartComponent,
  ],
})
export class SharedModule {}
