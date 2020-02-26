// Basic
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Logger } from '@services/logger/logger.service';

const log = new Logger('dapp-input-dialog.component');


@Component({
  selector: 'blo-dapp-input-dialog',
  templateUrl: 'dapp-input-dialog.component.html',
  styleUrls: ['dapp-input-dialog.component.scss']
})
export class DappInputDialogComponent {

  public value: string;

  constructor(
    public dialogRef: MatDialogRef<DappInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public closeDialog() {
    this.dialogRef.close();
  }
}
