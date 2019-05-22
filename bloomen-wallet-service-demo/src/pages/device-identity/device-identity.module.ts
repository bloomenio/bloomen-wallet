// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { DeviceIdentityRoutingModule } from './device-identity-routing.module';

// Components
import { DeviceIdentityComponent } from './device-identity.component';
import { MenuModule } from '@components/menu/menu.module';
import { DeviceIdentityOptionMenuModule } from '@components/device-identity-option-menu/device-identity-option-menu.module';



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
    DeviceIdentityRoutingModule,
    MenuModule,
    DeviceIdentityOptionMenuModule
  ],
  declarations: [DeviceIdentityComponent]
})
export class DeviceIdentityModule { }
