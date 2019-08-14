// Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { HomeRoutingModule } from './home-routing.module';

// Home
import { HomeComponent } from './home.component';

// Services
import { HomeGuardRouteService } from '@services/home-guard-route/home-guard-route.service';
import { MenuModule } from '@components/menu/menu.module';

import { DappQRDialogModule } from '@components/dapp-qr-dialog/dapp-qr-dialog.module';

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
    DappQRDialogModule,
    MenuModule
  ],
  declarations: [HomeComponent],
  providers: [HomeGuardRouteService]
})
export class HomeModule { }
