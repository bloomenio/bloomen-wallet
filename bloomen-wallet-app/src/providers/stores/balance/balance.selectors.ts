import { createFeatureSelector, createSelector } from '@ngrx/store';

// Reducer
import * as fromReducer from './balance.reducer';
import { BalanceModel } from '@core/models/balance.model';


export const balance = createFeatureSelector<BalanceModel>('balance');

// get Balance
export const getBalance = createSelector(balance, fromReducer.getBalance);
