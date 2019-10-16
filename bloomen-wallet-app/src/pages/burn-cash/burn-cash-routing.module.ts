import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BurnCashComponent } from './burn-cash.component';

const routes: Routes = [
  // Module is lazy loaded, burn-cash-routing.module.ts
  {
    path: '',
    component: BurnCashComponent,
    data: {
      title: 'Burn cash',
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
export class BurnCashRoutingModule {}
