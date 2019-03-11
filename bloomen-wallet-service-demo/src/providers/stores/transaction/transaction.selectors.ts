import { createFeatureSelector, createSelector } from '@ngrx/store';

// Reducer
import * as fromReducer from './transaction.reducer';


export const TransactionState = createFeatureSelector<fromReducer.TransactionState>('transactions');

export const { selectAll: selectAllTransaction, selectIds } = fromReducer.transactionAdapter.getSelectors(TransactionState);

export const getTransactionByAddress =  createSelector(TransactionState, fromReducer.getTransactionByAddress);
