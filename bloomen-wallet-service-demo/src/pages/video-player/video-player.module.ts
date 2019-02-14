// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { VideoPlayerRoutingModule } from './video-player-routing.module';

// Home
import { VideoPlayerComponent } from './video-player.component';

import { CredentialDialogModule } from '@components/credential-dialog/credential-dialog.module';

// Player
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { MenuModule } from '@components/menu/menu.module';

/**
 * Module to import and export all the components for the home page.
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    VideoPlayerRoutingModule,
    CredentialDialogModule,
    MenuModule,

    // Angular player
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  declarations: [VideoPlayerComponent]
})
export class VideoPlayerModule { }
