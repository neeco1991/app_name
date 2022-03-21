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

  incomeStatement$ = this.store.select('stock').pipe(
    takeUntil(this.destroyed$),
    pluck('financials'),
    pluck('incomeStatement'),
    map(({ fy }) =>
      fy.map((income) => ({
        date: new Date(income.date),
        shares: income.weightedAverageShsOut,
        revenue: income.revenue,
        netIncome: income.netIncome,
      }))
    )
  );

  candles$: Observable<Candles> = this.store
    .select('stock')
    .pipe(takeUntil(this.destroyed$), pluck('candles'));

  stockDaylyData$: Observable<
    Candles & { shares: number[]; revenue: number[]; netIncome: number[] }
  > = combineLatest([this.candles$, this.incomeStatement$]).pipe(
    takeUntil(this.destroyed$),
    map(([candles, income]) => {
      const nShares: number[] = [];
      const ltmRev: number[] = [];
      const ltmNetInc: number[] = [];

      const sharesLength = income.length;
      let candlesIndex = candles.close.length - 1;
      let sharesIndex = 0;
      while (candlesIndex >= 0) {
        while (
          sharesIndex < sharesLength - 1 &&
          income[sharesIndex].date >= candles.time[candlesIndex]
        ) {
          sharesIndex++;
        }
        nShares.unshift(income[sharesIndex].shares);
        ltmRev.unshift(income[sharesIndex].revenue);
        ltmNetInc.unshift(income[sharesIndex].netIncome);
        candlesIndex--;
      }
      return {
        ...candles,
        shares: nShares,
        revenue: ltmRev,
        netIncome: ltmNetInc,
      };
    })
  );

  PE$ = this.stockDaylyData$.pipe(
    takeUntil(this.destroyed$),
    map((candles) => {
      const PE: Candles = {
        close: [],
        open: [],
        low: [],
        high: [],
        time: [],
        volume: [],
      };

      for (let i = 0; i < candles.close.length; i++) {
        PE.close.push(
          Math.round(
            (candles.close[i] * candles.shares[i] * 100) / candles.netIncome[i]
          ) / 100
        );
        PE.open.push(
          Math.round(
            (candles.open[i] * candles.shares[i] * 100) / candles.netIncome[i]
          ) / 100
        );
        PE.low.push(
          Math.round(
            (candles.low[i] * candles.shares[i] * 100) / candles.netIncome[i]
          ) / 100
        );
        PE.high.push(
          Math.round(
            (candles.high[i] * candles.shares[i] * 100) / candles.netIncome[i]
          ) / 100
        );
        PE.volume.push(candles.volume[i]);
        PE.time.push(candles.time[i]);
      }
      return PE;
    })
  );

  PS$ = this.stockDaylyData$.pipe(
    takeUntil(this.destroyed$),
    map((candles) => {
      const PS: Candles = {
        close: [],
        open: [],
        low: [],
        high: [],
        time: [],
        volume: [],
      };

      for (let i = 0; i < candles.close.length; i++) {
        PS.close.push(
          Math.round(
            (candles.close[i] * candles.shares[i] * 100) / candles.revenue[i]
          ) / 100
        );
        PS.open.push(
          Math.round(
            (candles.open[i] * candles.shares[i] * 100) / candles.revenue[i]
          ) / 100
        );
        PS.low.push(
          Math.round(
            (candles.low[i] * candles.shares[i] * 100) / candles.revenue[i]
          ) / 100
        );
        PS.high.push(
          Math.round(
            (candles.high[i] * candles.shares[i] * 100) / candles.revenue[i]
          ) / 100
        );
        PS.volume.push(candles.volume[i]);
        PS.time.push(candles.time[i]);
      }
      return PS;
    })
  );

  marketCap$ = this.stockDaylyData$.pipe(
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

  stats$ = combineLatest([
    this.candles$,
    this.marketCap$,
    this.PE$,
    this.PS$,
  ]).pipe(
    takeUntil(this.destroyed$),
    map(
      ([candles, marketCap, PE, PS]): Stats => ({
        price: {
          price: candles.close[candles.close.length - 1],
          marketCap: marketCap.close[marketCap.close.length - 1],
        },
        valuation: {
          PE: PE.close[PE.close.length - 1],
          PS: PS.close[PS.close.length - 1],
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
