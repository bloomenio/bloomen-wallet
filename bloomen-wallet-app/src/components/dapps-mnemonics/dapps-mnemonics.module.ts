// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { DappCreditHeaderModule } from '@components/dapp-credit-header/dapp-credit-header.module';

// Components
import { DappsMnemonicsComponent } from './dapps-mnemonics.component';

/**
 * Module to import and export all the components for the dapp-settings component.
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    DappCreditHeaderModule
  ],
  declarations: [DappsMnemonicsComponent],
  exports: [DappsMnemonicsComponent]
})
export class DappsMnemonicsModule {}
