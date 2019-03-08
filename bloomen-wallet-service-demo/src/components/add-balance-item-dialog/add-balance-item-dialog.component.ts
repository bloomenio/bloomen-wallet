// Basic
import { Component, Inject } from '@angular/core';
import { Logger } from '@services/logger/logger.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const log = new Logger('add-balance-item-dialog');

/**
 * balance item component
 */
@Component({
  selector: 'blo-add-balance-item-dialog',
  templateUrl: 'add-balance-item-dialog.component.html',
  styleUrls: ['add-balance-item-dialog.component.scss']
})
export class AddBalanceItemDialogComponent {

  public form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddBalanceItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder
  ) {
    this.form = fb.group({
      address: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
}
