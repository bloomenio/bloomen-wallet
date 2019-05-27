import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { from } from 'rxjs';

// Store
import { Store } from '@ngrx/store';


// Constants
import { withLatestFrom, tap, switchMap, map } from 'rxjs/operators';

// Actions
import * as fromActions from './device-identity.actions';
import { Logger } from '@services/logger/logger.service';
import { DeviceIdentityStateModel } from '@core/models/device-identity-state.model';
import { DeviceIdentityDatabaseService } from '@db/device-identity-database.service';
import { DEVICE_IDENTITY_CONSTANTS } from '@core/constants/device-identity.constants';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DevicesContract } from '@core/core.module';

const log = new Logger('device-identity.effects');

@Injectable()
export class DeviceIdentityEffects {

    constructor(
        private actions$: Actions<fromActions.DeviceIdentityActionActions>,
        private store: Store<DeviceIdentityStateModel>,
        private deviceService: DeviceDetectorService,
        private devicesContract: DevicesContract,
        private deviceIdentityDatabaseService: DeviceIdentityDatabaseService,
    ) { }


    @Effect() public initDeviceIdentity = this.actions$.pipe(
        ofType(fromActions.DeviceIdentityActionTypes.INIT_DEVICE_IDENTITY),
        switchMap(() => {
            return from(this.deviceIdentityDatabaseService.get(DEVICE_IDENTITY_CONSTANTS.DEVICE_IDENTITY).pipe(
                map((identity) => {
                    if (!identity) {
                        return new fromActions.ChangeIdentity();
                    } else {
                        return new fromActions.InitDeviceIdentitySuccess({ id: identity });
                    }
                })
            ));
        })
    );

    @Effect() public changeDeviceIdentity = this.actions$.pipe(
        ofType(fromActions.DeviceIdentityActionTypes.CHANGE_DEVICE_IDENTITY),
        switchMap(() => {
            const deviceInfo = this.deviceService.getDeviceInfo();
            const deviceType = this.deviceService.isDesktop() ? 'Desktop' :
                this.deviceService.isMobile() ? 'Mobile' :
                    this.deviceService.isTablet() ? 'Tablet' : 'Unknow';
            const newIndentity = 'os:' + deviceInfo.os + ' browser:' + deviceInfo.browser
                + ' deviceType:' + deviceType + ' timestamp:' + new Date().toTimeString();

            return from(this.deviceIdentityDatabaseService.set(DEVICE_IDENTITY_CONSTANTS.DEVICE_IDENTITY, newIndentity).pipe(
                map(() => new fromActions.ChangeIdentitySuccess({ id: newIndentity }))
            ));
        })
    );

}





