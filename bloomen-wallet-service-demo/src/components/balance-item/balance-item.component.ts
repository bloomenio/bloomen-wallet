// Basic
import { Component, OnInit } from '@angular/core';
import { PrepaidCardManagerContract } from '@core/core.module';
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';

const log = new Logger('balance-item');

/**
 * balance item component
 */
@Component({
  selector: 'blo-balance-item',
  templateUrl: 'balance-item.component.html',
  styleUrls: ['balance-item.component.scss']
})
export class BalanceItemComponent implements OnInit {

  constructor(
    private prepaidCardContract: PrepaidCardManagerContract,
    private web3Service: Web3Service
  ) {
  }

  public ngOnInit() {
    this.web3Service.ready(() => {
      this.prepaidCardContract.getSchemas().then((schemas) => {
        log.debug(schemas);
        this.prepaidCardContract.getSchema(schemas[0]).then((schemaDetail) => {
          log.debug(schemaDetail);
        });
      });
    });
  }

}
