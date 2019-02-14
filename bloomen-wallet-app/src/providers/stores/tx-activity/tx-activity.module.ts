import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { TxActivityReducer } from './tx-activity.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TxActivityEffects } from './tx-activity.effects';

@NgModule({
    imports: [
        SharedModule,
        StoreModule.forFeature('txActivity', TxActivityReducer),
        EffectsModule.forFeature([
            TxActivityEffects
        ])
    ]
})

export class TxActivityStoreModule { }
