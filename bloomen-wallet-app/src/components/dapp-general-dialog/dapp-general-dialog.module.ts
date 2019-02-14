// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';

// Components
import { DappGeneralDialogComponent } from './dapp-general-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule
  ],
  declarations: [DappGeneralDialogComponent],
  exports: [DappGeneralDialogComponent],
  entryComponents: [DappGeneralDialogComponent]
})
export class DappGeneralDialogModule { }
