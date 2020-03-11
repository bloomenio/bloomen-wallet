// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

// Modules
import { MaterialModule } from '@app/material.module';

// Components
import { ChangeRecentUserComponent } from './change-recent-user.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [ChangeRecentUserComponent],
  exports: [ChangeRecentUserComponent],
  entryComponents: [ChangeRecentUserComponent]
})
export class ChangeRecentUserModule { }
