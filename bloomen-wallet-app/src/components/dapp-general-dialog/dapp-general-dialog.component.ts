// Basic
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Logger } from '@services/logger/logger.service';

const log = new Logger('dapp-dialog-remove.component');


@Component({
  selector: 'blo-dapp-general-dialog',
  templateUrl: 'dapp-general-dialog.component.html',
  styleUrls: ['dapp-general-dialog.component.scss']
})
export class DappGeneralDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DappGeneralDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public closeDialog() {
    this.dialogRef.close();
  }
}
