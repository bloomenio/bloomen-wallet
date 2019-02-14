import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { dappReducer } from './dapp.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DappEffects } from './dapp.effects';

@NgModule({
    imports: [
        SharedModule,
        StoreModule.forFeature('dapps', dappReducer),
        EffectsModule.forFeature([
            DappEffects
        ])
    ]
})

export class DappStoreModule { }
