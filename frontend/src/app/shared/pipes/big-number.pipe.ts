import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'big_number' })
export class BigNumberPipe implements PipeTransform {
  TRILION = 1000000000000;
  BILION = 1000000000;
  MILION = 1000000;
  THOUSANDS = 1000;

  transform(value: number, ...args: any[]): string {
    if (value / this.TRILION > 1) {
      return `${value / this.TRILION} T`;
    } else if (value / this.BILION > 1) {
      return `${value / this.BILION} B`;
    } else if (value / this.MILION > 1) {
      return `${value / this.MILION} M`;
    } else if (value / this.THOUSANDS > 1) {
      return `${value / this.THOUSANDS} K`;
    } else {
      return `${value}`;
    }
  }
}
