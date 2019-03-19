// Basic
import { Component } from '@angular/core';

import { MatSnackBar, MatDialog } from '@angular/material';
import { Logger } from '@services/logger/logger.service';
import { CredentialDialogComponent } from '@components/credential-dialog/credential-dialog.component';
import { ActivatedRoute } from '@angular/router';

import MediaMock from '../../assets/mock/media.json';
import { ASSETS_CONSTANTS } from '@core/constants/assets.constants.js';

const log = new Logger('mobility-exchange.component');

/**
 * Mobility exchange page
 */
@Component({
  selector: 'blo-mobility-exchange',
  templateUrl: './mobility-exchange.component.html',
  styleUrls: ['./mobility-exchange.component.scss']
})
export class MobilityExchangeComponent {

  public mobilityId: string;
  public mobilities: any;
  public exchanged = false;

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute
  ) {
    this.mobilityId = this.activatedRoute.snapshot.paramMap.get('mobilityId');
    this.mobilities = MediaMock[ASSETS_CONSTANTS.MOBILITY];
    setTimeout(() => this.openDialog());
  }

  private openDialog() {
    const dialogRef = this.dialog.open(CredentialDialogComponent, {
      maxWidth: '55vw',
      disableClose: true,
      data: {
        mobilityId: this.mobilityId,
        iconBuy: this.mobilities[this.mobilityId].dialogContent.iconBuy,
        textAllowBuy: this.mobilities[this.mobilityId].dialogContent.textAllowBuy,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.exchanged = result;
    });
  }
}
