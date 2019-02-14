// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';
import { DappLoginModule } from '@components/dapp-login/dapp-login.module';
import { DappGeneralDialogModule } from '@components/dapp-general-dialog/dapp-general-dialog.module';

// Components
import { DappCardComponent } from './dapp-card.component';

/**
 * Module to import and export all the components for the dapp component.
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    DappLoginModule,
    DappGeneralDialogModule
  ],
  declarations: [DappCardComponent],
  exports: [DappCardComponent]
})
export class DappCardModule {}
