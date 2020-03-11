// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SendCashRoutingModule } from './send-cash-routing.module';

// Components
import { SendCashComponent } from './send-cash.component';
import { MaterialModule } from '@app/material.module';
import { DappCreditHeaderModule } from '@components/dapp-credit-header/dapp-credit-header.module';
import { DappInputDialogModule } from '@components/dapp-input-dialog/dapp-input-dialog.module';
import { RecentUsersModule } from '@components/recent-users/recent-users.module';

/**
 * Module to import and export all the components for the tutorial page.
 */
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    SendCashRoutingModule,
    DappCreditHeaderModule,
    DappInputDialogModule,
    RecentUsersModule
  ],
  declarations: [SendCashComponent],
  exports: [SendCashComponent],
  entryComponents: []
})
export class SendCashModule { }
