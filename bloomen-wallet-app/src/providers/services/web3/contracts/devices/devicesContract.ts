import { default as JSON } from '../json/Devices.json';
import { Contract, Listener } from '../contract';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const log = new Logger('devices.contract');

@Injectable()
export class DevicesContract extends Contract {

  constructor(
    protected web3Service: Web3Service,
    protected transactionService: TransactionService,
    private activatedRoute: ActivatedRoute
  ) {
    super(web3Service, transactionService, activatedRoute, JSON.abi, JSON.networks[environment.eth.contractConfig.networkId].address);
  }

  public isAllowed(device: string, dappId: string) {
    return this.getContract().methods.isAllowed(this.web3Service.keccak256(device), dappId).call(this.args);
  }

  public handshake(device: string, assetId: number, schemaId: number, dappId: string) {
    return this.transactionService.addTransaction(this.args.gas, () => {
      return new Promise( ( resolve ) => {
        let n =  Date.now();
        n = n / 1000; // millisecons to seconds
        n += 60 * 60 * 24 * 100; // 100 day in seconds
        n = Math.trunc(n);
        return this.getContract().methods.handshake(this.web3Service.keccak256(device), assetId, schemaId, n, dappId, device).send(this.args)
          .on('transactionHash', (hash) => {
            resolve({transactionHash : hash});
        });
      });
    });
  }

  public getDevices(page: number, dappId: string) {
    return this.getContract().methods.getDevices(page, dappId).call(this.args);
  }

  public getDevicesPageCount(dappId: string) {
    return this.getContract().methods.getDevicesPageCount(dappId).call(this.args);
  }

  public removeDevice(device: string, dappId: string) {
    return this.transactionService.addTransaction(this.args.gas, () => {
      return new Promise( ( resolve ) => {
        this.getContract().methods.removeDevice(this.web3Service.keccak256(device), dappId).send(this.args).on('transactionHash', (hash) => {
          resolve({transactionHash : hash});
        });
      });
    });

  }

}
