// Basic
import { Component, OnInit, OnDestroy } from '@angular/core';

import { MatSnackBar } from '@angular/material';
import { Logger } from '@services/logger/logger.service';

import MediaMock from '../../assets/mock/media.json';
import { ASSETS_CONSTANTS } from '@core/constants/assets.constants';
import { EventEmiterAssetPurchased } from '@services/asset-purchased/asset-purchased.service';
import { DevicesContract } from '@core/core.module.js';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromDeviceSelectors from '@stores/device-identity/device-identity.selectors';

const log = new Logger('video.component');


/**
 * Home page
 */
@Component({
  selector: 'blo-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit, OnDestroy {

  public videos: any;

  public purchasedAssets: any;

  public device$: Subscription;
  public purchases$: Subscription;

  public device: any;

  constructor(
    public snackBar: MatSnackBar,
    public purchases: EventEmiterAssetPurchased,
    public devicesContract: DevicesContract,
    public store: Store<any>
  ) {
    this.videos = MediaMock[ASSETS_CONSTANTS.VIDEOS];
  }

  public ngOnInit() {

    this.device$ = this.store.select(fromDeviceSelectors.getDeviceIdentity).subscribe((device) => {
      this.device = device;
    });

    this.purchases$ = this.purchases.getEvent().subscribe(async () => {
      this._parseFromContract();
    });
  }

  private async _parseFromContract() {
    const arrayPurchases: Array<boolean> = await this.devicesContract.checkOwnershipMultipleAssetsForDevice(this.device.id, [1002, 1003, 1005], 'MWC-VIDEO');
    if (arrayPurchases.length) {
      this.purchasedAssets = {
        1002: arrayPurchases[0],
        1003: arrayPurchases[1],
        1005: arrayPurchases[2],
      };
    }
  }

  public ngOnDestroy() {
    this.purchases$.unsubscribe();
  }


}
