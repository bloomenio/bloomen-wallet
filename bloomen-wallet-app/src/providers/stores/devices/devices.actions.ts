import { Action } from '@ngrx/store';
import { DeviceModel } from '@core/models/device.model';

export const FIRST_PAGE_INDEX = 1;
export const PAGE_SIZE = 10;

export enum DeviceActionTypes {
    INIT_DEVICES = '[Devices] Init devices',
    INIT_DEVICES_SUCCESS = '[Devices] Init devices success',
    UPDATE_DEVICES = '[Devices] Update devices',
    UPDATE_DEVICES_SUCCESS = '[Devices] Update devices success',
    UPDATE_DEVICE_PAGES_COUNT_SUCCESS = '[Devices] Update devices page count success',
    REMOVE_DEVICE = '[Devices] Remove device',
    REMOVE_DEVICE_SUCCESS = '[Devices] Remove device success',
}

export class InitDevices implements Action {
    public readonly type = DeviceActionTypes.INIT_DEVICES;
    constructor(public readonly payload: { dappId: string }) { }
}


export class InitDevicesSuccess implements Action {
    public readonly type = DeviceActionTypes.INIT_DEVICES_SUCCESS;
    constructor(public readonly payload: DeviceModel[]) { }
}

export class UpdateDevices implements Action {
    public readonly type = DeviceActionTypes.UPDATE_DEVICES;
    constructor(public readonly payload: { page: number, dappId: string }) { }
}

export class UpdateDevicesSuccess implements Action {
    public readonly type = DeviceActionTypes.UPDATE_DEVICES_SUCCESS;
    constructor(public readonly payload: DeviceModel[]) { }
}

export class UpdateDevicesPagesCountSuccess implements Action {
    public readonly type = DeviceActionTypes.UPDATE_DEVICE_PAGES_COUNT_SUCCESS;
    constructor(public readonly payload: { totalPages: number  }) { }
}

export class RemoveDevice implements Action {
    public readonly type = DeviceActionTypes.REMOVE_DEVICE;
    constructor(public readonly payload: DeviceModel) { }
}

export class RemoveDeviceSuccess implements Action {
    public readonly type = DeviceActionTypes.REMOVE_DEVICE_SUCCESS;
    constructor(public readonly payload: DeviceModel) { }
}


export type DeviceActions = InitDevices | InitDevicesSuccess
 | UpdateDevices | UpdateDevicesSuccess | UpdateDevicesPagesCountSuccess
 | RemoveDevice | RemoveDeviceSuccess;
