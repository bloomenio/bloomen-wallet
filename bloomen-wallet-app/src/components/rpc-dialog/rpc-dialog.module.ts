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
import { RpcDialogComponent } from './rpc-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [RpcDialogComponent],
  exports: [RpcDialogComponent],
  entryComponents: [RpcDialogComponent]
})
export class RpcDialogModule { }