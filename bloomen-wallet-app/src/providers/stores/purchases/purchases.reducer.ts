import { PurchasesActionTypes, PurchasesActions } from './purchases.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { AssetModel } from '@core/models/assets.model';

export interface PurchasesState extends EntityState<AssetModel> {
    totalPages: number;
}

export const purchaseAdapter = createEntityAdapter<AssetModel>({
    selectId: (asset: AssetModel) => asset.assetId
});

const purchaseInitialState: PurchasesState = purchaseAdapter.getInitialState({
    totalPages: 0
});

export function PurchasesReducer(state: PurchasesState = purchaseInitialState, action: PurchasesActions): PurchasesState {
    switch (action.type) {

        case PurchasesActionTypes.INIT_PURCHASES_SUCCESS: {
            return purchaseAdapter.addAll(action.payload, state);
        }
        case PurchasesActionTypes.UPDATE_PURCHASES_SUCCESS: {
            return purchaseAdapter.addMany(action.payload, state);
        }
        case PurchasesActionTypes.UPDATE_PURCHASES_PAGES_COUNT_SUCCESS: {
            return { ...state, ...action.payload };
        }

        default:
            return state;
    }
}

export const getPageCount = (state: PurchasesState) => state.totalPages;
