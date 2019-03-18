import { Action } from '@ngrx/store';
import { BalanceModel } from '@core/models/balance.model';

export enum BalanceActionTypes {
    INIT_BALANCE = '[Balance] Init Balance',
    INIT_BALANCE_SUCCESS = '[Balance] Init Balance success',
    ADD_BALANCE = '[Balance] add Balance',
    ADD_BALANCE_SUCCESS = '[Balance] add Balance success',
    REMOVE_BALANCE = '[Balance] remove Balance',
    REMOVE_BALANCE_SUCCESS = '[Balance] remove Balance success'

}

export class AddBalance implements Action {
    public readonly type = BalanceActionTypes.ADD_BALANCE;
    constructor(public readonly payload: BalanceModel) { }
}

export class AddBalanceSuccess implements Action {
    public readonly type = BalanceActionTypes.ADD_BALANCE_SUCCESS;
    constructor(public readonly payload: BalanceModel) { }
}

export class InitBalance implements Action {
    public readonly type = BalanceActionTypes.INIT_BALANCE;
}

export class InitBalanceSuccess implements Action {
    public readonly type = BalanceActionTypes.INIT_BALANCE_SUCCESS;
    constructor(public readonly payload: BalanceModel[]) { }
}

export class RemoveBalanceSuccess implements Action {
    public readonly type = BalanceActionTypes.REMOVE_BALANCE_SUCCESS;
    constructor(public readonly payload: { address: string }) { }
}

export type BalanceActions = AddBalance | InitBalance | InitBalanceSuccess | AddBalanceSuccess | RemoveBalanceSuccess;
