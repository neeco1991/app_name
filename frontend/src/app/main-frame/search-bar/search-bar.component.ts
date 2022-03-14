import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  pluck,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

import { SearchService } from 'src/app/shared/services/search.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnDestroy {
  constructor(private router: Router, private searchService: SearchService) {}

  searchForm: FormGroup = new FormGroup({
    stock: new FormControl(),
  });
  destroyed$ = new Subject<void>();

  queryResults$ = this.searchForm.valueChanges.pipe(
    takeUntil(this.destroyed$),
    pluck('stock'),
    debounceTime(300),
    distinctUntilChanged(),
    filter((q) => !!q),
    switchMap((q: string) => this.searchService.search({ q })),
    pluck('result')
  );

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onSubmit() {
    const { stock } = this.searchForm.value;
    if (stock) {
      this.searchForm.patchValue({ stock: '' });
      this.router.navigate(['stock', stock, 'summary']);
    }
  }
}
