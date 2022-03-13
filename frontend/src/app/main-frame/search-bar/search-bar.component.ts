import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pluck,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { SearchService } from 'src/app/shared/services/search.service';
import { inOutAnimation } from '../../shared/animations/animations';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  // animations: [
  //   trigger('expand', [
  //     state(
  //       'false',
  //       style({
  //         backgroundColor: 'var(--color-grey-5)',
  //         borderRadius: '100px',
  //         width: '90%',
  //       })
  //     ),
  //     state(
  //       'true',
  //       style({
  //         backgroundColor: 'var(--color-grey-4)',
  //         borderRadius: '10px 10px 0px 0px',
  //         width: '100%',
  //       })
  //     ),
  //     transition('false => true', animate('0.2s')),
  //     transition('true => false', animate('0.2s 0.2s')),
  //   ]),
  //   inOutAnimation(0.2, { enter: 0.2 }),
  // ],
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
    console.log(this.searchForm);
    if (stock) {
      this.searchForm.patchValue({ stock: '' });
      this.router.navigate(['stock', stock, 'summary']);
    }
  }
}
