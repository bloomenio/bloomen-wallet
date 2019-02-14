// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { SmartOfficeExchangeRoutingModule } from './smart-office-exchange-routing.module';

// Home
import { SmartOfficeExchangeComponent } from './smart-office-exchange.component';
import { CredentialDialogModule } from '@components/credential-dialog/credential-dialog.module';
import { CodeExchangedModule } from '@components/code-exchanged/code-exchanged.module';
import { MenuModule } from '@components/menu/menu.module';

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
    SmartOfficeExchangeRoutingModule,
    CredentialDialogModule,
    CodeExchangedModule,
    MenuModule
  ],
  declarations: [SmartOfficeExchangeComponent]
})
export class SmartOfficeExchangeModule { }
