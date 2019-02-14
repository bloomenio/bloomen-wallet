// Basic
import { Component } from '@angular/core';

import { MatSnackBar } from '@angular/material';
import { Logger } from '@services/logger/logger.service';

import MediaMock from '../../assets/mock/media.json';
import { ASSETS_CONSTANTS } from '@core/constants/assets.constants.js';

const log = new Logger('mobility.component');


/**
 * Home page
 */
@Component({
  selector: 'blo-mobility',
  templateUrl: './mobility.component.html',
  styleUrls: ['./mobility.component.scss']
})
export class MobilityComponent {

  public mobilities: any;

  constructor(
    public snackBar: MatSnackBar,
  ) {
    this.mobilities = MediaMock[ASSETS_CONSTANTS.MOBILITY];
  }


}
