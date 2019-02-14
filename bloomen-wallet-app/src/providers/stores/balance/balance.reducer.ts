import { BalanceActionTypes, BalanceActions } from './balance.actions';
import { BalanceModel } from '@core/models/balance.model';

export const InitialState: BalanceModel = {
    balance: '0'
};

export function balanceReducer(state: BalanceModel = InitialState, action: BalanceActions): BalanceModel {
    switch (action.type) {

        case BalanceActionTypes.CHANGE_BALANCE: {
            return { ...state, ...action.payload };
        }
        default:
            return state;
    }
}

export const getBalance = (state: BalanceModel) => state.balance;
