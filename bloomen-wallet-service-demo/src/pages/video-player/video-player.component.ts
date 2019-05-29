// Basic
import { Component, AfterViewChecked, ChangeDetectorRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { MatSnackBar, MatDialog } from '@angular/material';
import { Logger } from '@services/logger/logger.service';
import { VgAPI } from 'videogular2/core';
import { CredentialDialogComponent } from '@components/credential-dialog/credential-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { MediaModel } from '@core/models/media.model';

import { environment } from '@env/environment';

import MediaMock from '../../assets/mock/media.json';
import { ASSETS_CONSTANTS } from '@core/constants/assets.constants.js';
import { DevicesContract } from '@core/core.module.js';
import { Store } from '@ngrx/store';

import * as fromDeviceSelector from '@stores/device-identity/device-identity.selectors';
import { Subscription } from 'rxjs';
import { Web3Service } from '@services/web3/web3.service.js';

const log = new Logger('video.component');


/**
 * Home page
 */
@Component({
  selector: 'blo-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {

  private api: VgAPI;
  private videoId: string;
  public video: MediaModel;

  public videoUrl: any;

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
    this.videoId = this.activatedRoute.snapshot.paramMap.get('videoId');
    this.video = MediaMock[ASSETS_CONSTANTS.VIDEOS][this.videoId];
    this.videoUrl = `${environment.serverUrl}${this.video.media.url}`;

    this.device$ = this.store.select(fromDeviceSelector.getIdentity).subscribe((device) => {

      this.device = device;

      this.web3Service.ready(async () => {
        const purchased = await this.devicesContract.checkOwnershipOneAssetForDevice(device, parseInt(this.videoId, 10), 'MWC-VIDEO');
        if (this.video.amount > 0 && !purchased) {
          setTimeout(() => this.openDialog());
        } else {
          setTimeout(() => this.api.play());
        }
      });
    })
  }

  public ngOnDestroy() {
    this.device$.unsubscribe();
  }

  public onPlayerReady(api: VgAPI) {
    this.api = api;
  }

  private openDialog() {
    const dialogRef = this.dialog.open(CredentialDialogComponent, {
      maxWidth: '55vw',
      disableClose: true,
      data: {
        videoId: this.videoId,
        deviceId: this.device,
        iconBuy: 'assets/icons/ic_wallet.svg',
        textAllowBuy: 'Scan QR to view/buy the content'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.api.play();
    });
  }

}
