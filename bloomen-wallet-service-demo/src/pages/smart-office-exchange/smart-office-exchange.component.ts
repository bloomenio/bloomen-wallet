// Basic
import { Component } from '@angular/core';

import { MatSnackBar, MatDialog } from '@angular/material';
import { CredentialDialogComponent } from '@components/credential-dialog/credential-dialog.component';
import { ActivatedRoute } from '@angular/router';

import MediaMock from '../../assets/mock/media.json';
import { ASSETS_CONSTANTS } from '@core/constants/assets.constants.js';

/**
 * SmartOffice exchange page
 */
@Component({
  selector: 'blo-smart-office-exchange',
  templateUrl: './smart-office-exchange.component.html',
  styleUrls: ['./smart-office-exchange.component.scss']
})
export class SmartOfficeExchangeComponent {

  public smartOfficeId: string;
  public smartOfficeServices: any;
  public exchanged = false;

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute
  ) {
    this.smartOfficeId = this.activatedRoute.snapshot.paramMap.get('smartOfficeId');
    this.smartOfficeServices = MediaMock[ASSETS_CONSTANTS.SMART_OFFICE];
    setTimeout(() => this.openDialog());
  }

  private openDialog() {
    const dialogRef = this.dialog.open(CredentialDialogComponent, {
      maxWidth: '55vw',
      disableClose: true,
      data: {
        smartOfficeId: this.smartOfficeId,
        textBuy: this.smartOfficeServices[this.smartOfficeId].dialogContent.textBuy,
        iconBuy: this.smartOfficeServices[this.smartOfficeId].dialogContent.iconBuy,
        textAllow: this.smartOfficeServices[this.smartOfficeId].dialogContent.textAllow
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.exchanged = result;
    });
  }
}
