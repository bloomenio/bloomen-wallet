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
                this.assetsContract.getAssetsPageCount().then(pageCount => {
                    pageCount = parseInt(pageCount);
                    // #BUGPAGECOUNT: Remove "+ 1" when fixed
                    const lastPage = pageCount + 1;
                    this.loadFullPage(lastPage, fromActions.PAGE_SIZE).then((result: AssetModel[]) => {
                        // #BUGPAGECOUNT: Remove IF when fixed
                        if (result.length > fromActions.PAGE_SIZE) {
                            pageCount++;
                        }
                        // #BUGPAGECOUNT: move dispatch UpdateDevicesPagesCountSuccess before 'loadFullPage' call
                        this.store.dispatch(new fromActions.UpdatePurchasesPagesCountSuccess({ totalPages: pageCount }));
                        this.store.dispatch(new fromActions.InitPurchasesSuccess(result));
                    });
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
                this.loadFullPage(action.payload.page, fromActions.PAGE_SIZE).then((result: AssetModel[]) => {
                    this.store.dispatch(new fromActions.UpdatePurchasesSuccess(result));
                });
            });
        })
    );

    private loadFullPage(pageIndex: number, pageSize = fromActions.PAGE_SIZE): Promise<AssetModel[]> {
        return new Promise<AssetModel[]>((resolve, reject) => {
            this.assetsContract.getAssets(pageIndex).then((result: AssetModel[]) => {
                const assets = this.calculateAssetArray(result);
                if (pageIndex > fromActions.FIRST_PAGE_INDEX && assets.length < pageSize) {
                    // When a page is not complete then load also previous one, if available
                    this.loadFullPage(pageIndex - 1, pageSize).then(previousPage => {
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
            .filter(asset => asset['assetId'] !== '0')
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





