import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { collaboratorReducer } from './collaborator.reducer';
import { EffectsModule } from '@ngrx/effects';
import { MnemonicEffects } from './collaborator.effects';

@NgModule({
    imports: [
        SharedModule,
        StoreModule.forFeature('collaborators', collaboratorReducer),
        EffectsModule.forFeature([
            MnemonicEffects
        ])
    ]
})

export class MnemonicStoreModule { }
