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
import { RpcDialogComponent } from '@components/rpc-dialog/rpc-dialog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule
  ],
  declarations: [HomeOptionsShellComponent, RpcDialogComponent],
  exports: [HomeOptionsShellComponent],
  entryComponents: [HomeOptionsShellComponent, RpcDialogComponent]
})
export class HomeOptionsShellModule { }
