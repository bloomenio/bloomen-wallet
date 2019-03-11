import { BalanceActionTypes, BalanceActions } from './balance.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { BalanceModel } from '@core/models/balance.model';

export interface BalanceState extends EntityState<BalanceModel> { }

export const balanceAdapter = createEntityAdapter<BalanceModel>({
    selectId: (balance: BalanceModel) => balance.address
});

const balanceInitialState: BalanceState = balanceAdapter.getInitialState();

export function balanceReducer(state: BalanceState = balanceInitialState, action: BalanceActions): BalanceState {
    switch (action.type) {
        case BalanceActionTypes.INIT_BALANCE_SUCCESS:
            return balanceAdapter.addAll(action.payload, state);

        case BalanceActionTypes.ADD_BALANCE_SUCCESS:
            return balanceAdapter.upsertOne(action.payload, state);

        case BalanceActionTypes.REMOVE_BALANCE_SUCCESS:
            return balanceAdapter.removeOne(action.payload.address, state);
        default:
            return state;
    }
}

export const getBalanceByAddress = (state: BalanceState, address: string) => state.entities[address];
