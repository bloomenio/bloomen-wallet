import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@services/i18n/i18n.service';
import { RestoreAccountComponent } from './restore-account.component';

const routes: Routes = [
  // Module is lazy loaded, send-cash-routing.module.ts
  {
    path: '',
    component: RestoreAccountComponent,
    data: {
      title: extract('Restore account'),
      shellOptions: {
        hasBackButton: true
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RestoreAccountRoutingModule {}
