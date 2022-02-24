import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StocksResolver } from './stocks.resolver';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  {
    path: ':symbol',
    children: [
      {
        path: 'summary',
        component: SummaryComponent,
        resolve: { summary: StocksResolver },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StocksRoutingModule {}
