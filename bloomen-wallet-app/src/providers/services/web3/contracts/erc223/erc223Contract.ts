import { default as JSON } from '../json/ERC223.json';
import { Contract, Listener } from '../contract';

import * as RLP from 'rlp';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';
import { AssetsContract } from '@core/core.module.js';

const log = new Logger('erc223.contract');


export class ERC223Contract extends Contract {

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

  public getBalance() {
    return this.contract.methods.balanceOf(this.address).call(this.args);
  }

  public transfer(toAddress: string, amount: number) {
    return this.transactionService.addTransaction(this.args.gas, () => {
      return this.contract.methods.transfer(toAddress, amount).send(this.args);
    });
  }

  public buy( assetId: number, schemaId: number, amount: number, dappId: string, description: string) {
    return this.transactionService.addTransaction(this.args.gas, () => {
      const data = [];
      data.push(assetId);
      data.push(schemaId);
      data.push(dappId);
      data.push(description);
      return this.contract.methods.transfer(AssetsContract.ADDRESS, amount, RLP.encode(data)).send(this.args);
    });
  }

  protected updateAddress(newAddress: string) {
    super.updateAddress(newAddress);
    this.clearListeners();
    this.addEventListener(new Listener('Transfer', { from: this.address }));
    this.addEventListener(new Listener('Transfer', { to: this.address }));
  }

}
