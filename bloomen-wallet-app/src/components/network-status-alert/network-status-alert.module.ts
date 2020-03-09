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
import { DappsMnmonicsComponent } from '@components/dapps-mnmonics/dapps-mnmonics';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule
  ],
  declarations: [NetworkStatusAlertComponent, DappsMnmonicsComponent],
  exports: [NetworkStatusAlertComponent],
  entryComponents: [NetworkStatusAlertComponent, DappsMnmonicsComponent]
})
export class NetworkStatusAlertModule { }
