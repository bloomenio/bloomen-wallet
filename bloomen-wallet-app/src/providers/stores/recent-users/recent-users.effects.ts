import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

// Constants
import {map, switchMap} from 'rxjs/operators';

// Actions
import * as fromActions from './recent-users.actions';
import { Logger } from '@services/logger/logger.service';

import { Store } from '@ngrx/store';
import {UserAlias} from "@models/recent-user.model";
import {RecentUsersService} from "@db/recent-users.service";
import {from} from "rxjs";

const log = new Logger('purchases.effects');

@Injectable()
export class RecentUsersEffects {
    constructor(private actions$: Actions<fromActions.RecentUsersActions>,
                private store: Store<UserAlias>,
                private recentUsersDateBaseService: RecentUsersService){}

    @Effect() public initRecentUser = this.actions$.pipe(
        ofType(fromActions.RecentUsersActionTypes.INIT_RECENT_USER),
        switchMap(() => {
            return from(this.recentUsersDateBaseService.getAll().pipe(
                map((value) => new fromActions.InitRecentUsersSuccess(value))
            ));
        })
    );

    @Effect() public addRecentUser = this.actions$.pipe(
        ofType(fromActions.RecentUsersActionTypes.ADD_ALIAS),
        switchMap( (action) => {
            return from(this.recentUsersDateBaseService.set(action.payload.user.address, action.payload.user).pipe(
                map(() => new fromActions.AddAliasSuccess(action.payload))
                ));
            }
        )
    );

    @Effect() public deleteRecentUser = this.actions$.pipe(
        ofType(fromActions.RecentUsersActionTypes.DELETE_ALIAS),
        switchMap( (action) => {
                return from(this.recentUsersDateBaseService.remove(action.payload.id).pipe(
                    map(() => new fromActions.DeleteAliasSuccess(action.payload))
                ));
            }
        )
    );

    @Effect() public changeRecentUser = this.actions$.pipe(
        ofType(fromActions.RecentUsersActionTypes.CHANGE_ALIAS),
        switchMap( (action) => {
                return from(this.recentUsersDateBaseService.set(action.payload.user.address, action.payload.user).pipe(
                    map(() => new fromActions.ChangeAliasSuccess(action.payload))
                ));
            }
        )
    );

}





