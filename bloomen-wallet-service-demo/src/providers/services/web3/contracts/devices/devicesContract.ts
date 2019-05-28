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

  public isAllowed(device: string, dappId: string) {
    return this.contract.methods.isAllowed(this.web3Service.keccak256(device), dappId).call(this.args);
  }

  public checkOwnershipMultipleAssetsForDevice(device: string, assetIds: number[], dappId: string) {
    return this.contract.methods.checkOwnershipMultipleAssetsForDevice(device, assetIds, dappId).call(this.args);
  }

  public checkOwnershipOneAssetForDevice(device: string, assetId: number, dappId: string) {
    return this.contract.methods.checkOwnershipOneAssetForDevice(device, assetId, dappId).call(this.args);
  }

}
