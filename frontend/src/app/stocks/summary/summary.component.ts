import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, pluck, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';

import * as fromApp from '../../store';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  destroyed$ = new Subject<void>();

  tiker$ = this.route.params.pipe(
    takeUntil(this.destroyed$),
    pluck('symbol'),
    map((symbol: string) => {
      const splitted = symbol.split('.');
      return splitted[0];
    })
  );

  loading$ = this.store.select('stock').pipe(
    takeUntil(this.destroyed$),
    map(
      (state) =>
        state.candles.loading ||
        state.profile.loading ||
        state.financials.balanceSheet.loading ||
        state.financials.cashFlowStatement.loading ||
        state.financials.incomeStatement.loading
    )
  );

  profile$ = this.store
    .select('stock')
    .pipe(takeUntil(this.destroyed$), pluck('profile'));

  candles$ = this.store
    .select('stock')
    .pipe(takeUntil(this.destroyed$), pluck('candles'));

  currency$ = this.store.select('stock').pipe(
    takeUntil(this.destroyed$),
    pluck('financials'),
    pluck('incomeStatement'),
    map(({ fy }) => fy[0].reportedCurrency)
  );

  WNShares$ = this.store.select('stock').pipe(
    takeUntil(this.destroyed$),
    pluck('financials'),
    pluck('incomeStatement'),
    map(({ fy }) => fy[0].weightedAverageShsOut)
  );

  marketCap$ = this.candles$.pipe(
    withLatestFrom(this.WNShares$),
    map(([{ close }, shares]) => close[close.length - 1] * shares)
  );

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
