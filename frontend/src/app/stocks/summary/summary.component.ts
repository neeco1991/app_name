import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { pluck, Subject, takeUntil, tap } from 'rxjs';

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

  symbol = this.route.params.pipe(takeUntil(this.destroyed$), pluck('symbol'));

  loading$ = this.store
    .select('stock')
    .pipe(pluck('loading'), tap(console.log));

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
