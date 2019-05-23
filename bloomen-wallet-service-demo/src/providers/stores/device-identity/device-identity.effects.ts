import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { from } from 'rxjs';

// Store
import { Store } from '@ngrx/store';


// Constants
import { withLatestFrom, tap, switchMap, map} from 'rxjs/operators';

// Actions
import * as fromActions from './device-identity.actions';
import { Logger } from '@services/logger/logger.service';
import { DeviceIdentityStateModel } from '@core/models/device-identity-state.model';
import { DeviceIdentityDatabaseService } from '@db/device-identity-database.service';
import { DEVICE_IDENTITY_CONSTANTS} from '@core/constants/device-identity.constants';


const log = new Logger('device-identity.effects');

@Injectable()
export class DeviceIdentityEffects {

    constructor(
        private actions$: Actions<fromActions.DeviceIdentityActionActions>,
        private store: Store<DeviceIdentityStateModel>,
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
            const newIndentity = 'identity' + new Date().getTime() ;

            return from(this.deviceIdentityDatabaseService.set(DEVICE_IDENTITY_CONSTANTS.DEVICE_IDENTITY, newIndentity).pipe(
                map(() => new fromActions.ChangeIdentitySuccess({ id: newIndentity }))
            ));
        })
    );

}





