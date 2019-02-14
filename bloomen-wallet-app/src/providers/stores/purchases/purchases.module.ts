import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { PurchasesReducer } from './purchases.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DevicesEffects } from './purchases.effects';

@NgModule({
    imports: [
        SharedModule,
        StoreModule.forFeature('purchases', PurchasesReducer),
        EffectsModule.forFeature([
            DevicesEffects
        ])
    ]
})

export class PurchasesStoreModule { }
