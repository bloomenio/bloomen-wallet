// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';

// Components
import { DeviceIdentityOptionMenuComponent } from './device-identity-option-menu.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule
  ],
  declarations: [DeviceIdentityOptionMenuComponent],
  exports: [DeviceIdentityOptionMenuComponent],
  entryComponents: [DeviceIdentityOptionMenuComponent]
})
export class DeviceIdentityOptionMenuModule { }
