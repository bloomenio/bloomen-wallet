// Basic
import { Observable, Subject } from 'rxjs';

// Environment
import { environment } from '@env/environment';

// Services
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';
import { Logger } from '@services/logger/logger.service';
import { ActivatedRoute } from '@angular/router';

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
  private defaultContract: any;

  private listeners: Listener[];

  constructor(
    protected web3Service: Web3Service,
    protected transactionService: TransactionService,
    private myActivatedRoute: ActivatedRoute,
    private abi: any,
    private defaultAddress: string
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
    return this.defaultAddress;
  }

  public getContract() {

    console.log( 'KOKO ===>>>', this.myActivatedRoute.snapshot.paramMap.get('address'));

    if (!this.defaultContract) {
      this.defaultContract = this.web3Service.createContract(this.abi, this.getContractAddress());
    }
    return this.defaultContract;
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
