import { DeviceActionTypes, DeviceActions } from './devices.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { DeviceModel } from '@core/models/device.model';

export interface DeviceState extends EntityState<DeviceModel> {
    totalPages: number;
}

export const deviceAdapter = createEntityAdapter<DeviceModel>({
    selectId: (device: DeviceModel) => device.id
});

const deviceInitialState: DeviceState = deviceAdapter.getInitialState({
    totalPages: 0
});

export function DeviceReducer(state: DeviceState = deviceInitialState, action: DeviceActions): DeviceState {
    switch (action.type) {

        case DeviceActionTypes.INIT_DEVICES_SUCCESS: {
            return deviceAdapter.addAll(action.payload, state);
        }
        case DeviceActionTypes.UPDATE_DEVICES_SUCCESS: {
            return deviceAdapter.addMany(action.payload, state);
        }
        case DeviceActionTypes.UPDATE_DEVICE_PAGES_COUNT_SUCCESS: {
            return { ...state, ...action.payload };
        }
        case DeviceActionTypes.REMOVE_DEVICE_SUCCESS: {
            return deviceAdapter.removeOne(action.payload.id, state);
        }

        default:
            return state;
    }
}

export const getPageCount = (state: DeviceState) => state.totalPages;
