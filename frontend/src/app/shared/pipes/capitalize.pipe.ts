import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {
  transform(value: string, ...args: any[]) {
    const what: 'all' | 'first' = args[0];

    if (what === 'all') {
      return value
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }

    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
