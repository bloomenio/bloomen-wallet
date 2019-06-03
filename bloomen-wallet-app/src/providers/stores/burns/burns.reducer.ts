import { BurnActions, BurnActionTypes } from './burns.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { BurnModel } from '@core/models/burn.model';

export interface BurnState extends EntityState<BurnModel> {
    totalPages: number;
}

export const burnAdapter = createEntityAdapter<BurnModel>({
    selectId: (burn: BurnModel) => burn.id
});

const burnInitialState: BurnState = burnAdapter.getInitialState({
    totalPages: 0
});

export function BurnReducer(state: BurnState = burnInitialState, action: BurnActions): BurnState {
    switch (action.type) {

        case BurnActionTypes.INIT_BURNS_SUCCESS: {
            return burnAdapter.addAll(action.payload, state);
        }
        case BurnActionTypes.UPDATE_BURNS_SUCCESS: {
            return burnAdapter.addMany(action.payload, state);
        }
        case BurnActionTypes.UPDATE_BURN_PAGES_COUNT_SUCCESS: {
            return { ...state, ...action.payload };
        }
        default:
            return state;
    }
}

export const getPageCount = (state: BurnState) => state.totalPages;
