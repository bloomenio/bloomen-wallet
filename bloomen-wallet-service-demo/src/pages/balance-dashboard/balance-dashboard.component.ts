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
  selector: 'blo-balance-dashboard',
  templateUrl: './balance-dashboard.component.html',
  styleUrls: ['./balance-dashboard.component.scss']
})
export class BalanceDashboardComponent {

  public videos: any;

  constructor(
    public snackBar: MatSnackBar,
  ) {
    this.videos = MediaMock[ASSETS_CONSTANTS.VIDEOS];
  }


}
