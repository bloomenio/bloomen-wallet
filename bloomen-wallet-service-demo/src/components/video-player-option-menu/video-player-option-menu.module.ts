// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';

// Components
import { VideoPlayerOptionMenuComponent } from './video-player-option-menu.component';
import { FormsModule } from '@angular/forms';
import { TipDialogModule } from '@components/tip-dialog/tip-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    TipDialogModule
  ],
  declarations: [VideoPlayerOptionMenuComponent],
  exports: [VideoPlayerOptionMenuComponent],
  entryComponents: [VideoPlayerOptionMenuComponent]
})
export class VideoPlayerOptionMenuModule { }
