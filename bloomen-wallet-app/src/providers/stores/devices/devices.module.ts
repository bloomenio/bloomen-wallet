import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { DeviceReducer } from './devices.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DevicesEffects } from './devices.effects';

@NgModule({
    imports: [
        SharedModule,
        StoreModule.forFeature('devices', DeviceReducer),
        EffectsModule.forFeature([
            DevicesEffects
        ])
    ]
})

export class DevicesStoreModule { }
