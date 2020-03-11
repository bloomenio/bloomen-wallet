// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';

// Components
import { NetworkStatusAlertComponent } from './network-status-alert.component';
import { DappsMnemonicsModule } from '@components/dapps-mnemonics/dapps-mnemonics.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    DappsMnemonicsModule
  ],
  declarations: [NetworkStatusAlertComponent],
  exports: [NetworkStatusAlertComponent],
  entryComponents: [NetworkStatusAlertComponent]
})
export class NetworkStatusAlertModule { }
