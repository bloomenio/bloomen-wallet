// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';
import { DappScanQRModule } from '@components/dapp-scanQR/dapp-scanQR.module';
import { PipesModule } from '@pipes/pipes.module';

// Components
import { DappCreditHeaderComponent } from './dapp-credit-header.component';


/**
 * Module to import and export all the components for the dapp-credit-header component.
 */
@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    TranslateModule,
    FlexLayoutModule,
    DappScanQRModule,
    PipesModule
  ],
  declarations: [DappCreditHeaderComponent],
  exports: [DappCreditHeaderComponent]
})
export class DappCreditHeaderModule {}
