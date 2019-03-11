import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { transactionReducer } from './transaction.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TransactionEffects } from './transaction.effects';

@NgModule({
    imports: [
        SharedModule,
        StoreModule.forFeature('transactions', transactionReducer),
        EffectsModule.forFeature([
            TransactionEffects
        ])
    ]
})

export class TransactionStoreModule { }
