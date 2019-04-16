import { default as JSON } from '../json/Devices.json';
import { Contract, Listener } from '../contract';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';

const log = new Logger('devices.contract');


export class DevicesContract extends Contract {

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

  public isAllowed(device: string) {
    return this.contract.methods.isAllowed(this.web3Service.keccak256(device)).call(this.args);
  }

  public handshake(device: string, assetId: number, schemaId: number, dappId: string) {
    return this.transactionService.addTransaction(this.args.gas, () => {
      let n =  Date.now();
      n += 60 * 60 * 24; // one day
      return this.contract.methods.handshake(this.web3Service.keccak256(device), assetId, schemaId, n, dappId).send(this.args);
    });
  }

}
