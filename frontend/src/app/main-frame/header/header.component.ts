import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { collapseAnimation } from '../animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    collapseAnimation(
      { width: '0', visibility: 'hidden' },
      { width: '25rem', visibility: 'visible' },
      200
    ),
  ],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  @Input() sidebarExpanded = true;
  @Output() hamburgerAction = new EventEmitter<void>();

  ngOnInit(): void {}

  onHamburgerClick() {
    this.hamburgerAction.emit();
  }
}
