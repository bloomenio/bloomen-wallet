// Basic
import { Component, OnInit, OnDestroy } from '@angular/core';

import { MatSnackBar, MatDialog } from '@angular/material';
import { Logger } from '@services/logger/logger.service';
import { CredentialDialogComponent } from '@components/credential-dialog/credential-dialog.component';
import { ActivatedRoute } from '@angular/router';

import MediaMock from '../../assets/mock/media.json';
import { ASSETS_CONSTANTS } from '@core/constants/assets.constants.js';
import { DevicesContract } from '@core/core.module.js';
import { Store } from '@ngrx/store';
import { Web3Service } from '@services/web3/web3.service.js';
import { Subscription } from 'rxjs';

import * as fromDeviceSelector from '@stores/device-identity/device-identity.selectors';

const log = new Logger('mobility-exchange.component');

/**
 * Mobility exchange page
 */
@Component({
  selector: 'blo-mobility-exchange',
  templateUrl: './mobility-exchange.component.html',
  styleUrls: ['./mobility-exchange.component.scss']
})
export class MobilityExchangeComponent  implements OnInit, OnDestroy {

  public mobilityId: string;
  public mobilities: any;
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
    this.mobilityId = this.activatedRoute.snapshot.paramMap.get('mobilityId');
    this.mobilities = MediaMock[ASSETS_CONSTANTS.MOBILITY];
    this.device$ = this.store.select(fromDeviceSelector.getIdentity).subscribe((device) => {

      this.device = device;

      this.web3Service.ready(async () => {
        const purchased = await this.devicesContract.checkOwnershipOneAssetForDevice(device, parseInt(this.mobilityId, 10), 'MWC-FACILITIES');
        if (!purchased) {
          setTimeout(() => this.openDialog());
        } else {
          setTimeout(() => { this.exchanged = true; } );
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
        mobilityId: this.mobilityId,
        deviceId: this.device,
        iconBuy: this.mobilities[this.mobilityId].dialogContent.iconBuy,
        textAllowBuy: this.mobilities[this.mobilityId].dialogContent.textAllowBuy,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.exchanged = result;
    });
  }
}
