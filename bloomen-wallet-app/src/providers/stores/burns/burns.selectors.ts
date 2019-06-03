
import { createFeatureSelector, createSelector } from '@ngrx/store';

// Reducer
import * as fromReducer from './burns.reducer';

export const BurnsState = createFeatureSelector<fromReducer.BurnState>('burns');

export const { selectAll: selectAllBurns, selectIds } = fromReducer.burnAdapter.getSelectors(BurnsState);

export const getPageCount = createSelector(BurnsState, fromReducer.getPageCount);
