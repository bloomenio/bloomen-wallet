import { Action } from '@ngrx/store';
import { AssetModel } from '@core/models/assets.model';

export const FIRST_PAGE_INDEX = 1;
export const PAGE_SIZE = 10;


export enum PurchasesActionTypes {
    INIT_PURCHASES = '[Purchases] Init purchases',
    INIT_PURCHASES_SUCCESS = '[Purchases] Init purchases success',
    UPDATE_PURCHASES = '[Purchases] Update purchases',
    UPDATE_PURCHASES_SUCCESS = '[Purchases] Update purchases success',
    UPDATE_PURCHASES_PAGES_COUNT_SUCCESS = '[Devices] Update purchases page count success',
    REMOVE_PURCHASE = '[Purchases] Remove Purchases',
    REMOVE_PURCHASE_SUCCESS = '[Purchases] Remove Purchases success',
}

export class InitPurchases implements Action {
    public readonly type = PurchasesActionTypes.INIT_PURCHASES;
    constructor(public readonly payload: { dappId: string}) { }
}


export class InitPurchasesSuccess implements Action {
    public readonly type = PurchasesActionTypes.INIT_PURCHASES_SUCCESS;
    constructor(public readonly payload: AssetModel[]) { }
}

export class UpdatePurchases implements Action {
    public readonly type = PurchasesActionTypes.UPDATE_PURCHASES;
    constructor(public readonly payload: { page: number, dappId: string }) { }
}

export class UpdatePurchasesSuccess implements Action {
    public readonly type = PurchasesActionTypes.UPDATE_PURCHASES_SUCCESS;
    constructor(public readonly payload: AssetModel[]) { }
}

export class UpdatePurchasesPagesCountSuccess implements Action {
    public readonly type = PurchasesActionTypes.UPDATE_PURCHASES_PAGES_COUNT_SUCCESS;
    constructor(public readonly payload: { totalPages: number }) { }
}

export class RemovePurchase implements Action {
    public readonly type = PurchasesActionTypes.REMOVE_PURCHASE;
    constructor(public readonly payload: AssetModel) { }
}

export class RemovePurchaseSuccess implements Action {
    public readonly type = PurchasesActionTypes.REMOVE_PURCHASE_SUCCESS;
    constructor(public readonly payload: AssetModel) { }
}


export type PurchasesActions = InitPurchases | InitPurchasesSuccess
 | UpdatePurchases | UpdatePurchasesSuccess | UpdatePurchasesPagesCountSuccess | RemovePurchase | RemovePurchaseSuccess;
