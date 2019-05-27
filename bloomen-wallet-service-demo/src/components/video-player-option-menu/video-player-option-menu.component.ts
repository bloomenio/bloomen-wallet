// Basic
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'blo-video-player-option-menu',
  templateUrl: 'video-player-option-menu.component.html',
  styleUrls: ['video-player-option-menu.component.scss']
})
export class VideoPlayerOptionMenuComponent implements OnInit {

  private videoId: string;

  constructor(
    public activatedRoute: ActivatedRoute
  ) {}
  public ngOnInit() {
    this.videoId = this.activatedRoute.snapshot.paramMap.get('videoId');
  }

  public doTip() {
    console.log('doTip...' + this.videoId );
  }

}
