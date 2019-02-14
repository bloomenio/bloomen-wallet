// Basic
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'blo-card-zoom-dialog',
  templateUrl: 'card-zoom-dialog.component.html',
  styleUrls: ['card-zoom-dialog.component.scss']
})
export class CardZoomDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CardZoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

}
