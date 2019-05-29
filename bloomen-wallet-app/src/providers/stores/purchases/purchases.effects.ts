import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

// Constants
import { map } from 'rxjs/operators';

// Actions
import * as fromActions from './purchases.actions';
import { Logger } from '@services/logger/logger.service';


import { AssetsContract } from '@services/web3/contracts';
import { AssetModel } from '@core/models/assets.model';
import { Store } from '@ngrx/store';
import { Web3Service } from '@services/web3/web3.service';

const log = new Logger('purchases.effects');

@Injectable()
export class DevicesEffects {

    constructor(
        private actions$: Actions<fromActions.PurchasesActions>,
        private assetsContract: AssetsContract,
        private store: Store<any>,
        private web3Service: Web3Service
    ) { }

    @Effect({ dispatch: false }) public initDevices = this.actions$.pipe(
        ofType(
            fromActions.PurchasesActionTypes.INIT_PURCHASES
        ),
        map((action) => {
            this.web3Service.ready(() => {
                this.assetsContract.getAssetsPageCount(action.payload.dappId).then(pageCount => {
                    pageCount = parseInt(pageCount, 10);
                    const lastPage = pageCount;
                    // #BUGPAGECOUNT: move dispatch UpdateDevicesPagesCountSuccess before 'loadFullPage' call
                    this.store.dispatch(new fromActions.UpdatePurchasesPagesCountSuccess({ totalPages: pageCount }));
                    this.loadFullPage(lastPage, fromActions.PAGE_SIZE, action.payload.dappId).then((result: AssetModel[]) => {
                        // #BUGPAGECOUNT: Remove IF when fixed
                        // if (result.length > fromActions.PAGE_SIZE) {
                        //     pageCount++;
                        // }
                        this.store.dispatch(new fromActions.InitPurchasesSuccess(result));
                    });
                });
            });
        })
    );

    @Effect({ dispatch: false }) public removePurchase = this.actions$.pipe(
        ofType(fromActions.PurchasesActionTypes.REMOVE_PURCHASE),
        map((action) => {
            this.web3Service.ready(() => {
                this.assetsContract.removeAsset(action.payload.assetId, action.payload.dappId).then(() => {
                    this.store.dispatch(new fromActions.RemovePurchaseSuccess(action.payload));
                });
            });
        })
    );

    @Effect({ dispatch: false }) public updatePurchases = this.actions$.pipe(
        ofType(
            fromActions.PurchasesActionTypes.UPDATE_PURCHASES
        ),
        map((action) => {
            this.web3Service.ready(() => {
                // Read in reverse order
                this.loadFullPage(action.payload.page, fromActions.PAGE_SIZE, action.payload.dappId).then((result: AssetModel[]) => {
                    this.store.dispatch(new fromActions.UpdatePurchasesSuccess(result));
                });
            });
        })
    );

    private loadFullPage(pageIndex: number, pageSize = fromActions.PAGE_SIZE, dappId: string): Promise<AssetModel[]> {
        return new Promise<AssetModel[]>((resolve, reject) => {
            this.assetsContract.getAssets(pageIndex, dappId).then((result: AssetModel[]) => {
                const assets = this.calculateAssetArray(result);
                if (pageIndex > fromActions.FIRST_PAGE_INDEX && assets.length < pageSize) {
                    // When a page is not complete then load also previous one, if available
                    this.loadFullPage(pageIndex - 1, pageSize, dappId).then(previousPage => {
                        // Reverse order
                        resolve([...assets, ...previousPage]);
                    }, reject);
                } else {
                    resolve(assets);
                }
            }, reject);
        });
    }

    private calculateAssetArray(result): AssetModel[] {
        // Reverse order
        const purchaseArray: AssetModel[] = result
            .filter(asset => asset['assetId'] !== '0' && asset['dappId'] !== '')
            .map(asset => {
                return {
                    assetId: asset['assetId'],
                    dappId: asset['dappId'],
                    expirationDate: asset['expirationDate'] * 1000,
                    schemaId: asset['schemaId'],
                    description: asset['description']
                } as AssetModel;
            })
            .reverse();
        return purchaseArray;
    }
}





