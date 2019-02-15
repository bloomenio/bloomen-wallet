import { createFeatureSelector, createSelector } from '@ngrx/store';

// Reducer
import * as fromReducer from './tx-activity.reducer';


export const TxActivityState = createFeatureSelector<fromReducer.TxActivityState>('txActivity');

export const { selectAll: selectAllTxActivity, selectIds } = fromReducer.txAdapter.getSelectors(TxActivityState);

export const getIsLoading = createSelector(TxActivityState, fromReducer.getIsLoading);
