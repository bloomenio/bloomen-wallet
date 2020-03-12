import { default as JSON } from 'bloomen-token/build/contracts/MovementHistory.json';
import { Contract } from '../contract';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

const log = new Logger('movementHistory.contract');


@Injectable()
export class MovementHistoryContract extends Contract {

  constructor(
    public web3Service: Web3Service,
    public transactionService: TransactionService,
    protected store: Store<any>
  ) {
    super(web3Service, transactionService, JSON.abi, JSON.networks[environment.eth.contractConfig.networkId].address, store);
  }

  public getMovements(page: number) {
    return this.getContract().methods.getMovements(page).call(this.args);
  }
}
