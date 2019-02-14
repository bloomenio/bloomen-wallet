import { createFeatureSelector, createSelector } from '@ngrx/store';

// Reducer
import * as fromReducer from './mnemonic.reducer';


export const MnemonicState = createFeatureSelector<fromReducer.MnemonicState>('mnemonic');

export const { selectAll: selectAllMnemonics, selectIds } = fromReducer.mnemonicAdapter.getSelectors(MnemonicState);
