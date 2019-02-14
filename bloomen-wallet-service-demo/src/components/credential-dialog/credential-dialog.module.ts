// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';


import { QRCodeModule } from 'angularx-qrcode';

// Modules
import { MaterialModule } from '@app/material.module';

// Components
import { CredentialDialogComponent } from './credential-dialog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    QRCodeModule
  ],
  declarations: [CredentialDialogComponent],
  exports: [CredentialDialogComponent],
  entryComponents: [CredentialDialogComponent]
})
export class CredentialDialogModule { }
