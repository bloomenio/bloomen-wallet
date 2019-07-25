import { Action } from '@ngrx/store';
import { DappCache } from '@core/models/dapp.model';
import { Update } from '@ngrx/entity';

export enum DappActionTypes {
    INIT_DAPPS = '[Dapp] Init dapps',
    ADD_DAPP = '[Dapp] Add dapp',
    ADD_DAPP_SUCCESS = '[Dapp] Add dapp success',
    REMOVE_DAPP = '[Dapp] remove dapp',
    REMOVE_DAPP_SUCCESS = '[Dapp] remove dapp success',
    REFRESH_DAPPS = '[Dapp] refresh dapps',
    REFRESH_DAPP = '[Dapp] refresh dapp',
    REFRESH_DAPP_SILENT = '[Dapp] refresh dapp silent',
    REFRESH_DAPP_SUCCESS = '[Dapp] refresh dapps success',
}

export class InitDapps implements Action {
    public readonly type = DappActionTypes.INIT_DAPPS;

}

export class RefreshDapps implements Action {
    public readonly type = DappActionTypes.REFRESH_DAPPS;

}

export class RefreshDapp implements Action {
    public readonly type = DappActionTypes.REFRESH_DAPP;
    constructor(public readonly payload: { address: string }) { }
}

export class RefreshDappSilent implements Action {
    public readonly type = DappActionTypes.REFRESH_DAPP_SILENT;
    constructor(public readonly payload: { address: string }) { }
}

export class RefreshDappSuccess implements Action {
    public readonly type = DappActionTypes.REFRESH_DAPP_SUCCESS;
    constructor(public readonly payload: Update<DappCache>) { }

}

export class AddDappSuccess implements Action {
    public readonly type = DappActionTypes.ADD_DAPP_SUCCESS;
    constructor(public readonly payload: DappCache) { }

}

export class AddDapp implements Action {
    public readonly type = DappActionTypes.ADD_DAPP;
    constructor(public readonly payload: { address: string }) { }

}

export class RemoveDappSuccess implements Action {
    public readonly type = DappActionTypes.REMOVE_DAPP_SUCCESS;
    constructor(public readonly payload: { address: string }) { }

}

export class RemoveDapp implements Action {
    public readonly type = DappActionTypes.REMOVE_DAPP;
    constructor(public readonly payload: { address: string }) { }

}

export type DappActions = InitDapps | AddDapp | AddDappSuccess | RemoveDapp | RemoveDappSuccess | RefreshDapps | RefreshDappSuccess |
    RefreshDapp | RefreshDappSilent;
