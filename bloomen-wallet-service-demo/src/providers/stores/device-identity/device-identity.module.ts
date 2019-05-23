import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { deviceIdentityReducer } from './device-identity.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DeviceIdentityEffects } from './device-identity.effects';

@NgModule({
    imports: [
        SharedModule,
        StoreModule.forFeature('deviceIdentity', deviceIdentityReducer),
        EffectsModule.forFeature([
            DeviceIdentityEffects
        ])
    ]
})

export class DeviceIdentityStoreModule { }
