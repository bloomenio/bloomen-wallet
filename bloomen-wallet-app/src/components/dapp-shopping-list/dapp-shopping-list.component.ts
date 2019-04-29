// Basic
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { Dapp } from '@core/models/dapp.model.js';
import { Logger } from '@services/logger/logger.service';

import { Subscription } from 'rxjs';
import { sortBy } from 'lodash';

import { Store } from '@ngrx/store';

import * as fromDevicesSelectors from '@stores/devices/devices.selectors';
import * as fromPurchasesSelectors from '@stores/purchases/purchases.selectors';

import * as fromDevicesActions from '@stores/devices/devices.actions';
import * as fromPurchasesActions from '@stores/purchases/purchases.actions';
import { DeviceModel } from '@core/models/device.model';
import { AssetModel } from '@core/models/assets.model';
import { DappGeneralDialogComponent } from '@components/dapp-general-dialog/dapp-general-dialog.component';



const log = new Logger('dapp-shopping-list.component');

/**
 * Dapp-settings component
 */
@Component({
  selector: 'blo-dapp-shopping-list',
  templateUrl: 'dapp-shopping-list.component.html',
  styleUrls: ['dapp-shopping-list.component.scss']
})
export class DappShoppingListComponent implements OnInit, OnDestroy {

  private devices$: Subscription;
  public deviceArray: DeviceModel[];
  private devicesPageCount$: Subscription;
  private devicesPageCount: number;
  public currentPageDevices: number;

  private purchases$: Subscription;
  public purchaseArray: AssetModel[];
  private purchasesPageCount$: Subscription;
  private purchasesPageCount: number;
  public currentPagePurchases: number;



  @Input() public dapp: Dapp;


  /**
   * Constructor to declare all the necesary to initialize the component.
   */
  constructor(
    private store: Store<any>,
    private dialog: MatDialog,
    private translate: TranslateService
  ) { }

  public ngOnInit() {
    this.devicesPageCount$ = this.store.select(fromDevicesSelectors.getPageCount).subscribe(pageCount => {
      this.devicesPageCount = pageCount;
    });
    this.devices$ = this.store.select(fromDevicesSelectors.selectAllDevices).subscribe((devicesArray) => {
      this.deviceArray = devicesArray;
      this.currentPageDevices = this.devicesPageCount + fromDevicesActions.FIRST_PAGE_INDEX
        - Math.ceil(devicesArray.length / fromDevicesActions.PAGE_SIZE);
    });

    this.purchasesPageCount$ = this.store.select(fromPurchasesSelectors.getPageCount).subscribe(pageCount => {
      this.purchasesPageCount = pageCount;
    });
    this.purchases$ = this.store.select(fromPurchasesSelectors.selectAllPurchases).subscribe((purchaseArray) => {
      this.purchaseArray = purchaseArray;
      this.currentPagePurchases = this.purchasesPageCount + fromPurchasesActions.FIRST_PAGE_INDEX
        - Math.ceil(purchaseArray.length / fromPurchasesActions.PAGE_SIZE);
    });
  }

  public moreDevices() {
    this.store.dispatch(new fromDevicesActions.UpdateDevices({
      page: Math.max(fromDevicesActions.FIRST_PAGE_INDEX, --this.currentPageDevices), dappId: this.dapp.dappId
    }));
  }

  public morePurchases() {
    this.store.dispatch(new fromPurchasesActions.UpdatePurchases({
      page: Math.max(fromPurchasesActions.FIRST_PAGE_INDEX, --this.currentPagePurchases), dappId: this.dapp.dappId
    }));
  }

  public ngOnDestroy() {
    this.devices$.unsubscribe();
    this.devicesPageCount$.unsubscribe();
    this.purchases$.unsubscribe();
    this.purchasesPageCount$.unsubscribe();
  }

  public removeDevice(device: DeviceModel) {
    const dialogRef = this.dialog.open(DappGeneralDialogComponent, {
      width: '250px',
      height: '200px',
      data: {
        title: this.translate.instant('dapp.shopping_list.remove_device.title'),
        description: this.translate.instant('dapp.shopping_list.remove_device.text'),
        buttonAccept: this.translate.instant('common.remove'),
        buttonCancel: this.translate.instant('common.cancel')
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new fromDevicesActions.RemoveDevice(device));
      }
    });
  }

  public checkDate(time: number): boolean {
    return (time !== null) ? new Date(time) < new Date() : true;
  }

}
