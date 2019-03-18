import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { balanceReducer } from './balance.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BalanceEffects } from './balance.effects';

@NgModule({
    imports: [
        SharedModule,
        StoreModule.forFeature('balance', balanceReducer),
        EffectsModule.forFeature([
            BalanceEffects
        ])
    ]
})

export class BalanceStoreModule { }
