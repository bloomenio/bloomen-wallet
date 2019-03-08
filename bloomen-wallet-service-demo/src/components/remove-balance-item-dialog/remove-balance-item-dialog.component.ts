// Basic
import { Component, Inject } from '@angular/core';
import { Logger } from '@services/logger/logger.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const log = new Logger('remove-balance-item-dialog');

/**
 * balance item component
 */
@Component({
  selector: 'blo-remove-balance-item-dialog',
  templateUrl: 'remove-balance-item-dialog.component.html',
  styleUrls: ['remove-balance-item-dialog.component.scss']
})
export class RemoveBalanceItemDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RemoveBalanceItemDialogComponent>
  ) { }

  public close() {
    this.dialogRef.close();
  }
}
