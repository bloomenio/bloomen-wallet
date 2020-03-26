import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({name: 'applyDecimals'})
export class ApplyDecimalsPipe implements PipeTransform {
  public transform ( amount: string, decimals: string ): string {

    let amountValue = Number(amount);
    const decimalsValue = Number(decimals);

    if (decimalsValue > 0) {
      amountValue = amountValue / (10 ** decimalsValue );
    }

    return `${amountValue}`;

  }
}
