// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { NotificationDetailRoutingModule } from './notification-detail-routing.module';

// Components
import { NotificationDetailComponent } from './notification-detail.component';
import { MaterialModule } from '@app/material.module';

/**
 * Module to import and export all the components for the notification detail page.
 */
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    NotificationDetailRoutingModule
  ],
  declarations: [NotificationDetailComponent],
  exports: [NotificationDetailComponent]
})
export class NotificationDetailModule { }
