import { Action } from '@ngrx/store';
import { TransactionModel } from '@core/models/transaction.model';

export enum TranscationActionTypes {
    INIT_TRANSACTION = '[Transcation] Init Transcation',
    INIT_TRANSACTION_SUCCESS = '[Transcation] Init Transcation success',
    ADD_TRANSACTION = '[Transcation] add Transcation',
    ADD_TRANSACTION_SUCCESS = '[Transcation] add Transcation success',
    REMOVE_TRANSACTION = '[Transcation] remove Transcation',
    REMOVE_TRANSACTION_SUCCESS = '[Transcation] remove Transcation success',
    REFRESH_TRANSACTION = '[Transcation] refresh Transcations'

}

export class AddTransaction implements Action {
    public readonly type = TranscationActionTypes.ADD_TRANSACTION;
    constructor(public readonly payload: { address: string, transactions: TransactionModel.Transaction[] }) { }
}

export class AddTransactionSuccess implements Action {
    public readonly type = TranscationActionTypes.ADD_TRANSACTION_SUCCESS;
    constructor(public readonly payload: TransactionModel) { }
}

export class InitTransaction implements Action {
    public readonly type = TranscationActionTypes.INIT_TRANSACTION;
}

export class InitTransactionSuccess implements Action {
    public readonly type = TranscationActionTypes.INIT_TRANSACTION_SUCCESS;
    constructor(public readonly payload: TransactionModel[]) { }
}

export class RemoveTransaction implements Action {
    public readonly type = TranscationActionTypes.REMOVE_TRANSACTION;
    constructor(public readonly payload: { address: string }) { }
}

export class RemoveTransactionSuccess implements Action {
    public readonly type = TranscationActionTypes.REMOVE_TRANSACTION_SUCCESS;
    constructor(public readonly payload: { address: string }) { }
}

export type TransactionActions = AddTransaction | InitTransaction | InitTransactionSuccess | AddTransactionSuccess |
    RemoveTransaction | RemoveTransactionSuccess;
