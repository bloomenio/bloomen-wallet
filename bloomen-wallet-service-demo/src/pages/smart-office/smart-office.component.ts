// Basic
import { Component } from '@angular/core';

import { MatSnackBar } from '@angular/material';

import MediaMock from '../../assets/mock/media.json';
import { ASSETS_CONSTANTS } from '@core/constants/assets.constants.js';

/**
 * Home page
 */
@Component({
  selector: 'blo-smart-office',
  templateUrl: './smart-office.component.html',
  styleUrls: ['./smart-office.component.scss']
})
export class SmartOfficeComponent {

  public smartOfficeServices: any;

  constructor(
    public snackBar: MatSnackBar,
  ) {
    this.smartOfficeServices = MediaMock[ASSETS_CONSTANTS.SMART_OFFICE];
  }


}
