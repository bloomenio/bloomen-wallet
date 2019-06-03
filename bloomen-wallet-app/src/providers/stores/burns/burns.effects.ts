import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

// Constants
import { map } from 'rxjs/operators';

// Actions
import * as fromActions from './burns.actions';
import { Logger } from '@services/logger/logger.service';


import { BurnHistoryContract } from '@services/web3/contracts';
import { BurnModel } from '@core/models/burn.model';
import { Web3Service } from '@services/web3/web3.service';

const log = new Logger('burns.effects');

@Injectable()
export class BurnsEffects {

    constructor(
        private actions$: Actions<fromActions.BurnActions>,
        private burnHistoryContract: BurnHistoryContract,
        private store: Store<any>,
        private web3Service: Web3Service
    ) { }

    @Effect({ dispatch: false }) public initBurns = this.actions$.pipe(
        ofType(
            fromActions.BurnActionTypes.INIT_BURNS
        ),
        map((action) => {
            this.web3Service.ready(() => {
                this.burnHistoryContract.getBurnsPageCount().then(pageCount => {
                    pageCount = parseInt(pageCount, 10);
                    const lastPage = pageCount;
                    this.store.dispatch(new fromActions.UpdateBurnsPagesCountSuccess({ totalPages: pageCount }));
                    this.loadFullPage(lastPage, fromActions.PAGE_SIZE).then((result: BurnModel[]) => {
                        this.store.dispatch(new fromActions.InitBurnsSuccess(result));
                    });
                });
            });
        })
    );

    @Effect({ dispatch: false }) public updateBurns = this.actions$.pipe(
        ofType(
            fromActions.BurnActionTypes.UPDATE_BURNS
        ),
        map((action) => {
            this.web3Service.ready(() => {
                // Read in reverse order
                this.loadFullPage(action.payload.page, fromActions.PAGE_SIZE).then((result: BurnModel[]) => {
                    this.store.dispatch(new fromActions.UpdateBurnsSuccess(result));
                });
            });
        })
    );

    private loadFullPage(pageIndex: number, pageSize = fromActions.PAGE_SIZE): Promise<BurnModel[]> {
        return new Promise<BurnModel[]>((resolve, reject) => {
            this.burnHistoryContract.getBurns(pageIndex).then((result: BurnModel[]) => {
                const burns = this.calculateBurnArray(result);
                if (pageIndex > fromActions.FIRST_PAGE_INDEX && burns.length < pageSize) {
                    // When a page is not complete then load also previous one, if available
                    this.loadFullPage(pageIndex - 1, pageSize).then(previousPage => {
                        // Reverse order
                        resolve([...burns, ...previousPage]);
                    }, reject);
                } else {
                    resolve(burns);
                }
            }, reject);
        });
    }

    private calculateBurnArray(result: BurnModel[]): BurnModel[] {
        // Reverse order
        const burnsArray: BurnModel[] = result
            .filter((burn) => burn['amount'] > 0)
            .map(asset => {
                return {
                    id: asset['id'],
                    amount: asset['amount'],
                    date: asset['date'] * 1000
                } as BurnModel;
            })
            .reverse();
        return burnsArray;
    }
}





