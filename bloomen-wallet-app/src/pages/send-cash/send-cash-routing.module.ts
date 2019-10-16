import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendCashComponent } from './send-cash.component';

const routes: Routes = [
  // Module is lazy loaded, send-cash-routing.module.ts
  {
    path: '',
    component: SendCashComponent,
    data: {
      title: 'Send cash',
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
export class SendCashRoutingModule {}
