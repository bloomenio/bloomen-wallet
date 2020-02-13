// Basic
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

// Ethereum
import * as lightwallet from 'eth-lightwallet';

const Mnemonic = require('bitcore-mnemonic');

import Web3 from 'web3';
import * as Web3ProviderEngine from 'web3-provider-engine';
import * as HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet';

import {RpcSubprovider} from '@services/web3/rpc-subprovider';

// Environment
import { environment } from '@env/environment';

// Services
import { Logger } from '@services/logger/logger.service';

// Constants
import { WEB3_CONSTANTS } from '@core/constants/web3.constants';
import { take, filter } from 'rxjs/operators';

const log = new Logger('web3.service');

@Injectable()
export class Web3Service {
  private blockRange: Subject<any>;
  private lastBlockNumber: number;
  private isReady: boolean;
  private currentBlockNumber: number;
  private web3: any;
  private globalKeystore: any;
  private watiningCallbacks: Array<any>;
  private myAddress: BehaviorSubject<string>;

  constructor(private rpcSubprovider: RpcSubprovider ) {

    this.blockRange = new Subject<any>();
    this.lastBlockNumber = -1;
    this.isReady = false;
    this.currentBlockNumber = -1;
    this.watiningCallbacks = [];
    this.myAddress = new BehaviorSubject<string>(undefined);

    const engine = new Web3ProviderEngine();

    const web3Options = {
      transactionConfirmationBlocks: environment.eth.web3Options.transactionConfirmationBlocks,
      transactionPollingTimeout: environment.eth.web3Options.transactionPollingTimeout,
    };


    this.web3 = new Web3(engine, null, web3Options);

    engine.addProvider(new HookedWalletSubprovider({
      getAccounts: (cb) => {
        cb(undefined, this.globalKeystore.getAddresses());
      },
      signTransaction: (tx, cb) => {
        this.globalKeystore.signTransaction(tx, cb);
      },
    }));


    engine.addProvider(this.rpcSubprovider);

    if (document.readyState === WEB3_CONSTANTS.READY_STATE.COMPLETE) {
      this.bootstrapWeb3(environment.eth.generalSeed).then(() => { this._engineSetup(engine); });
    } else {
      window.addEventListener('load', () => {
        this.bootstrapWeb3(environment.eth.generalSeed).then(() => { this._engineSetup(engine);  });
      });
    }
  }

  private _engineSetup(engine: any) {
    engine.start();
    engine.stop();
    this.rpcSubprovider.errorStateObserver().pipe(
      filter((errorState) => !errorState),
      take(1)
     ).subscribe((errorState) => {
      this.isReady = true;
      this.watiningCallbacks.forEach((element: any) => {
        element();
      });
      this.watiningCallbacks = [];
      this._doTick();
     });
  }

  public ready(callback: any) {
    if (this.isReady) {
      callback();
    } else {
      this.watiningCallbacks.push(callback);
    }
  }

  public createContract(abi: any, address: string) {
    return new this.web3.eth.Contract(abi, address);
  }

  public getAddress(): Observable<string> {
    return this.myAddress.asObservable();
  }

  public validateMnemonic(mnemonic) {
    return Mnemonic.isValid(mnemonic);
  }

  public getLastBlockNumber(): Promise<any> {
    return this.web3.eth.getBlockNumber();
  }

  public getBlockRange(): Observable<any> {
    return this.blockRange.asObservable();
  }

  public checkTransactionStatus(txhash: string): Promise<any> {
    return this.web3.eth.getTransactionReceipt(txhash);
  }

  public fromAscii(secret: string): any {
    return this.web3.utils.fromAscii(secret);
  }

  public keccak256(secret: string): any {
    return this.web3.utils.keccak256(secret);
  }

  public changeWallet(randomSeed: string) {
    log.debug(`change Mnemonic to ${randomSeed}`);
    return this.bootstrapWeb3(randomSeed);
  }

  public generateRandomSeed(): string {
    return lightwallet.keystore.generateRandomSeed();
  }

  private bootstrapWeb3(randomSeed: string) {
    const _hdPassword = environment.eth.hdMagicKey;
    console.log('koko');
    return this._setUpLightwallet(_hdPassword, randomSeed);
  }

  private _setUpLightwallet(password: string, randomSeed: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      lightwallet.keystore.createVault({
        password: password,
        seedPhrase: randomSeed,
        hdPathString: WEB3_CONSTANTS.HD_PATH_STRING
      }, (err, ks) => {
        this.globalKeystore = ks;
        this.globalKeystore.passwordProvider = (callback: any) => {
          callback(null, password);
        };

        this.globalKeystore.keyFromPassword(password, (error: any, pwDerivedKey: any) => {
          if (error) {
            log.error(this, error);
            reject();
          } else {
            console.log(pwDerivedKey);
            this.globalKeystore.generateNewAddress(pwDerivedKey, 1);
            const addresses = this.globalKeystore.getAddresses();
            this.myAddress.next(addresses[0]);
            resolve();
          }
        });
      });
    });
  }

  private _doTick() {
    if (!this.rpcSubprovider.getErrorState()) {
      this.web3.eth.getBlockNumber().then((value: any) => {
        this.lastBlockNumber = this.currentBlockNumber + 1;
        this.currentBlockNumber = value;
        if (this.lastBlockNumber > 0) {
          this.blockRange.next({ fromBlock: this.lastBlockNumber, toBlock: this.currentBlockNumber });
        }
        setTimeout(() => this._doTick(), environment.eth.ethBlockPollingTime);
      }, () => setTimeout(() => this._doTick(), environment.eth.ethBlockPollingTime));
    } else {
      setTimeout(() => this._doTick(), environment.eth.ethBlockPollingTime);
    }
  }

}
