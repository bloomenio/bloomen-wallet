import { default as JSON } from '../json/PrepaidCardManager.json';
import { Contract } from '../contract';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const log = new Logger('prepaid_card_manager.contract');

@Injectable()
export class PrepaidCardManagerContract extends Contract {

  constructor(
    public web3Service: Web3Service,
    public transactionService: TransactionService,
    private activatedRoute: ActivatedRoute
  ) {
    super(web3Service, transactionService, activatedRoute, JSON.abi, JSON.networks[environment.eth.contractConfig.networkId].address);
  }

  public validateCard(secret: string) {
    return this.transactionService.addTransaction(this.args.gas, () => {
      return new Promise( ( resolve ) => {
        return this.getContract().methods.validateCard(this.web3Service.fromAscii(secret)).send(this.args,  (error , hash) => {
          resolve({transactionHash : hash});
        });
      });
    });
  }
}
