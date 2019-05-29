import { createFeatureSelector, createSelector } from '@ngrx/store';

// Reducer
import * as fromReducer from './purchases.reducer';


export const PurchasesState = createFeatureSelector<fromReducer.PurchasesState>('purchases');

export const { selectAll: selectAllPurchases, selectIds } = fromReducer.purchaseAdapter.getSelectors(PurchasesState);

export const getPageCount = createSelector(PurchasesState, fromReducer.getPageCount);

