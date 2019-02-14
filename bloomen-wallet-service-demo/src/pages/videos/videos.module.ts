// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { VideosRoutingModule } from './videos-routing.module';

// Home
import { VideosComponent } from './videos.component';
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
    VideosRoutingModule,
    MenuModule
  ],
  declarations: [VideosComponent]
})
export class VideosModule { }
