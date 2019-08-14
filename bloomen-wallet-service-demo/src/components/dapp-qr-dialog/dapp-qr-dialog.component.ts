// Basic
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Logger } from '@services/logger/logger.service';
import { SchemasContract } from '@core/core.module';
import { Web3Service } from '@services/web3/web3.service';
import { SchemaModel } from '@core/models/schema.model';

const log = new Logger('dapp-qr-dialog.component');

@Component({
  selector: 'blo-dapp-qr-dialog',
  templateUrl: 'dapp-qr-dialog.component.html',
  styleUrls: ['dapp-qr-dialog.component.scss']
})
export class DappQRDialogComponent  {

  constructor(
    public dialogRef: MatDialogRef<DappQRDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  public closeDialog() {
    this.dialogRef.close();
  }
}
