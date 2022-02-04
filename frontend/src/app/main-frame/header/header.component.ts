import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  @Input() sidebarExpanded = false;
  @Output() hamburgerAction = new EventEmitter<void>();

  ngOnInit(): void {
    console.log(this.sidebarExpanded);
  }

  onHamburgerClick() {
    this.hamburgerAction.emit();
  }
}
