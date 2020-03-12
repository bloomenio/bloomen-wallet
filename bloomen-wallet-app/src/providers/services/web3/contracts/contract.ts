// Basic
import { Observable, Subject, Subscription, combineLatest } from 'rxjs';

// Environment
import { environment } from '@env/environment';

// Services
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';
import { Logger } from '@services/logger/logger.service';
import { Store } from '@ngrx/store';
import * as fromApplicationDataSelectors from '@stores/application-data/application-data.selectors';
import { filter, map } from 'rxjs/operators';
import * as fromDappSelectors from '@stores/dapp/dapp.selectors';
import { DappCache } from '@core/models/dapp.model';


const log = new Logger('contract');

export class Listener {
  constructor(
    public eventName: string,
    public filter: any
  ) { }
}

export abstract class Contract {
  protected events: Subject<any>;
  protected address: string;
  protected args: any;
  private currentDapp: any;
  private myContracts = {};

  private listeners: Listener[];

  constructor(
    protected web3Service: Web3Service,
    protected transactionService: TransactionService,
    private abi: any,
    private defaultAddress: string,
    private genericStore: Store<any>
  ) {

    this.events = new Subject<any>();
    this.listeners = [];

    this.args = {
      from: null,
      value: environment.eth.contractConfig.default.value,
      gasPrice: environment.eth.contractConfig.default.gasPrice,
      gas: environment.eth.contractConfig.default.gas
    };

    this.web3Service.getAddress().subscribe((address) => {
      this.updateAddress(address);
    });

    if (this.genericStore) {
      combineLatest(
        this.genericStore.select(fromApplicationDataSelectors.getCurrentDappAddress)
        .pipe(filter((currentDappAddress) => (!this.currentDapp) || (this.currentDapp.address !== currentDappAddress)))
        , this.genericStore.select(fromDappSelectors.selectAllDapp)
        .pipe(filter((dapps) => dapps.length > 0))
      ).pipe(
        map((value: [string, DappCache[]] ) => {
          const dappAddress = value[0];
          const dapps = value[1];
          return dapps.find(dapp => dapp.address === dappAddress);
        }),
        filter( (item) => item && true)
      ).subscribe( (dapp: DappCache ) => {
        log.debug('CHANGE DAPP ', dapp);
        this.currentDapp = dapp;
      });
    }

    this.web3Service.getBlockRange().subscribe((blockRange: any) => {
      if ((blockRange) && (this.events.observers.length > 0)) {
        this.listeners.forEach((listener: Listener) => {
          const options = {};
          if (listener.filter) {
            options['filter'] = listener.filter;
          }
          options['fromBlock'] = blockRange.fromBlock;
          options['toBlock'] = blockRange.toBlock;

          this.getContract().getPastEvents(listener.eventName,
            options, (err: any, events: any) => {
              if (events) {
                events.forEach((event: any) => {
                  this.publishEvent(event);
                });
              }
            });

        });
      }
    });
  }

  public getContractAddress() {
    if ( this.currentDapp && this.currentDapp.contractAliases ) {
      const alias = this.currentDapp.contractAliases.find((item) => `0x${item.bloomenContractAddress}`.toLowerCase() === this.defaultAddress.toLowerCase() );
      if (alias) {
        return `0x${alias.newContractAddress}`;
      } else {
        return this.defaultAddress;
      }
    } else {
      return this.defaultAddress;
    }
  }

  public getContract() {

    const contractAddress =  this.getContractAddress();

    if (! this.myContracts[contractAddress]) {
      this.myContracts[contractAddress] = this.web3Service.createContract(this.abi, contractAddress);
    }
    return this.myContracts[contractAddress];
  }

  public getEvents(): Observable<any> {
    return this.events.asObservable();
  }

  protected addEventListener(listener: Listener) {
    this.listeners.push(listener);
  }

  protected updateAddress(newAddress: string) {
    this.args.from = newAddress;
    this.address = newAddress;
  }

  protected clearListeners() {
    this.listeners = [];
  }
  private publishEvent(event: any) {
    this.events.next(event);
  }


}
