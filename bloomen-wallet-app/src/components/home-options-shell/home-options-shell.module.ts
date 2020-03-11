// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule, CoreModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';

// Components
import { HomeOptionsShellComponent } from './home-options-shell.component';
import { RpcDialogModule } from '@components/rpc-dialog/rpc-dialog.module';


import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    RpcDialogModule
  ],
  declarations: [HomeOptionsShellComponent],
  exports: [HomeOptionsShellComponent],
  entryComponents: [HomeOptionsShellComponent]
})
export class HomeOptionsShellModule { }
