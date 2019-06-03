// Basic
import { Component, OnInit, OnDestroy } from '@angular/core';

import { MatSnackBar, MatDialog } from '@angular/material';
import { CredentialDialogComponent } from '@components/credential-dialog/credential-dialog.component';
import { ActivatedRoute } from '@angular/router';

import MediaMock from '../../assets/mock/media.json';
import { ASSETS_CONSTANTS } from '@core/constants/assets.constants.js';

import * as fromDeviceSelector from '@stores/device-identity/device-identity.selectors';
import { Subscription } from 'rxjs';
import { Web3Service } from '@services/web3/web3.service.js';
import { DevicesContract } from '@core/core.module.js';
import { Store } from '@ngrx/store';

/**
 * SmartOffice exchange page
 */
@Component({
  selector: 'blo-smart-office-exchange',
  templateUrl: './smart-office-exchange.component.html',
  styleUrls: ['./smart-office-exchange.component.scss']
})
export class SmartOfficeExchangeComponent implements OnInit, OnDestroy {

  public smartOfficeId: string;
  public smartOfficeServices: any;
  public exchanged = false;
  public device$: Subscription;

  public device: any;

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public devicesContract: DevicesContract,
    public store: Store<any>,
    public web3Service: Web3Service
  ) { }

  public ngOnInit() {
    this.smartOfficeId = this.activatedRoute.snapshot.paramMap.get('smartOfficeId');
    this.smartOfficeServices = MediaMock[ASSETS_CONSTANTS.SMART_OFFICE];

    this.device$ = this.store.select(fromDeviceSelector.getIdentity).subscribe((device) => {

      this.device = device;

      this.web3Service.ready(async () => {
        const purchased = await this.devicesContract.checkOwnershipOneAssetForDevice(device, parseInt(this.smartOfficeId, 10), 'MWC-VIDEO');
        if ( !purchased) {
          setTimeout(() => this.openDialog());
        } else {
          setTimeout(() => this.exchanged = true);
        }
      });
    });
  }

  public ngOnDestroy() {
    this.device$.unsubscribe();
  }

  private openDialog() {
    const dialogRef = this.dialog.open(CredentialDialogComponent, {
      maxWidth: '55vw',
      disableClose: true,
      data: {
        smartOfficeId: this.smartOfficeId,
        deviceId: this.device,
        iconBuy: this.smartOfficeServices[this.smartOfficeId].dialogContent.iconBuy,
        textAllowBuy: this.smartOfficeServices[this.smartOfficeId].dialogContent.textAllowBuy
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.exchanged = result;
    });
  }
}
