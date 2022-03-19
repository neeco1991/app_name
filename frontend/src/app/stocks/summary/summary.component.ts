import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  map,
  Observable,
  pluck,
  Subject,
  takeUntil,
  withLatestFrom,
} from 'rxjs';

import * as fromApp from '../../store';
import { StatList, Stats } from '../stats/stats.component';
import { Candles } from '../store';

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
  selectedStat: StatList = 'price';

  tiker$ = this.route.params.pipe(
    takeUntil(this.destroyed$),
    pluck('symbol'),
    map((symbol: string) => {
      const splitted = symbol.split('.');
      return splitted[0];
    })
  );

  notLoading$ = this.store.select('stock').pipe(
    takeUntil(this.destroyed$),
    map(
      (state) =>
        !(
          state.candles.loading ||
          state.profile.loading ||
          state.financials.balanceSheet.loading ||
          state.financials.cashFlowStatement.loading ||
          state.financials.incomeStatement.loading
        )
    )
  );

  profile$ = this.store
    .select('stock')
    .pipe(takeUntil(this.destroyed$), pluck('profile'));

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
    map(({ fy }) =>
      fy.map((income) => ({
        date: new Date(income.date),
        shares: income.weightedAverageShsOut,
      }))
    )
  );

  candles$: Observable<Candles & { shares: number[] }> = this.store
    .select('stock')
    .pipe(
      takeUntil(this.destroyed$),
      pluck('candles'),
      withLatestFrom(this.WNShares$),
      map(([candles, shares]) => {
        const nShares: number[] = [];

        const sharesLength = shares.length;
        let candlesIndex = candles.close.length - 1;
        let sharesIndex = 0;
        while (candlesIndex >= 0) {
          while (
            sharesIndex < sharesLength - 1 &&
            shares[sharesIndex].date >= candles.time[candlesIndex]
          ) {
            sharesIndex++;
          }
          nShares.unshift(shares[sharesIndex].shares);
          candlesIndex--;
        }
        return {
          ...candles,
          shares: nShares,
        };
      })
    );

  marketCap$ = this.candles$.pipe(
    takeUntil(this.destroyed$),
    map((candles) => {
      const marketCap: Candles = {
        close: [],
        open: [],
        low: [],
        high: [],
        time: [],
        volume: [],
      };

      for (let i = 0; i < candles.close.length; i++) {
        marketCap.close.push(candles.close[i] * candles.shares[i]);
        marketCap.open.push(candles.open[i] * candles.shares[i]);
        marketCap.low.push(candles.low[i] * candles.shares[i]);
        marketCap.high.push(candles.high[i] * candles.shares[i]);
        marketCap.volume.push(candles.volume[i]);
        marketCap.time.push(candles.time[i]);
      }
      return marketCap;
    })
  );

  stats$ = combineLatest([this.candles$, this.marketCap$]).pipe(
    takeUntil(this.destroyed$),
    map(
      ([candles, marketCap]): Stats => ({
        price: {
          price: candles.close[candles.close.length - 1],
          marketCap: marketCap.close[marketCap.close.length - 1],
        },
      })
    )
  );

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onSelectStat(stat: StatList) {
    this.selectedStat = stat;
  }
}
