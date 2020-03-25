import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'applyDecimals'})

export class ApplyDecimalsPipe implements PipeTransform {
  public transform ( amount: string, decimals: string ): string {

    if ( Number(decimals) > 0 && Number(amount) && amount.length > Number(decimals) ) {

      return amount.substring(0, amount.length - Number(decimals)) + ',' + amount.substring(amount.length - Number(decimals), amount.length);

    } else {

      return amount;

    }
  }
}
