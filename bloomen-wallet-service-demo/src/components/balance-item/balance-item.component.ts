// Basic
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ERC223Contract } from '@core/core.module';
import { Logger } from '@services/logger/logger.service';
import { Web3Service } from '@services/web3/web3.service';
import { CollaboratorModel } from '@core/models/collaborator.model';
import { Subscription } from 'rxjs';
import { TransactionModel } from '@core/models/transaction.model';
import { Store } from '@ngrx/store';
import * as fromTransactionActions from '@stores/transaction/transaction.actions';
import * as fromTransactionSelectors from '@stores/transaction/transaction.selectors';

const log = new Logger('balance-item');

/**
 * balance item component
 */
@Component({
  selector: 'blo-balance-item',
  templateUrl: 'balance-item.component.html',
  styleUrls: ['balance-item.component.scss']
})
export class BalanceItemComponent implements OnInit, OnDestroy {

  @Input() public collaborator: CollaboratorModel;
  @Output() public readonly clickRemove = new EventEmitter();

  public balance: number;

  public transactions: TransactionModel.Transaction[];

  public erc223$: Subscription;

  constructor(
    private erc223: ERC223Contract,
    private web3Service: Web3Service,
    private store: Store<TransactionModel>
  ) { }

  public async ngOnInit() {
    this.transactions = [];
    this.web3Service.ready(async () => {

      // First balance
      this.balance = await this.erc223.getBalanceByAddress(this.collaborator.receptor);

      // On movement get balance again
      this.erc223$ = this.erc223.getEvents().subscribe((event: any) => {
        this.erc223.getBalanceByAddress(this.collaborator.receptor).then((balance: number) => {
          this.doTransaction(balance);
          this.balance = balance;
        });
      });
    });

    this.store.select(fromTransactionSelectors.getTransactionByAddress, this.collaborator.receptor).subscribe((transactionItem: TransactionModel) => {
      if (transactionItem) {
        const transactions = [...transactionItem.transactions];
        this.transactions = transactions.sort((a, b) => {
          return b.date - a.date;
        });
      }
    });
  }

  private doTransaction(balance: number) {
    const transactions = [...this.transactions];
    transactions.push({
      amount: balance - this.balance,
      date: new Date().getTime()
    });
    this.store.dispatch(new fromTransactionActions.AddTransaction({ address: this.collaborator.receptor, transactions: transactions }));
  }

  public removeBalanceItem(address: string) {
    this.clickRemove.emit(address);
  }

  public ngOnDestroy() {
    this.erc223$.unsubscribe();
  }
}
