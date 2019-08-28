import { default as JSON } from 'bloomen-token/build/contracts/BurnHistory.json';

import { Contract } from '../contract';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';

const log = new Logger('movementHistory.contract');


export class BurnHistoryContract extends Contract {

  constructor(
    public contractAddress: string,
    public contract: any,
    public web3Service: Web3Service,
    public transactionService: TransactionService
  ) {
    super(contractAddress, contract, web3Service, transactionService);
  }

  public static get ABI() { return JSON.abi; }
  public static get ADDRESS() { return JSON.networks[environment.eth.contractConfig.networkId].address; }

  public getBurns(page: number) {
    return this.contract.methods.getBurns(page).call(this.args);
  }

  public getBurnsPageCount() {
    return this.contract.methods.getBurnsPageCount().call(this.args);
  }
}
