// Basic
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSlideToggleChange } from '@angular/material';
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
import { Web3Service } from '@services/web3/web3.service.js';

import { Crypt, RSA } from 'hybrid-crypto-js';

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
  public origQrAllowBuy: string;
  public secQrAllowBuy: string;
  private allowed: boolean;
  private interval$: Subscription;
  private crypt: Crypt;


  constructor(
    public dialogRef: MatDialogRef<CredentialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public location: Location,
    public devicesContract: DevicesContract,
    public web3Service: Web3Service
  ) {
        // Basic initialization
        this.crypt = new Crypt({ md: 'sha512' });
  }

  public ngOnInit() {

    this.allowed = false;

    if (this.data.videoId) {
      this.asset = MockData[ASSETS_CONSTANTS.VIDEOS][this.data.videoId];
      this.media = MockMedia[ASSETS_CONSTANTS.VIDEOS][this.data.videoId];
    } else if (this.data.mobilityId) {
      this.asset = MockData[ASSETS_CONSTANTS.MOBILITY][this.data.mobilityId];
      this.media = MockMedia[ASSETS_CONSTANTS.MOBILITY][this.data.mobilityId];
    } else if (this.data.smartOfficeId) {
      this.asset = MockData[ASSETS_CONSTANTS.SMART_OFFICE][this.data.smartOfficeId];
      this.media = MockMedia[ASSETS_CONSTANTS.SMART_OFFICE][this.data.smartOfficeId];
    }

    this.web3Service.ready(async () => {
      const allowed = await this.devicesContract.isAllowed(this.data.deviceId, this.asset.dappId);
      if (allowed) {

        this.origQrAllowBuy = `buy://${this.asset.assetKey}#${this.asset.schemaId}#` +
          `${this.asset.amount}#${this.asset.dappId}#${encodeURI(this.asset.description)}`;

        this.interval$ = interval(1000).pipe(
          takeWhile(() => !this.allowed)
        ).subscribe(async () => {
          const allowedToReproduce = await this.devicesContract.checkOwnershipOneAssetForDevice(this.data.deviceId, this.data.videoId, this.asset.dappId);
          if (allowedToReproduce) {
            this.allowed = allowedToReproduce;
            this.dialogRef.close(true);
          }
        });
      } else {

        const deviceId = `one-time-device-for-${this.asset.assetKey}-${new Date().getTime()}`;

        this.origQrAllowBuy = `allow_buy://${this.asset.assetKey}#${this.asset.schemaId}#` +
          `${this.asset.amount}#${this.asset.dappId}#${encodeURI(this.asset.description)}#${encodeURI(deviceId)}`;

        this.interval$ = interval(1000).pipe(
          takeWhile(() => !this.allowed)
        ).subscribe(async () => {
          const allowedToReproduce = await this.devicesContract.isAllowed(deviceId, this.asset.dappId);
          if (allowedToReproduce) {
            this.allowed = allowedToReproduce;
            this.dialogRef.close(true);
          }
        });
      }

      if (this.data.pk) {
        const signature = this.crypt.signature(this.data.pk, this.origQrAllowBuy);
        this.secQrAllowBuy = JSON.parse(signature).signature;
      }
      this.qrAllowBuy = this.origQrAllowBuy;
    });
  }

  public ngOnDestroy() {
    this.interval$.unsubscribe();
  }

  public cancelDialog() {
    this.dialogRef.close(false);
    this.location.back();
  }

  public secureChange(event: MatSlideToggleChange) {
    console.log('Toggle fired');
    if (event.checked) {
      this.qrAllowBuy = `${this.origQrAllowBuy}##${this.secQrAllowBuy}`;
    } else {
      this.qrAllowBuy = this.origQrAllowBuy;
    }
  }
}
