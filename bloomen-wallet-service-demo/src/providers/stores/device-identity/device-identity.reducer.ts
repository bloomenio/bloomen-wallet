import { DeviceIdentityStateModel } from '@models/device-identity-state.model';
import { DeviceIdentityActionTypes, DeviceIdentityActionActions } from './device-identity.actions';

export function deviceIdentityReducer(state: DeviceIdentityStateModel, action: DeviceIdentityActionActions): DeviceIdentityStateModel {
    switch (action.type) {
        case DeviceIdentityActionTypes.CHANGE_DEVICE_IDENTITY_SUCCESS:
        case DeviceIdentityActionTypes.INIT_DEVICE_IDENTITY_SUCCESS:
            return { ...{}, ...state, ...action.payload };
        default:
            return state;
    }
}

export const getIdentity = (state: DeviceIdentityStateModel) => state ? state.id : undefined;
