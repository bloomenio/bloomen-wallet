import { createFeatureSelector, createSelector } from '@ngrx/store';

// Reducer
import * as fromReducer from './balance.reducer';


export const BalanceState = createFeatureSelector<fromReducer.BalanceState>('balance');

export const { selectAll: selectAllBalance, selectIds } = fromReducer.balanceAdapter.getSelectors(BalanceState);

export const getBalanceByAddress = createSelector(BalanceState, fromReducer.getBalanceByAddress);
