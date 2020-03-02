import { default as JSON } from 'bloomen-token/build/contracts/ERC223.json';

import { Contract, Listener } from '../contract';

import * as RLP from 'rlp';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';
import { AssetsContract } from '@services/web3/contracts/assets/assetsContract';
import { AllowAndBuy } from '@core/models/operations.model';

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
      return new Promise( ( resolve ) => {
        return this.contract.methods.transfer(toAddress, amount).send(this.args,  (error , hash) => {
          resolve({transactionHash : hash});
        });
      });
    });
  }

  public burn(amount: number) {
    return this.transactionService.addTransaction(this.args.gas, () => {
      return new Promise( ( resolve ) => {
        return this.contract.methods.burn(amount).send(this.args,  (error , hash) => {
          resolve({transactionHash : hash});
        });
      });
    });
  }

  public getBurns(page: number) {
    return this.contract.methods.getBurns(page).call(this.args);
  }

  public getBurnsPageCount() {
    return this.contract.methods.getBurnsPageCount().call(this.args);
  }

  public buy( buyObject: AllowAndBuy) {
    return this.transactionService.addTransaction(this.args.gas, () => {
      return new Promise( ( resolve ) => {
        let data = [];
        if (buyObject.assetId) { data.push(buyObject.assetId); }
        if (buyObject.schemaId) { data.push(buyObject.schemaId); }
        if (buyObject.dappId) { data.push(buyObject.dappId); }
        if (buyObject.description) { data.push(buyObject.description); }
        if (buyObject.params) {
          data = data.concat(buyObject.params);
        }
        return this.contract.methods.transfer( buyObject.to ? buyObject.to : AssetsContract.ADDRESS, buyObject.amount, RLP.encode(data))
          .send(this.args,  (error , hash) => {
            resolve({transactionHash : hash});
          });
      });
    });
  }

  protected updateAddress(newAddress: string) {
    super.updateAddress(newAddress);
    this.clearListeners();
    this.addEventListener(new Listener('Transfer', { from: this.address }));
    this.addEventListener(new Listener('Transfer', { to: this.address }));
  }

}
