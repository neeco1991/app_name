import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryComponent } from './summary/summary.component';
import { StocksRoutingModule } from './stocks.routing';
import { StockTitleComponent } from './stock-title/stock-title.component';

@NgModule({
  declarations: [SummaryComponent, StockTitleComponent],
  imports: [CommonModule, StocksRoutingModule],
})
export class StocksModule {}
