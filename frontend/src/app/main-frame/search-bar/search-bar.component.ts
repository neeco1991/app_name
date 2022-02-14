import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
export class SearchBarComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private router: Router, private searchService: SearchService) {}

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  searchForm: FormGroup = new FormGroup({
    stock: new FormControl(),
    results: new FormControl(),
  });
  destroy$ = new Subject<void>();
  isFocused = false;

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

  ngAfterViewInit(): void {
    console.log(this.searchInput);
    this.searchInput.nativeElement.addEventListener(
      'keydown',
      ({ key }: { [key: string]: string }) => {
        if (key === 'ArrowDown') {
          const option = <HTMLOptionElement>(
            document.getElementById('query_results_0')
          );
          console.log(option);
          option.selected = true;
          const select = <HTMLSelectElement>(
            document.getElementById('query_results')
          );
          select.focus();
          select.scrollTop = 0;
        }
      }
    );
  }

  onSubmit() {
    console.log(this.searchForm.value);
    // const { stock } = this.searchForm.value;
    // this.searchForm.reset();
    // this.router.navigate(['stock', stock, 'summary']);
  }

  onFocus(state: boolean) {
    this.isFocused = state;
  }
}
