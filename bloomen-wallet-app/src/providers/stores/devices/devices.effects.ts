import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

// Constants
import { map } from 'rxjs/operators';

// Actions
import * as fromActions from './devices.actions';
import { Logger } from '@services/logger/logger.service';


import { DevicesContract } from '@services/web3/contracts';
import { DeviceModel } from '@core/models/device.model';
import { Web3Service } from '@services/web3/web3.service';

const log = new Logger('devices.effects');

@Injectable()
export class DevicesEffects {

    constructor(
        private actions$: Actions<fromActions.DeviceActions>,
        private devicesContract: DevicesContract,
        private store: Store<any>,
        private web3Service: Web3Service
    ) { }

    @Effect({ dispatch: false }) public initDevices = this.actions$.pipe(
        ofType(
            fromActions.DeviceActionTypes.INIT_DEVICES
        ),
        map((action) => {
            this.web3Service.ready(() => {
                this.devicesContract.getDevicesPageCount(action.payload.dappId).then(pageCount => {
                    pageCount = parseInt(pageCount, 10);
                    const lastPage = pageCount;
                    this.store.dispatch(new fromActions.UpdateDevicesPagesCountSuccess({ totalPages: pageCount }));
                    this.loadFullPage(lastPage, fromActions.PAGE_SIZE, action.payload.dappId).then((result: DeviceModel[]) => {
                        this.store.dispatch(new fromActions.InitDevicesSuccess(result));
                    });
                });
            });
        })
    );

    @Effect({ dispatch: false }) public updateDevices = this.actions$.pipe(
        ofType(
            fromActions.DeviceActionTypes.UPDATE_DEVICES
        ),
        map((action) => {
            this.web3Service.ready(() => {
                // Read in reverse order
                this.loadFullPage(action.payload.page, fromActions.PAGE_SIZE, action.payload.dappId).then((result: DeviceModel[]) => {
                    this.store.dispatch(new fromActions.UpdateDevicesSuccess(result));
                });
            });
        })
    );

    @Effect({ dispatch: false }) public removeDevices = this.actions$.pipe(
        ofType(fromActions.DeviceActionTypes.REMOVE_DEVICE),
        map((action) => {
            this.web3Service.ready(() => {
                this.devicesContract.removeDevice(action.payload.description, action.payload.dappId).then(() => {
                    this.store.dispatch(new fromActions.RemoveDeviceSuccess(action.payload));
                });
            });
        })
    );

    private loadFullPage(pageIndex: number, pageSize = fromActions.PAGE_SIZE, dappId: string): Promise<DeviceModel[]> {
        return new Promise<DeviceModel[]>((resolve, reject) => {
            this.devicesContract.getDevices(pageIndex, dappId).then((result: DeviceModel[]) => {
                const devices = this.calculateDeviceArray(result);
                if (pageIndex > fromActions.FIRST_PAGE_INDEX && devices.length < pageSize) {
                    // When a page is not complete then load also previous one, if available
                    this.loadFullPage(pageIndex - 1, pageSize, dappId).then(previousPage => {
                        // Reverse order
                        resolve([...devices, ...previousPage]);
                    }, reject);
                } else {
                    resolve(devices);
                }
            }, reject);
        });
    }

    private calculateDeviceArray(result: DeviceModel[]): DeviceModel[] {
        // Reverse order
        const deviceArray: DeviceModel[] = result
            .filter((device) =>  device['dappId'] !== '')
            .map(asset => {
                return {
                    id: `${asset['assetId']}_${asset['expirationDate']}`,
                    assetId: asset['assetId'],
                    dappId: asset['dappId'],
                    expirationDate: asset['expirationDate'] * 1000,
                    schemaId: asset['schemaId'],
                    description: asset['description']
                } as DeviceModel;
            })
            .reverse();
        return deviceArray;
    }
}




