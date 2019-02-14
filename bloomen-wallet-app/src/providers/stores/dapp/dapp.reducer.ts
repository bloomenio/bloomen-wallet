import { DappActions, DappActionTypes } from './dapp.actions';
import { DappCache } from '@core/models/dapp.model';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface DappState extends EntityState<DappCache> { }

export const dappAdapter = createEntityAdapter<DappCache>({
    selectId: (dapp: DappCache) => dapp.address
});

const InitialState: DappState = dappAdapter.getInitialState();

export function dappReducer(state: DappState = InitialState, action: DappActions): DappState {
    switch (action.type) {
        case DappActionTypes.ADD_DAPP_SUCCESS:
            return dappAdapter.upsertOne(action.payload, state);

        case DappActionTypes.REFRESH_DAPP_SUCCESS: {
            return dappAdapter.updateOne(action.payload, state);
        }

        case DappActionTypes.REMOVE_DAPP_SUCCESS:
            return dappAdapter.removeOne(action.payload.address, state);

        default:
            return state;
    }
}
