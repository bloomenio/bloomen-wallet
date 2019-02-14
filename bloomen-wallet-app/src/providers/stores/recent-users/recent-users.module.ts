import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { RecentUsersReducer } from './recent-users.reducer';
import {EffectsModule} from "@ngrx/effects";
import {RecentUsersEffects} from "@stores/recent-users/recent-users.effects";



@NgModule({
    imports: [
        SharedModule,
        StoreModule.forFeature('recentUsers', RecentUsersReducer),
        EffectsModule.forFeature([
            RecentUsersEffects
        ])
    ]
})

export class RecentUsersStoreModule { }
