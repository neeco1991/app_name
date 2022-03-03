import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingComponent } from './components/loading/loading.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { PageOverlayComponent } from './components/page-overlay/page-overlay.component';
import { LineCandleChartComponent } from './components/charts/line-candle-chart/line-candle-chart.component';

@NgModule({
  declarations: [
    CapitalizePipe,
    LoadingComponent,
    PageOverlayComponent,
    LineCandleChartComponent,
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
