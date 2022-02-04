import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.scss'],
  animations: [
    trigger('expand', [
      state('true', style({ width: '0' })),
      state('false', style({ width: '25rem' })),
      transition('false <=> true', animate(200)),
    ]),
  ],
})
export class MainFrameComponent implements OnInit {
  menuClosed = false;

  constructor() {}

  ngOnInit(): void {}

  toggleMenu() {
    this.menuClosed = !this.menuClosed;
  }
}
