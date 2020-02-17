import { ApplicationDataStateModel } from '@models/application-data-state.model';
import { ApplicationDataActionTypes, ApplicationDataActions } from './application-data.actions';

export function applicationDataReducer(state: ApplicationDataStateModel, action: ApplicationDataActions): ApplicationDataStateModel {
    switch (action.type) {
        case ApplicationDataActionTypes.CHANGE_FIRST_RUN:
        case ApplicationDataActionTypes.CHANGE_THEME:
        case ApplicationDataActionTypes.CHANGE_LANGUAGE:
        case ApplicationDataActionTypes.CHANGE_INITIAL_DAPP:
            return { ...{}, ...state, ...action.payload, };
        case ApplicationDataActionTypes.CHANGE_RPC:
            const newState = {...state};
            newState.rpc = action.payload.rpc;
            newState.secret = action.payload.secret;
            return newState;
        default:
            return state;
    }
}

export const getIsFirstRun = (state: ApplicationDataStateModel) => state ? state.isFirstRun : undefined;

export const getTheme = (state: ApplicationDataStateModel) => state ? state.theme : undefined;

export const getLanguage = (state: ApplicationDataStateModel) => state ? state.language : undefined;

export const getCurrentDappAddress = (state: ApplicationDataStateModel) => state ? state.currentDappAddress : undefined;

export const getRpc = (state: ApplicationDataStateModel) => state ? state.rpc : undefined;

export const getSecret = (state: ApplicationDataStateModel) => state ? state.secret : undefined;
