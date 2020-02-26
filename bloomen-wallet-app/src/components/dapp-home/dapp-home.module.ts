// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';
import { DappCreditHeaderModule } from '@components/dapp-credit-header/dapp-credit-header.module';

// Components
import { DappHomeComponent } from './dapp-home.component';
import { DappInputDialogModule } from '@components/dapp-input-dialog/dapp-input-dialog.module';
import player from 'lottie-web';
import { LottieModule } from 'ngx-lottie';

export function playerFactory() {
  return player;
}

/**
 * Module to import and export all the components for the dapp-home component.
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    DappCreditHeaderModule,
    DappInputDialogModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  declarations: [DappHomeComponent],
  exports: [DappHomeComponent]
})
export class DappHomeModule { }
