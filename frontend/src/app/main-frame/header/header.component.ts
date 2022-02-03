import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  @Output() hamburgerAction = new EventEmitter<void>();

  ngOnInit(): void {}

  onHamburgerClick() {
    this.hamburgerAction.emit();
  }
}
