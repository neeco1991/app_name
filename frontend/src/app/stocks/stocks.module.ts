import { NgModule } from '@angular/core';

import { SummaryComponent } from './summary/summary.component';
import { StocksRoutingModule } from './stocks.routing';
import { StockTitleComponent } from './stock-title/stock-title.component';
import { SharedModule } from '../shared/shared.module';
import { StocksResolver } from './stocks.resolver';
import { StatsComponent } from './stats/stats.component';

@NgModule({
  declarations: [SummaryComponent, StockTitleComponent, StatsComponent],
  imports: [StocksRoutingModule, SharedModule],
  providers: [StocksResolver],
})
export class StocksModule {}
