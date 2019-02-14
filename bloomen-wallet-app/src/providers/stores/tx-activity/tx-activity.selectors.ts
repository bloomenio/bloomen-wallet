import { createFeatureSelector } from '@ngrx/store';

// Reducer
import * as fromReducer from './tx-activity.reducer';


export const MnemonicState = createFeatureSelector<fromReducer.TxActivityState>('txActivity');

export const { selectAll: selectAllTxActivity, selectIds } = fromReducer.txAdapter.getSelectors(MnemonicState);
