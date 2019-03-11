// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { BalanceDashboardRoutingModule } from './balance-dashboard-routing.module';

// Components
import { BalanceDashboardComponent } from './balance-dashboard.component';
import { MenuModule } from '@components/menu/menu.module';
import { BalanceItemModule } from '@components/balance-item/balance-item.module';
import { AddBalanceItemDialogModule } from '@components/add-balance-item-dialog/add-balance-item-dialog.module';
import { RemoveBalanceItemDialogModule } from '@components/remove-balance-item-dialog/remove-balance-item-dialog.module';

import { DashboardOptionMenuModule } from '@components/dashboard-option-menu/dashboard-option-menu.module';

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
    BalanceDashboardRoutingModule,
    MenuModule,
    BalanceItemModule,
    AddBalanceItemDialogModule,
    RemoveBalanceItemDialogModule,
    DashboardOptionMenuModule
  ],
  declarations: [BalanceDashboardComponent]
})
export class BalanceDashboardModule { }
