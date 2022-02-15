import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
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
  isInputFocused = false;
  isSelectFocused = false;

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
    // console.log(this.searchInput);
    this.searchInput.nativeElement.addEventListener(
      'keyup',
      ({ key }: { [key: string]: string }) => {
        if (key === 'ArrowDown') {
          const select = <HTMLSelectElement>(
            document.getElementById('query_results')
          );
          select.focus();
          const option = <HTMLOptionElement>(
            document.getElementById('query_results_0')
          );
          // console.log(option);
          console.log(document.activeElement);
          option.selected = true;
          this.isSelectFocused = true;
          // console.log(this.isFocused);
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

  onInputFocus(state: boolean) {
    this.isInputFocused = state;
    console.log(this.isInputFocused);
    // const select = document.getElementById('query_results');
    // console.log(document.activeElement);
    // if (select && document.activeElement === select) {
    //   this.isFocused = true;
    // }
    // console.log(this.isFocused);
  }

  onSelectFocus(state: boolean) {
    this.isSelectFocused = state;
    console.log(this.isSelectFocused);
  }

  testFocus() {
    console.log('test');
  }
}
