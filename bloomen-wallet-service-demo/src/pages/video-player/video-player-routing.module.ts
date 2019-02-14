import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@services/i18n/i18n.service';
import { VideoPlayerComponent } from './video-player.component';
import { MenuComponent } from '@components/menu/menu.component';


const routes: Routes = [
  {
    path: '',
    component: VideoPlayerComponent,
    data: {
      title: extract('Video Player'),
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
export class VideoPlayerRoutingModule { }
