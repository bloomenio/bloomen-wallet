// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';

// Modules - TABS
import { DappHomeModule } from '@components/dapp-home/dapp-home.module';
import { DappProfileModule } from '@components/dapp-profile/dapp-profile.module';
import { DappNotificationsModule } from '@components/dapp-notifications/dapp-notifications.module';
import { DappShoppingListModule } from '@components/dapp-shopping-list/dapp-shopping-list.module';

import { DappOptionsShellModule } from '@components/dapp-options-shell/dapp-options-shell.module';
import { DappSectionsRoutingModule } from './dapp-sections-routing.module';
import { DappCreditHeaderModule } from '@components/dapp-credit-header/dapp-credit-header.module';

// Components
import { DappSectionsComponent } from './dapp-sections.component';

/**
 * Module to import and export all the components for the dapp-sections page.
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    DappSectionsRoutingModule,
    DappHomeModule,
    DappProfileModule,
    DappNotificationsModule,
    DappShoppingListModule,
    DappOptionsShellModule,
    DappCreditHeaderModule
  ],
  declarations: [DappSectionsComponent]
})
export class DappSectionsModule { }
