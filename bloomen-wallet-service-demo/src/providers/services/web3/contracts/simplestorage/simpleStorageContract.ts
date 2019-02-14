import { default as JSON } from '../json/SimpleStorage.json';
import { Contract, Listener } from '../contract';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';

const log = new Logger('simplestorage.contract');


export class SimpleStorageContract extends Contract {

  constructor(
    public contractAddress: string,
    public contract: any,
    public web3Service: Web3Service,
    public transactionService: TransactionService
  ) {
    super(contractAddress, contract, web3Service, transactionService);
    this.addEventListener(new Listener('allEvents', null));
  }

  public static get ABI() { return JSON.abi; }
  public static get ADDRESS() { return JSON.networks[environment.eth.contractConfig.networkId].address; }

  public get() {
    return this.contract.methods.get().call(this.args);
  }

  public set(data: number) {
    return this.transactionService.addTransaction(this.args.gas, () => {
      return this.contract.methods.set(data).send(this.args);
    });
  }
}
