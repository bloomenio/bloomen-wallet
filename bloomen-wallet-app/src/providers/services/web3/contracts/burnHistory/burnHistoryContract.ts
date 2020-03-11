import { default as JSON } from 'bloomen-token/build/contracts/BurnHistory.json';

import { Contract } from '../contract';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const log = new Logger('movementHistory.contract');

@Injectable()
export class BurnHistoryContract extends Contract {

  constructor(
    protected web3Service: Web3Service,
    protected transactionService: TransactionService,
    private activatedRoute: ActivatedRoute
  ) {
    super(web3Service, transactionService, activatedRoute, JSON.abi, JSON.networks[environment.eth.contractConfig.networkId].address);
  }

  public getBurns(page: number) {
    return this.getContract().methods.getBurns(page).call(this.args);
  }

  public getBurnsPageCount() {
    return this.getContract().methods.getBurnsPageCount().call(this.args);
  }
}
