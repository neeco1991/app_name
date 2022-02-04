import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ width: '0' })),
      state('true', style({ width: '25rem' })),
      transition('* <=> *', animate(200)),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  constructor() {}

  @Input() sidebarExpanded = true;

  ngOnInit(): void {}
}
