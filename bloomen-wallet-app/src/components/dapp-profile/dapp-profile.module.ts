// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';


// Modules
import { MaterialModule } from '@app/material.module';
import { ClipboardModule } from 'ngx-clipboard';
import { QRCodeModule } from 'angularx-qrcode';
import { DappCreditHeaderModule } from '@components/dapp-credit-header/dapp-credit-header.module';

// Components
import { DappProfileComponent } from './dapp-profile.component';
import { ChangeRecentUserComponent } from './change-recent-user/change-recent-user.component';

/**
 * Module to import and export all the components for the dapp-profile component.
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    ClipboardModule,
    QRCodeModule,
    DappCreditHeaderModule,
    FormsModule
  ],
  declarations: [DappProfileComponent, ChangeRecentUserComponent],
  exports: [DappProfileComponent],
  entryComponents: [ChangeRecentUserComponent]
})
export class DappProfileModule {}
