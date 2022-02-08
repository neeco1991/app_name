import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  pluck,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private searchService: SearchService) {}

  searchForm: FormGroup = new FormGroup({ stock: new FormControl() });
  destroy$ = new Subject<void>();

  queryResults$ = this.searchForm.valueChanges.pipe(
    pluck('stock'),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((q: string) => this.searchService.search({ q })),
    pluck('result')
  );

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    const { stock } = this.searchForm.value;
    this.searchForm.reset();
    this.router.navigate(['stock', stock, 'summary']);
  }
}
