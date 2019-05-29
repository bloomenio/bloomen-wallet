// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { RestoreAccountRoutingModule } from './restore-account-routing.module';

// Components
import { RestoreAccountComponent } from './restore-account.component';
import { MaterialModule } from '@app/material.module';
import {DappsMnmonicsComponent} from '@components/dapps-mnmonics/dapps-mnmonics';

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
    RestoreAccountRoutingModule
  ],
  declarations: [RestoreAccountComponent, DappsMnmonicsComponent],
  exports: [RestoreAccountComponent],
  entryComponents: [DappsMnmonicsComponent]
})
export class RestoreAccountModule { }
