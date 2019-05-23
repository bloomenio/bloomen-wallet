import { createFeatureSelector, createSelector } from '@ngrx/store';

// Model
import { DeviceIdentityStateModel } from '@core/models/device-identity-state.model';

// Reducer
import * as fromReducer from './device-identity.reducer';


export const getDeviceIdentity = createFeatureSelector<DeviceIdentityStateModel>('deviceIdentity');

// getTheme
export const getIdentity = createSelector(getDeviceIdentity, fromReducer.getIdentity);
