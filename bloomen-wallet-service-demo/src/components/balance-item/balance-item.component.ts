// Basic
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@services/logger/logger.service';
import { CollaboratorModel } from '@core/models/collaborator.model';
import { Subscription } from 'rxjs';
import { TransactionModel } from '@core/models/transaction.model';
import { Store } from '@ngrx/store';

import * as fromTransactionActions from '@stores/transaction/transaction.actions';
import * as fromTransactionSelectors from '@stores/transaction/transaction.selectors';

import * as fromBalanceSelectors from '@stores/balance/balance.selectors';
import { skipWhile } from 'rxjs/operators';

const log = new Logger('balance-item');

/**
 * balance item component
 */
@Component({
  selector: 'blo-balance-item',
  templateUrl: 'balance-item.component.html',
  styleUrls: ['balance-item.component.scss']
})
export class BalanceItemComponent implements OnInit {

  @Input() public collaborator: CollaboratorModel;
  @Output() public readonly clickRemove = new EventEmitter();

  public balance: number;

  public transactions: TransactionModel.Transaction[];

  public erc223$: Subscription;

  constructor(
    private store: Store<any>
  ) { }

  public async ngOnInit() {
    this.transactions = [];
    this.balance = -1;

    this.store.select(fromBalanceSelectors.getBalanceByAddress, this.collaborator.receptor)
      .pipe(
        skipWhile((balanceItem) => !balanceItem)
      ).subscribe((balanceItem) => {
        if (balanceItem && balanceItem.balance && this.balance !== -1 && this.balance - balanceItem.balance !== 0) {
          this.doTransaction(balanceItem.balance);
        }
        this.balance = balanceItem.balance;
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
}
