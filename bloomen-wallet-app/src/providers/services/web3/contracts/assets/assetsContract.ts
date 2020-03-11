import { default as JSON } from '../json/Assets.json';
import { Contract, Listener } from '../contract';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const log = new Logger('assets.contract');

@Injectable()
export class AssetsContract extends Contract {

  constructor(
    protected web3Service: Web3Service,
    protected transactionService: TransactionService,
    private activatedRoute: ActivatedRoute
  ) {
    super(web3Service, transactionService, activatedRoute, JSON.abi, JSON.networks[environment.eth.contractConfig.networkId].address);
  }

  public  getAssets(page: number, dappId: string) {
     return this.getContract().methods.getAssets(page, dappId).call(this.args);
  }

  public getAssetsPageCount(dappId: string) {
    return this.getContract().methods.getAssetsPageCount(dappId).call(this.args);
  }

  public checkOwnership(assetId: number, schemaId: number, dappId: string)  {
    return this.getContract().methods.checkOwnershipOneAsset(assetId, schemaId, dappId).call(this.args);
  }

  public removeAsset(assetId: number, dappId: string) {
    return this.transactionService.addTransaction(this.args.gas, () => {
      return new Promise( ( resolve ) => {
        return this.getContract().methods.removeAsset(Number(assetId), dappId).send(this.args,  (error , hash) => {
          resolve({transactionHash : hash});
        });
      });
    });

  }

}
