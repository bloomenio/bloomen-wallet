import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@services/i18n/i18n.service';
import { VideoPlayerComponent } from './video-player.component';
import { VideoPlayerOptionMenuComponent } from '@components/video-player-option-menu/video-player-option-menu.component';


const routes: Routes = [
  {
    path: '',
    component: VideoPlayerComponent,
    data: {
      title: extract('Video Player'),
      shellOptions: {
        hasBackButton: true,
        auxiliarOptionsComponent: VideoPlayerOptionMenuComponent
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
