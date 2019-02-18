import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

// Constants
import { map, switchMap } from 'rxjs/operators';

// Actions
import * as fromActions from './mnemonic.actions';
import { Logger } from '@services/logger/logger.service';

import * as fromBalanceAction from '@stores/balance/balance.actions';
import * as fromTxActivityAction from '@stores/tx-activity/tx-activity.actions';
import * as fromDevicesAction from '@stores/devices/devices.actions';
import * as fromPurchasesAction from '@stores/purchases/purchases.actions';

import { MnemonicDatabaseService } from '@db/mnemonic-database.service';
import { from } from 'rxjs';
import { Web3Service } from '@services/web3/web3.service';
import { MnemonicModel } from '@core/models/mnemonic.model';
import { BalanceModel } from '@core/models/balance.model';

const log = new Logger('mnemonic.effects');

@Injectable()
export class MnemonicEffects {

    constructor(
        private actions$: Actions<fromActions.MnemonicActions>,
        private mnemonicDatabaseService: MnemonicDatabaseService,
        private web3Service: Web3Service,
        private store: Store<BalanceModel>
    ) { }

    @Effect() public initMnemonic = this.actions$.pipe(
        ofType(fromActions.MnemonicActionTypes.INIT_MNEMONIC),
        switchMap(() => {
            return from(this.mnemonicDatabaseService.getAll().pipe(
                map((value) => new fromActions.InitMnemonicSuccess(value))
            ));
        })
    );

    @Effect() public addMnemonic = this.actions$.pipe(
        ofType(fromActions.MnemonicActionTypes.ADD_MNEMONIC),
        switchMap((action) => {
            let mnemonic: MnemonicModel;
            if (action.payload.randomSeed) {
                mnemonic = {
                    address: action.payload.address,
                    randomSeed: action.payload.randomSeed
                };
            } else {
                mnemonic = {
                    randomSeed: this.web3Service.generateRandomSeed(),
                    address: action.payload.address
                };
            }
            return from(this.mnemonicDatabaseService.set(mnemonic.address, mnemonic).pipe(
                map(() => new fromActions.AddMnemonicSuccess(mnemonic))
            ));
        })
    );

    @Effect() public removeMnemonic = this.actions$.pipe(
        ofType(fromActions.MnemonicActionTypes.REMOVE_MNEMONIC),
        switchMap((action) => {
            return from(this.mnemonicDatabaseService.remove(action.payload.address).pipe(
                map(() => new fromActions.RemoveMnemonicSuccess({ address: action.payload.address }))
            ));
        })
    );

    @Effect({ dispatch: false }) public changeWallet = this.actions$.pipe(
        ofType(fromActions.MnemonicActionTypes.CHANGE_WALLET),
        map((action) => {
            this.store.dispatch(new fromBalanceAction.ChangeBalance({ balance: '-1' }));
            this.web3Service.ready(() => {
                this.web3Service.changeWallet(action.payload.randomSeed).then(() => {
                    this.store.dispatch(new fromBalanceAction.InitBalanceEvents());
                    this.store.dispatch(new fromTxActivityAction.InitTxActivity({ page: 1 }));
                    this.store.dispatch(new fromDevicesAction.InitDevices());
                    this.store.dispatch(new fromPurchasesAction.InitPurchases());
                });
            });
        })
    );
}





