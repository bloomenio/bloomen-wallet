
import { createFeatureSelector, createSelector } from '@ngrx/store';

// Reducer
import * as fromReducer from './devices.reducer';


export const DevicesState = createFeatureSelector<fromReducer.DeviceState>('devices');

export const { selectAll: selectAllDevices, selectIds } = fromReducer.deviceAdapter.getSelectors(DevicesState);

export const getPageCount = createSelector(DevicesState, fromReducer.getPageCount);
