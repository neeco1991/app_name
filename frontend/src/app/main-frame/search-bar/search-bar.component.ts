import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  pluck,
  switchMap,
  tap,
} from 'rxjs';
import { StocksService } from 'src/app/shared/services/stocks.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  constructor(private router: Router, private stocksService: StocksService) {}

  searchForm: FormGroup = new FormGroup({ stock: new FormControl() });

  queryResults$ = this.searchForm.valueChanges.pipe(
    pluck('stock'),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((q: string) => this.stocksService.search({ q }))
  );

  ngOnInit(): void {}

  onSubmit() {
    const { stock } = this.searchForm.value;
    this.searchForm.reset();
    this.router.navigate(['stock', stock, 'summary']);
  }
}
