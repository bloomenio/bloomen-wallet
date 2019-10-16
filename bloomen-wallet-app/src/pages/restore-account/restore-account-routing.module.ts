import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestoreAccountComponent } from './restore-account.component';

const routes: Routes = [
  // Module is lazy loaded, send-cash-routing.module.ts
  {
    path: '',
    component: RestoreAccountComponent,
    data: {
      title: 'Restore account',
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
