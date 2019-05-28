// Basic
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AssetPurchased } from '@services/asset-purchased/asset-purchased.service';
import { Store } from '@ngrx/store';

import * as fromDeviceSelectors from '@stores/device-identity/device-identity.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'blo-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  private device;

  private device$: Subscription;

  constructor(
    private purchases: AssetPurchased,
    private store: Store<any>
  ) { }

  public ngOnInit() {
    this.device$ = this.store.select(fromDeviceSelectors.getDeviceIdentity).subscribe((device) => {
      this.device = device;
    });
  }

  public ngOnDestroy() {
    this.device$.unsubscribe();
  }

  public checkOwnershipMultipleAssetsForDevice() {
    this.purchases.checkOwnershipMultipleAssetsForDevice(this.device.id, [1002, 1003, 1005], 'MWC-VIDEO');
  }

}
