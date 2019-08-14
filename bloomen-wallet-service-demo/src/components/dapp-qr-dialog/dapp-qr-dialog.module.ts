// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';

// Components
import { DappQRDialogComponent } from './dapp-qr-dialog.component';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    QRCodeModule,
    ClipboardModule,
  ],
  declarations: [DappQRDialogComponent],
  exports: [DappQRDialogComponent],
  entryComponents: [DappQRDialogComponent]
})
export class DappQRDialogModule { }
