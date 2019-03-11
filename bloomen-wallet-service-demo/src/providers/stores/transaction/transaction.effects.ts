import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { union } from 'lodash';

// Constants
import { map, switchMap } from 'rxjs/operators';

// Actions
import * as fromActions from './transaction.actions';
import { Logger } from '@services/logger/logger.service';

import { from } from 'rxjs';
import { Store } from '@ngrx/store';
import { TransactionDatabaseService } from '@db/transaction-database.service';
import { TransactionModel } from '@core/models/transaction.model';

const log = new Logger('transacation.effects');

@Injectable()
export class TransactionEffects {

    constructor(
        private actions$: Actions<fromActions.TransactionActions>,
        private transactionDatabaseService: TransactionDatabaseService,
        private store: Store<any>
    ) { }

    @Effect({ dispatch: false }) public initTransaction = this.actions$.pipe(
        ofType(fromActions.TranscationActionTypes.INIT_TRANSACTION),
        map(() => {
            this.transactionDatabaseService.getAll().toPromise().then(transactions => {
                transactions.forEach(transaction => {
                    this.store.dispatch(new fromActions.AddTransactionSuccess(transaction));
                });

            });
        })
    );

    @Effect() public addTransaction = this.actions$.pipe(
        ofType(fromActions.TranscationActionTypes.ADD_TRANSACTION),
        map((action) => {
            const transaction: TransactionModel = {
                address: action.payload.address,
                transactions: action.payload.transactions
            };
            this.transactionDatabaseService.set(transaction.address, transaction);
            return new fromActions.AddTransactionSuccess(transaction);
        })
    );

    @Effect() public removeTransaction = this.actions$.pipe(
        ofType(fromActions.TranscationActionTypes.REMOVE_TRANSACTION),
        switchMap((action) => {
            return from(this.transactionDatabaseService.remove(action.payload.address).pipe(
                map(() => new fromActions.RemoveTransactionSuccess({ address: action.payload.address }))
            ));
        })
    );
}





