import { AppState } from '@core/core.state';

export interface DeviceIdentityStateModel {
    id: string;
}

export interface State extends AppState {
    deviceIdentityStateModel: DeviceIdentityStateModel;
}
