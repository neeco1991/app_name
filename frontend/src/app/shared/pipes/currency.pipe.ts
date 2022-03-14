import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'symbol' })
export class SymbolPipe implements PipeTransform {
  CURRENCY_SYMBOLS: { [key: string]: string } = {
    USD: '$', // US Dollar
    EUR: '€', // Euro
    CRC: '₡', // Costa Rican Colón
    GBP: '£', // British Pound Sterling
    ILS: '₪', // Israeli New Sheqel
    INR: '₹', // Indian Rupee
    JPY: '¥', // Japanese Yen
    KRW: '₩', // South Korean Won
    NGN: '₦', // Nigerian Naira
    PHP: '₱', // Philippine Peso
    PLN: 'zł', // Polish Zloty
    PYG: '₲', // Paraguayan Guarani
    THB: '฿', // Thai Baht
    UAH: '₴', // Ukrainian Hryvnia
    VND: '₫', // Vietnamese Dong
    RUB: '₽', // Russian Ruble
  };

  transform(currency: string, ...args: any[]): string {
    const symbol = this.CURRENCY_SYMBOLS[currency];
    return symbol || '';
  }
}
