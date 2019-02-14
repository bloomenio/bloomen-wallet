import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

// Constants
import { switchMap } from 'rxjs/operators';

// Actions
import * as fromActions from './tx-activity.actions';
import { Logger } from '@services/logger/logger.service';


import { MovementHistoryContract } from '@services/web3/contracts';
import { TxActivityModel } from '@core/models/tx-activity.model';

const log = new Logger('tx-activity.effects');

@Injectable()
export class TxActivityEffects {

    constructor(
        private actions$: Actions<fromActions.TxActivityActions>,
        private movementHistoryContract: MovementHistoryContract
    ) { }

    @Effect() public initTxActivity = this.actions$.pipe(
        ofType(
            fromActions.TxActivityActionTypes.INIT_TX_ACTIVITY
        ),
        switchMap((action) => {
            return this.movementHistoryContract.getMovements(action.payload.page).then((result: Array<Array<any>>) => {
                return new fromActions.InitTxActivitySuccess(this.constructTxArray(result));
            });
        })
    );

    @Effect() public moreTxActivity = this.actions$.pipe(
        ofType(
            fromActions.TxActivityActionTypes.MORE_TX_ACTIVITY
        ),
        switchMap((action) => {
            return this.movementHistoryContract.getMovements(action.payload.page).then((result: Array<Array<any>>) => {
                return new fromActions.MoreTxActivitySuccess(this.constructTxArray(result));
            });
        })
    );

    private constructTxArray(result): TxActivityModel[] {
        const txActivityArray: TxActivityModel[] = [];
        const txArray = result.filter((tx) => {
            return tx[3] !== '0x0000000000000000000000000000000000000000';
        });
        txArray.forEach((tx, index) => {
            txActivityArray.push({
                id: index + tx[2],
                amount: tx[0],
                txName: tx[1],
                epoch: tx[2] * 1000,
                originTx: tx[3]
            } as TxActivityModel);
        });
        return txActivityArray;
    }
}





