import { Action } from '@ngrx/store';
import { TxActivityModel } from '@core/models/tx-activity.model';

export enum TxActivityActionTypes {
    INIT_TX_ACTIVITY = '[Transaction activity] Init tx activity',
    INIT_TX_ACTIVITY_SUCCESS = '[Transaction activity] Init tx activity success',
    MORE_TX_ACTIVITY = '[Transaction activity] more tx activity',
    MORE_TX_ACTIVITY_SUCCESS = '[Transaction activity] more tx activity success',
    REMOVE_TX_ACTIVITY = '[Transaction activity] Remove all tx activity',
    INCREASE_PAGE = '[Transaction activity] increase page',
    RESET_PAGE = '[Transaction activity] reset page'
}

export class InitTxActivity implements Action {
    public readonly type = TxActivityActionTypes.INIT_TX_ACTIVITY;
    constructor(public readonly payload: { page: number }) { }
}


export class InitTxActivitySuccess implements Action {
    public readonly type = TxActivityActionTypes.INIT_TX_ACTIVITY_SUCCESS;
    constructor(public readonly payload: TxActivityModel[]) { }
}

export class RemoveTxActivity implements Action {
    public readonly type = TxActivityActionTypes.REMOVE_TX_ACTIVITY;
}

export class MoreTxActivity implements Action {
    public readonly type = TxActivityActionTypes.MORE_TX_ACTIVITY;
    constructor(public readonly payload: { page: number }) { }
}

export class MoreTxActivitySuccess implements Action {
    public readonly type = TxActivityActionTypes.MORE_TX_ACTIVITY_SUCCESS;
    constructor(public readonly payload: TxActivityModel[]) { }
}


export type TxActivityActions = InitTxActivity | InitTxActivitySuccess | RemoveTxActivity | MoreTxActivity | MoreTxActivitySuccess;
