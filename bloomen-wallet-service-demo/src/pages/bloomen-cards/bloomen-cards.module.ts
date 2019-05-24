// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { BloomenCardsRoutingModule } from './bloomen-cards-routing.module';
import { ClipboardModule } from 'ngx-clipboard';
// Home
import { BloomenCardsComponent } from './bloomen-cards.component';
import { CardZoomDialogModule } from '@components/card-zoom-dialog/card-zoom-dialog.module';

/**
 * Module to import and export all the components for the home page.
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    CardZoomDialogModule,
    BloomenCardsRoutingModule,
    ClipboardModule
  ],
  declarations: [BloomenCardsComponent]
})
export class BloomenCardsModule { }
