import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@services/i18n/i18n.service';
import { VideosComponent } from './videos.component';
import { MenuComponent } from '@components/menu/menu.component';


const routes: Routes = [
  {
    path: '',
    component: VideosComponent,
    data: {
      title: extract('Video'),
      shellOptions: {
        hasBackButton: true,
        auxiliarOptionsComponent: MenuComponent
      }
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class VideosRoutingModule { }
