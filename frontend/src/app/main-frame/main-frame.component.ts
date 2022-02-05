import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.scss'],
})
export class MainFrameComponent implements OnInit {
  menuClosed = false;

  constructor() {}

  ngOnInit(): void {}

  toggleMenu() {
    this.menuClosed = !this.menuClosed;
  }
}
