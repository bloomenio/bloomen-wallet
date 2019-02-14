import { TxActivityActionTypes, TxActivityActions } from './tx-activity.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { TxActivityModel } from '@core/models/tx-activity.model';

export interface TxActivityState extends EntityState<TxActivityModel> { }

export const txAdapter = createEntityAdapter<TxActivityModel>();

const txActivityInitialState: TxActivityState = txAdapter.getInitialState({});

export function TxActivityReducer(state: TxActivityState = txActivityInitialState, action: TxActivityActions): TxActivityState {
    switch (action.type) {

        case TxActivityActionTypes.INIT_TX_ACTIVITY_SUCCESS: {
            return txAdapter.addAll(action.payload, state);
        }

        case TxActivityActionTypes.MORE_TX_ACTIVITY_SUCCESS: {
            return txAdapter.addMany(action.payload, state);
        }

        case TxActivityActionTypes.REMOVE_TX_ACTIVITY: {
            return txAdapter.removeAll(state);
        }


        default:
            return state;
    }
}
