// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { BurnCashRoutingModule } from './burn-cash-routing.module';

// Components
import { BurnCashComponent } from './burn-cash.component';
import { MaterialModule } from '@app/material.module';
import { DappCreditHeaderModule } from '@components/dapp-credit-header/dapp-credit-header.module';
import { DappInputDialogModule } from '@components/dapp-input-dialog/dapp-input-dialog.module';
import { RecentUsersComponent } from '@components/recent-users/recent-users.component';

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
    BurnCashRoutingModule,
    DappCreditHeaderModule,
    DappInputDialogModule
  ],
  declarations: [BurnCashComponent],
  exports: [BurnCashComponent],
  entryComponents: []
})
export class BurnCashModule { }
