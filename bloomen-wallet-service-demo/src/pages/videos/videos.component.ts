// Basic
import { Component } from '@angular/core';

import { MatSnackBar } from '@angular/material';
import { Logger } from '@services/logger/logger.service';

import MediaMock from '../../assets/mock/media.json';
import { ASSETS_CONSTANTS } from '@core/constants/assets.constants.js';

const log = new Logger('video.component');


/**
 * Home page
 */
@Component({
  selector: 'blo-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent {

  public videos: any;

  constructor(
    public snackBar: MatSnackBar,
  ) {
    this.videos = MediaMock[ASSETS_CONSTANTS.VIDEOS];
  }


}
