// Basic
import { Component } from '@angular/core';
import CardsMock from 'assets/mock/cards.json';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CardZoomDialogComponent } from '@components/card-zoom-dialog/card-zoom-dialog.component';


/**
 * Bloomen Cards page
 */
@Component({
  selector: 'blo-bloomen-cards',
  templateUrl: './bloomen-cards.component.html',
  styleUrls: ['./bloomen-cards.component.scss']
})
export class BloomenCardsComponent {
  public cards: any;
  public dialogRef: MatDialogRef<CardZoomDialogComponent>;

  constructor(
    public dialog: MatDialog
  ) {
    this.cards = CardsMock.cards;
  }

  public zoomImage(card: any) {
    this.dialogRef = this.dialog.open(CardZoomDialogComponent, {
      maxWidth: '55vw',
      panelClass: 'bloomen-card-dialog',
      data: {
        img: card.img,
        secret: card.secret
      }
    });

    this.dialogRef.afterClosed().subscribe(() => this.dialogRef = undefined);
  }
}
