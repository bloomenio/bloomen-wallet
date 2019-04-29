// Basic
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Logger } from '@services/logger/logger.service';

import MockData from '../../assets/mock/assets.json';
import MockMedia from '../../assets/mock/media.json';

import { AssetModel } from '@core/models/asset.model.js';
import { ASSETS_CONSTANTS } from '@core/constants/assets.constants.js';
import { MediaModel } from '@core/models/media.model.js';
import { Location } from '@angular/common';
import { DevicesContract } from '@core/core.module.js';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

const log = new Logger('credential-dialog.component');


@Component({
  selector: 'blo-credential-dialog-dialog',
  templateUrl: 'credential-dialog.component.html',
  styleUrls: ['credential-dialog.component.scss']
})
export class CredentialDialogComponent implements OnInit, OnDestroy {

  public asset: AssetModel;
  public media: MediaModel;

  public qrAllowBuy: string;

  private allowed: boolean;
  private deviceId: string;

  private dappId: string;

  private interval$: Subscription;

  constructor(
    public dialogRef: MatDialogRef<CredentialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public location: Location,
    public devicesContract: DevicesContract
  ) { }

  public ngOnInit() {
    this.allowed = false;

    if (this.data.videoId) {
      this.asset = MockData[ASSETS_CONSTANTS.VIDEOS][this.data.videoId];
      this.media = MockMedia[ASSETS_CONSTANTS.VIDEOS][this.data.videoId];
      this.deviceId = `${MockData[ASSETS_CONSTANTS.VIDEOS].deviceId}-${new Date().getTime()}`;
    } else if (this.data.mobilityId) {
      this.asset = MockData[ASSETS_CONSTANTS.MOBILITY][this.data.mobilityId];
      this.media = MockMedia[ASSETS_CONSTANTS.MOBILITY][this.data.mobilityId];
      this.deviceId = `Worldline ${MockMedia[ASSETS_CONSTANTS.MOBILITY][this.data.mobilityId].title}-${new Date().getTime()}`;
    } else if (this.data.smartOfficeId) {
      this.asset = MockData[ASSETS_CONSTANTS.SMART_OFFICE][this.data.smartOfficeId];
      this.media = MockMedia[ASSETS_CONSTANTS.SMART_OFFICE][this.data.smartOfficeId];
      this.deviceId = `Worldline ${MockMedia[ASSETS_CONSTANTS.SMART_OFFICE][this.data.smartOfficeId].title}-${new Date().getTime()}`;
    }

    this.qrAllowBuy = `allow_buy://${this.asset.assetKey}#${this.asset.schemaId}#${this.asset.amount}#${this.asset.dappId}#${encodeURI(this.asset.description)}#${encodeURI(this.deviceId)}`;


    this.interval$ = interval(1000).pipe(
      takeWhile(() => !this.allowed)
    ).subscribe(() => {
      this.devicesContract.isAllowed(this.deviceId, this.asset.dappId).then((allowed) => {
        if (allowed) {
          this.allowed = allowed;
          this.dialogRef.close(true);
        }
      });
    });
  }

  public ngOnDestroy() {
    this.interval$.unsubscribe();
  }

  public cancelDialog() {
    this.dialogRef.close(false);
    this.location.back();
  }
}
