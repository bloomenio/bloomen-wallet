import { TranscationActionTypes, TransactionActions } from './transaction.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { TransactionModel } from '@core/models/transaction.model';

export interface TransactionState extends EntityState<TransactionModel> { }

export const transactionAdapter = createEntityAdapter<TransactionModel>({
    selectId: (transaction: TransactionModel) => transaction.address
});

const transactionInitialState: TransactionState = transactionAdapter.getInitialState();

export function transactionReducer(state: TransactionState = transactionInitialState, action: TransactionActions): TransactionState {
    switch (action.type) {
        case TranscationActionTypes.INIT_TRANSACTION_SUCCESS:
            return transactionAdapter.addAll(action.payload, state);

        case TranscationActionTypes.ADD_TRANSACTION_SUCCESS:
            return transactionAdapter.upsertOne(action.payload, state);

        case TranscationActionTypes.REMOVE_TRANSACTION_SUCCESS:
            return transactionAdapter.removeOne(action.payload.address, state);

        default:
            return state;
    }
}

export const getTransactionByAddress = (state: TransactionState, address: string) => state.entities[address];

