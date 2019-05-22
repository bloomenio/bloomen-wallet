import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@services/i18n/i18n.service';
import { DeviceIdentityComponent } from './device-identity.component';
import { DeviceIdentityOptionMenuComponent } from '@components/device-identity-option-menu/device-identity-option-menu.component';



const routes: Routes = [
  {
    path: '',
    component: DeviceIdentityComponent,
    data: {
      title: extract('Device Identity'),
      shellOptions: {
        hasBackButton: true,
        auxiliarOptionsComponent: DeviceIdentityOptionMenuComponent
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DeviceIdentityRoutingModule { }
