import { default as JSON } from '../json/Assets.json';
import { Contract, Listener } from '../contract';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';

const log = new Logger('assets.contract');


export class AssetsContract extends Contract {

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

  public getAssets(page: number) {
     return this.contract.methods.getAssets(page).call(this.args);
  }

  public buy( assetId: number, schemaId: number, amount: number, dappId: string) {
    return this.transactionService.addTransaction(this.args.gas, () => {
      return this.contract.methods.buy(assetId, schemaId, amount, dappId).send(this.args);
    });
  }

}
