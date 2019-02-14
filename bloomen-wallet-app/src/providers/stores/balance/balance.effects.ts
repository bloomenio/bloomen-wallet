import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

// Store
import { Store } from '@ngrx/store';

// Constants
import { switchMap } from 'rxjs/operators';

// Actions
import * as fromBalanceActions from './balance.actions';
import * as fromtxActivityActions from '@stores/tx-activity/tx-activity.actions';
import * as fromPurchasesActions from '@stores/purchases/purchases.actions';

import { Logger } from '@services/logger/logger.service';


import { ERC223Contract } from '@services/web3/contracts';
import { Web3Service } from '@services/web3/web3.service';
import { BalanceModel } from '@core/models/balance.model';

const log = new Logger('balance.effects');

@Injectable()
export class BalanceEffects {

    constructor(
        private actions$: Actions<fromBalanceActions.BalanceActions>,
        private store: Store<BalanceModel>,
        private erc223: ERC223Contract,
        private web3Service: Web3Service,
    ) {

        this.web3Service.ready(() => {
            this.store.dispatch(new fromBalanceActions.InitBalanceEvents);
        });

        this.erc223.getEvents().subscribe((event: any) => {
            if (event) {
                this.web3Service.ready(() => {
                    this.store.dispatch(new fromBalanceActions.InitBalanceEvents);
                    this.store.dispatch(new fromtxActivityActions.InitTxActivity({ page: 1 }));
                    this.store.dispatch(new fromPurchasesActions.UpdatePurchases({ page: 1 }));
                });
            }
        });
    }

    @Effect() public subscribeEvents = this.actions$.pipe(
        ofType(fromBalanceActions.BalanceActionTypes.INIT_BALANCE_EVENT),
        switchMap(() => {
            return this.erc223.getBalance().then((value: string) => {
                return new fromBalanceActions.ChangeBalance({ balance: value });
            });
        })
    );
}





