// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';

// Components
import { DappOptionsShellComponent } from './dapp-options-shell.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule
  ],
  declarations: [DappOptionsShellComponent],
  exports: [DappOptionsShellComponent],
  entryComponents: [DappOptionsShellComponent]
})
export class DappOptionsShellModule { }
