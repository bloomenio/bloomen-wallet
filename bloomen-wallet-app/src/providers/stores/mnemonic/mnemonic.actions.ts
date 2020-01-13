import { Action } from '@ngrx/store';
import { MnemonicModel } from '@core/models/mnemonic.model';

export enum MnemonicActionTypes {
    INIT_MNEMONIC = '[Mnemonic] Init mnemonic',
    INIT_MNEMONIC_SUCCESS = '[Mnemonic] Init mnemonic success',
    ADD_MNEMONIC = '[Mnemonic] add mnemonic',
    ADD_MNEMONIC_SUCCESS = '[Mnemonic] add mnemonic success',
    REMOVE_MNEMONIC = '[Mnemonic] remove mnemonic',
    REMOVE_MNEMONIC_SUCCESS = '[Mnemonic] remove mnemonic success',
    CHANGE_WALLET = '[Mnemonic] change wallet',
    REFRESH_WALLET = '[Mnemonic] refresh wallet',

}

export class ChangeWallet implements Action {
    public readonly type = MnemonicActionTypes.CHANGE_WALLET;
    constructor(public readonly payload: { randomSeed: string, dappId: string }) { }
}

export class RefreshWallet implements Action {
    public readonly type = MnemonicActionTypes.REFRESH_WALLET;
    constructor() { }
}

export class AddMnemonic implements Action {
    public readonly type = MnemonicActionTypes.ADD_MNEMONIC;
    constructor(public readonly payload: { address: string, randomSeed?: string }) { }
}

export class AddMnemonicSuccess implements Action {
    public readonly type = MnemonicActionTypes.ADD_MNEMONIC_SUCCESS;
    constructor(public readonly payload: MnemonicModel) { }
}

export class InitMnemonic implements Action {
    public readonly type = MnemonicActionTypes.INIT_MNEMONIC;
}

export class InitMnemonicSuccess implements Action {
    public readonly type = MnemonicActionTypes.INIT_MNEMONIC_SUCCESS;
    constructor(public readonly payload: MnemonicModel[]) { }
}

export class RemoveMnemonic implements Action {
    public readonly type = MnemonicActionTypes.REMOVE_MNEMONIC;
    constructor(public readonly payload: { address: string }) { }
}

export class RemoveMnemonicSuccess implements Action {
    public readonly type = MnemonicActionTypes.REMOVE_MNEMONIC_SUCCESS;
    constructor(public readonly payload: { address: string }) { }
}

export type MnemonicActions = AddMnemonic | InitMnemonic | InitMnemonicSuccess | AddMnemonicSuccess |
    RemoveMnemonic | RemoveMnemonicSuccess | ChangeWallet;
