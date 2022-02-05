import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  constructor(private router: Router) {}

  searchForm: FormGroup = new FormGroup({ stock: new FormControl() });

  ngOnInit(): void {}

  onSubmit() {
    const { stock } = this.searchForm.value;
    this.searchForm.reset();
    this.router.navigate(['stock', stock, 'summary']);
  }
}
