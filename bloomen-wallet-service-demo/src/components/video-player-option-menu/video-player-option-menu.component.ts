// Basic
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Logger } from '@services/logger/logger.service';
import { MatDialog } from '@angular/material';
import { TipDialogComponent } from '@components/tip-dialog/tip-dialog.component';

const log = new Logger('blo-video-player-option-menu');

@Component({
  selector: 'blo-video-player-option-menu',
  templateUrl: 'video-player-option-menu.component.html',
  styleUrls: ['video-player-option-menu.component.scss']
})
export class VideoPlayerOptionMenuComponent implements OnInit {

  private videoId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) { }
  public ngOnInit() {
    this.videoId = this.activatedRoute.firstChild.snapshot.paramMap.get('videoId');
  }

  public doTip() {
    console.log('doTip...' + this.videoId);
    this.dialog.open(TipDialogComponent, {
      data: {
        videoId: this.videoId,
        title: 'Tips',
        description: 'Choose how many $ you want to tip:',
        buttonCancel: 'Cancel',
        buttonAccept: 'Tip'
      }
    });
  }
}
