import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@services/i18n/i18n.service';
import { NotificationDetailComponent } from './notification-detail.component';

const routes: Routes = [
  // Module is lazy loaded, see notification-detail-routing.module.ts
  {
    path: '',
    component: NotificationDetailComponent,
    data: {
      title: extract('Notification detail'),
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
export class NotificationDetailRoutingModule {}
