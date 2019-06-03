import { Action } from '@ngrx/store';

export enum ApplicationDataActionTypes {
    INIT_APP_DATA = '[Application Data] init application data async initialState',
    CHANGE_FIRST_RUN = '[Application Data] change first run',
    CHANGE_THEME = '[Application Data] change theme',
    PRELOAD_IMAGE = '[Application Data] preload image',
    CHANGE_INITIAL_DAPP = '[Application Data] change initial dapp'
}

export class ChangeTheme implements Action {
    public readonly type = ApplicationDataActionTypes.CHANGE_THEME;
    constructor(public readonly payload: { theme: string }) { }
}

export class ChangeFirstRun implements Action {
    public readonly type = ApplicationDataActionTypes.CHANGE_FIRST_RUN;
    constructor(public readonly payload: { isFirstRun: boolean }) { }
}

export class InitAppData implements Action {
    public readonly type = ApplicationDataActionTypes.INIT_APP_DATA;
}

export class PreloadImage implements Action {
    public readonly type = ApplicationDataActionTypes.PRELOAD_IMAGE;
    constructor(public readonly imatgePath: string) { }
}

export class ChangeInitialDapp implements Action {
    public readonly type = ApplicationDataActionTypes.CHANGE_INITIAL_DAPP;
    constructor(public readonly payload: { currentDappAddress: string }) { }
}

export type ApplicationDataActions = ChangeTheme | ChangeFirstRun | InitAppData | PreloadImage | ChangeInitialDapp;
