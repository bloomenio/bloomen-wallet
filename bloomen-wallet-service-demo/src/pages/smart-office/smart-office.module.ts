// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { SmartOfficeRoutingModule } from './smart-office-routing.module';

// Home
import { SmartOfficeComponent } from './smart-office.component';
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
    SmartOfficeRoutingModule,
    MenuModule
  ],
  declarations: [SmartOfficeComponent]
})
export class SmartOfficeModule { }
