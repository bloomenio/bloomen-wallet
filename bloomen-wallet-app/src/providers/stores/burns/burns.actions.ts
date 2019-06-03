import { Action } from '@ngrx/store';
import { BurnModel } from '@core/models/burn.model';

export const FIRST_PAGE_INDEX = 1;
export const PAGE_SIZE = 10;

export enum BurnActionTypes {
    INIT_BURNS = '[Burns] Init burns',
    INIT_BURNS_SUCCESS = '[Burns] Init burns success',
    UPDATE_BURNS = '[Burns] Update burns',
    UPDATE_BURNS_SUCCESS = '[Burns] Update burns success',
    UPDATE_BURN_PAGES_COUNT_SUCCESS = '[Burns] Update burns page count success',
}

export class InitBurns implements Action {
    public readonly type = BurnActionTypes.INIT_BURNS;
    constructor() { }
}

export class InitBurnsSuccess implements Action {
    public readonly type = BurnActionTypes.INIT_BURNS_SUCCESS;
    constructor(public readonly payload: BurnModel[]) { }
}

export class UpdateBurns implements Action {
    public readonly type = BurnActionTypes.UPDATE_BURNS;
    constructor(public readonly payload: { page: number }) { }
}

export class UpdateBurnsSuccess implements Action {
    public readonly type = BurnActionTypes.UPDATE_BURNS_SUCCESS;
    constructor(public readonly payload: BurnModel[]) { }
}

export class UpdateBurnsPagesCountSuccess implements Action {
    public readonly type = BurnActionTypes.UPDATE_BURN_PAGES_COUNT_SUCCESS;
    constructor(public readonly payload: { totalPages: number  }) { }
}

export type BurnActions = InitBurns | InitBurnsSuccess
 | UpdateBurns | UpdateBurnsSuccess | UpdateBurnsPagesCountSuccess;
