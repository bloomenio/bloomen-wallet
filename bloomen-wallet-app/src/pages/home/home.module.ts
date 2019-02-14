// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { DappCardModule } from '@components/dapp-card/dapp-card.module';
import { HomeOptionsShellModule } from '@components/home-options-shell/home-options-shell.module';
import { HomeRoutingModule } from './home-routing.module';
import { DappInputDialogModule } from '@components/dapp-input-dialog/dapp-input-dialog.module';

// Home
import { HomeComponent } from './home.component';

// Services
import { HomeGuardRouteService } from '@services/home-guard-route/home-guard-route.service';

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
    HomeRoutingModule,
    DappCardModule,
    HomeOptionsShellModule,
    DappInputDialogModule
  ],
  declarations: [HomeComponent],
  providers: [HomeGuardRouteService]
})
export class HomeModule { }
