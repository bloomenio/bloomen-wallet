import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

// Environment
import { environment } from '@env/environment';

// Constants
import { map } from 'rxjs/operators';

// Actions
import * as fromActions from './balance.actions';
import { Logger } from '@services/logger/logger.service';

import { CollaboratorDatabaseService } from '@db/collaborator-database.service';
import { interval } from 'rxjs';
import { Web3Service } from '@services/web3/web3.service';
import { Store } from '@ngrx/store';
import { ERC223Contract } from '@core/core.module';

const log = new Logger('balance.effects');

@Injectable()
export class BalanceEffects {

    constructor(
        private actions$: Actions<fromActions.BalanceActions>,
        private collaboratorDatabaseService: CollaboratorDatabaseService,
        private web3Service: Web3Service,
        private store: Store<any>,
        private erc223: ERC223Contract
    ) {
        this.web3Service.ready(() => {
            interval(environment.eth.ethBalancePollingTime).subscribe(() => {
                this.store.dispatch(new fromActions.InitBalance);
            });
        });
    }

    @Effect({ dispatch: false }) public initBalance = this.actions$.pipe(
        ofType(fromActions.BalanceActionTypes.INIT_BALANCE),
        map(() => {
            this.web3Service.ready(() => {
                this.collaboratorDatabaseService.getAllAddresses().toPromise().then(addresses => {
                    addresses.forEach(async address => {
                        try {
                            const balance = await this.erc223.getBalanceByAddress(address);
                            this.store.dispatch(new fromActions.AddBalanceSuccess({ address, balance }));
                        } catch (error) {
                            this.store.dispatch(new fromActions.AddBalanceSuccess({ address, balance: undefined }));
                        }
                    });
                });
            });
        })
    );

    @Effect({ dispatch: false }) public addBalance = this.actions$.pipe(
        ofType(fromActions.BalanceActionTypes.ADD_BALANCE),
        map((action) => {
            this.erc223.getBalanceByAddress(action.payload.address).then((balance) => {
                this.store.dispatch(new fromActions.AddBalanceSuccess({ address: action.payload.address, balance }));
            });
        })
    );
}





