import { Action } from '@ngrx/store';

export enum BalanceActionTypes {
    INIT_BALANCE_EVENT = '[Balance] Init balance events',
    CHANGE_BALANCE = '[Balance] Change balance',
}

export class InitBalanceEvents implements Action {
    public readonly type = BalanceActionTypes.INIT_BALANCE_EVENT;

}
export class ChangeBalance implements Action {
    public readonly type = BalanceActionTypes.CHANGE_BALANCE;
    constructor(public readonly payload: { balance: string }) { }
}

export type BalanceActions = InitBalanceEvents | ChangeBalance;
