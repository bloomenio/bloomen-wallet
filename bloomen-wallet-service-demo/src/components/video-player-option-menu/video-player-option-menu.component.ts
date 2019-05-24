// Basic
import { Component } from '@angular/core';

@Component({
  selector: 'blo-video-player-option-menu',
  templateUrl: 'video-player-option-menu.component.html',
  styleUrls: ['video-player-option-menu.component.scss']
})
export class VideoPlayerOptionMenuComponent {

  constructor(
  ) {}

  public doTip() {
    console.log('doTip...');
  }

}
