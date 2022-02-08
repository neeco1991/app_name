import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CapitalizePipe } from './pipes/capitalize.pipe';

@NgModule({
  declarations: [CapitalizePipe],
  imports: [CommonModule],
  exports: [CommonModule, CapitalizePipe],
})
export class SharedModule {}
