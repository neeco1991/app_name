import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { collapseAnimation } from '../animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [collapseAnimation({ width: '0' }, { width: '25rem' }, 200)],
})
export class SidebarComponent implements OnInit {
  constructor() {}

  @Input() sidebarExpanded = true;

  ngOnInit(): void {}
}
