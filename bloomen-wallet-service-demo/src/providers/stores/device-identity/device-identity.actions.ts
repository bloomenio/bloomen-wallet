import { Action } from '@ngrx/store';
import { DeviceIdentityStateModel } from '@core/models/device-identity-state.model';

export enum DeviceIdentityActionTypes {
    INIT_DEVICE_IDENTITY = '[Device Identity] init device identity',
    INIT_DEVICE_IDENTITY_SUCCESS = '[Device Identity] init device identity success',
    CHANGE_DEVICE_IDENTITY = '[Device Identity] change device identity',
    CHANGE_DEVICE_IDENTITY_SUCCESS = '[Device Identity] change device identity success',
}

export class ChangeIdentity implements Action {
    public readonly type = DeviceIdentityActionTypes.CHANGE_DEVICE_IDENTITY;
    constructor() { }
}

export class ChangeIdentitySuccess implements Action {
    public readonly type = DeviceIdentityActionTypes.CHANGE_DEVICE_IDENTITY_SUCCESS;
    constructor(public readonly payload?: DeviceIdentityStateModel) { }
}

export class InitDeviceIdentity implements Action {
    public readonly type = DeviceIdentityActionTypes.INIT_DEVICE_IDENTITY;
}

export class InitDeviceIdentitySuccess implements Action {
    public readonly type = DeviceIdentityActionTypes.INIT_DEVICE_IDENTITY_SUCCESS;
    constructor(public readonly payload?: DeviceIdentityStateModel) { }
}

export type DeviceIdentityActionActions = ChangeIdentity | ChangeIdentitySuccess |  InitDeviceIdentity | InitDeviceIdentitySuccess;
