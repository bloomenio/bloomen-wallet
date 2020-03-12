import { default as JSON } from '../json/Bloomen.json';
import { Contract } from '../contract';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

const log = new Logger('bloomen.contract');

@Injectable()
export class BloomenContract extends Contract {

  constructor(
    protected web3Service: Web3Service,
    protected transactionService: TransactionService,
    protected store: Store<any>
  ) {
    super(web3Service, transactionService, JSON.abi, JSON.networks[environment.eth.contractConfig.networkId].address, store);
  }

  public getDapps(): Promise<string[]> {
    return this.getContract().methods.getDapps().call(this.args);
  }

}
