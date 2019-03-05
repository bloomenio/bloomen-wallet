import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@services/i18n/i18n.service';
import { BalanceDashboardComponent } from './balance-dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: BalanceDashboardComponent,
    data: {
      title: extract('Balance dashboard'),
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
export class BalanceDashboardRoutingModule { }
