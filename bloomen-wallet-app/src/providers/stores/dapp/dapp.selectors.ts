import { createFeatureSelector, createSelector } from '@ngrx/store';

// Reducer
import * as fromReducer from './dapp.reducer';


export const DappState = createFeatureSelector<fromReducer.DappState>('dapps');


export const { selectAll: selectAllDapp, selectIds } = fromReducer.dappAdapter.getSelectors(DappState);
