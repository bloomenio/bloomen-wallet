// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClipboardModule } from 'ngx-clipboard';

// Modules
import { MaterialModule } from '@app/material.module';

// Components
import { CardZoomDialogComponent } from './card-zoom-dialog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    ClipboardModule
  ],
  declarations: [CardZoomDialogComponent],
  exports: [CardZoomDialogComponent],
  entryComponents: [CardZoomDialogComponent]
})
export class CardZoomDialogModule { }
