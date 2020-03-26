// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from '@app/material.module';
import { DappCreditHeaderModule } from '@components/dapp-credit-header/dapp-credit-header.module';
import { PipesModule } from '@pipes/pipes.module';

// Components
import { DappHomeComponent } from './dapp-home.component';
import { DappInputDialogModule } from '@components/dapp-input-dialog/dapp-input-dialog.module';
import player from 'lottie-web';
import { LottieModule } from 'ngx-lottie';
import { ApplyDecimalsPipe } from '@pipes/apply-decimals.pipe';

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
    PipesModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  providers: [
    ApplyDecimalsPipe
  ],
  declarations: [DappHomeComponent],
  exports: [DappHomeComponent]
})
export class DappHomeModule { }
