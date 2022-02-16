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
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  pluck,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { SearchService } from 'src/app/shared/services/search.service';
import { booleanTransition } from '../animations';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  animations: [
    booleanTransition(
      'expand',
      {
        backgroundColor: 'var(--color-grey-5)',
        borderRadius: '100px',
        width: '90%',
      },
      {
        backgroundColor: 'var(--color-grey-4)',
        borderRadius: '10px 10px 0px 0px',
        width: '100%',
      },
      200
    ),
    booleanTransition('disappear', { opacity: 0 }, { opacity: 1 }, 200),
  ],
})
export class SearchBarComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private router: Router, private searchService: SearchService) {}

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  searchForm: FormGroup = new FormGroup({
    stock: new FormControl(),
    results: new FormControl(),
  });
  destroy$ = new Subject<void>();
  isInputFocused$ = new BehaviorSubject<boolean>(false);
  isSelectFocused$ = new BehaviorSubject<boolean>(false);

  isSearchBarFocused$ = combineLatest([
    this.isInputFocused$,
    this.isSelectFocused$,
  ]).pipe(
    takeUntil(this.destroy$),
    map(([input, select]) => input || select),
    tap(console.log)
  );
  // .subscribe();

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
          option.selected = true;
        }
      }
    );
  }

  onSubmit() {
    console.log(this.searchForm.value);
  }

  onInputFocus(state: boolean) {
    setTimeout(() => {
      this.isInputFocused$.next(state);
    });
  }

  onSelectFocus(state: boolean) {
    this.isSelectFocused$.next(state);
  }
}
