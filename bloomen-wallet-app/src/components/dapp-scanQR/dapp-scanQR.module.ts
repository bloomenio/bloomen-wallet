// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';

// Components
import { DappScanQRComponent } from './dapp-scanQR.component';

import { DappInputDialogModule } from '@components/dapp-input-dialog/dapp-input-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    DappInputDialogModule
  ],
  declarations: [DappScanQRComponent],
  exports: [DappScanQRComponent],
  entryComponents: [DappScanQRComponent]
})
export class DappScanQRModule { }
