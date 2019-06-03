import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { BurnReducer } from './burns.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BurnsEffects } from './burns.effects';

@NgModule({
    imports: [
        SharedModule,
        StoreModule.forFeature('burns', BurnReducer),
        EffectsModule.forFeature([
            BurnsEffects
        ])
    ]
})

export class BurnsStoreModule { }
