import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ width: '0', visibility: 'hidden' })),
      state('true', style({ width: '25rem', visibility: 'visible' })),
      transition('false <=> true', animate(200)),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  @Input() sidebarExpanded = false;
  @Output() hamburgerAction = new EventEmitter<void>();

  ngOnInit(): void {}

  onHamburgerClick() {
    this.hamburgerAction.emit();
  }
}
