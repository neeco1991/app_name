import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'big_number' })
export class BigNumberPipe implements PipeTransform {
  TRILION = 1000000000000;
  BILION = 1000000000;
  MILION = 1000000;
  THOUSANDS = 1000;

  transform(value: number | null, ...args: any[]): string | null {
    if (!value) {
      return null;
    }
    if (value / this.TRILION > 1) {
      return `${(value / this.TRILION).toFixed(3)} T`;
    } else if (value / this.BILION > 1) {
      return `${(value / this.BILION).toFixed(3)} B`;
    } else if (value / this.MILION > 1) {
      return `${(value / this.MILION).toFixed(3)} M`;
    } else if (value / this.THOUSANDS > 1) {
      return `${(value / this.THOUSANDS).toFixed(3)} K`;
    } else {
      return `${value}`;
    }
  }
}
