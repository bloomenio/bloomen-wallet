import { Action } from '@ngrx/store';
import {UserAlias} from '@models/recent-user.model';


export enum RecentUsersActionTypes {
    INIT_RECENT_USER = '[Recent Users] Init Recent Users',
    INIT_RECENT_USER_SUCCESS = '[Recent Users] Init Recent Users success',
    ADD_ALIAS = '[Recent Users] add a new alias to an address',
    ADD_ALIAS_SUCCESS = '[Recent Users] add a new alias to an address success',
    DELETE_ALIAS = '[Recent Users] delete alias',
    DELETE_ALIAS_SUCCESS = '[Recent Users] delete alias success',
    CHANGE_ALIAS = '[Recent Users] change existing alias',
    CHANGE_ALIAS_SUCCESS = '[Recent Users] change existing alias success',
    CURRENT_ALIAS = '[Recent Users] set user alias to send cash',
    DELETE_CURRENT_ALIAS = '[Recent Users] delete current alias'
}

export class InitRecentUsers implements Action {
    public readonly type = RecentUsersActionTypes.INIT_RECENT_USER;
}

export class AddAlias implements Action {
    public readonly type = RecentUsersActionTypes.ADD_ALIAS;
    constructor(public readonly payload: { user: UserAlias }) { }
}

export class AddAliasSuccess implements Action {
    public readonly type = RecentUsersActionTypes.ADD_ALIAS_SUCCESS;
    constructor(public readonly payload: { user: UserAlias }) { }
}

export class ChangeAlias implements Action {
    public readonly type = RecentUsersActionTypes.CHANGE_ALIAS;
    constructor(public payload: { user: UserAlias }) {}
}

export class ChangeAliasSuccess implements Action {
    public readonly type = RecentUsersActionTypes.CHANGE_ALIAS_SUCCESS;
    constructor(public payload: { user: UserAlias }) {}
}

export class DeleteAlias implements Action {
    public readonly type = RecentUsersActionTypes.DELETE_ALIAS;
    constructor(public readonly payload: { id: string }) { }
}

export class DeleteAliasSuccess implements Action {
    public readonly type = RecentUsersActionTypes.DELETE_ALIAS_SUCCESS;
    constructor(public readonly payload: { id: string }) { }
}

export class SetCurrentAlias implements Action {
    public readonly type = RecentUsersActionTypes.CURRENT_ALIAS;
    constructor(public readonly payload: UserAlias ) {}
}

export class CleanUser implements Action {
    public readonly type = RecentUsersActionTypes.DELETE_CURRENT_ALIAS;

}

export class InitRecentUsersSuccess implements Action {
    public readonly type = RecentUsersActionTypes.INIT_RECENT_USER_SUCCESS;
    constructor(public readonly payload: UserAlias[]) { }
}

 export type RecentUsersActions = AddAlias | DeleteAlias | SetCurrentAlias | ChangeAlias | CleanUser | InitRecentUsers | InitRecentUsersSuccess | AddAliasSuccess | DeleteAliasSuccess | ChangeAliasSuccess ;
