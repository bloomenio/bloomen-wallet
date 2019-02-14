// Basic
import { Component, AfterViewChecked, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';

import { MatSnackBar, MatDialog } from '@angular/material';
import { Logger } from '@services/logger/logger.service';
import { VgAPI } from 'videogular2/core';
import { CredentialDialogComponent } from '@components/credential-dialog/credential-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { MediaModel } from '@core/models/media.model';

import { environment } from '@env/environment';

import MediaMock from '../../assets/mock/media.json';
import { ASSETS_CONSTANTS } from '@core/constants/assets.constants.js';

const log = new Logger('video.component');


/**
 * Home page
 */
@Component({
  selector: 'blo-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  private api: VgAPI;
  private videoId: string;
  public video: MediaModel;

  public videoUrl: any;

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute
  ) { }

  public ngOnInit() {
    this.videoId = this.activatedRoute.snapshot.paramMap.get('videoId');
    this.video = MediaMock[ASSETS_CONSTANTS.VIDEOS][this.videoId];
    this.videoUrl = `${environment.serverUrl}${this.video.media.url}`;
    setTimeout(() => this.openDialog());
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
        textBuy: 'Buy the content scanning the QR code',
        iconBuy: 'assets/icons/ic_wallet.svg',
        textAllow: 'Scan QR to view the content'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.api.play();
    });
  }

}
