import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationDetailComponent } from './notification-detail.component';

const routes: Routes = [
  // Module is lazy loaded, see notification-detail-routing.module.ts
  {
    path: '',
    component: NotificationDetailComponent,
    data: {
      title: 'Notification detail',
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
