import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Network } from '@ionic-native/network';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ApplicationDataStoreModule } from '@stores/application-data/application-data.module';
import { DappStoreModule } from '@stores/dapp/dapp.module';

import { environment } from '@env/environment';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { HomeModule } from '@pages/home/home.module';
import { ShellModule } from '@shell/shell.module';
import { NetworkStatusAlertModule } from '@components/network-status-alert/network-status-alert.module';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Store } from '@ngrx/store';

import * as fromAppActions from '@stores/application-data/application-data.actions';
import * as fromMnemonicActions from '@stores/mnemonic/mnemonic.actions';
import * as fromDappActions from '@stores/dapp/dapp.actions';
// new
import * as fromRecentUsersActions from '@stores/recent-users/recent-users.actions';


import * as fromAppSelectors from '@stores/application-data/application-data.selectors';
import * as fromMnemonicSelectors from '@stores/mnemonic/mnemonic.selectors';
import * as fromDappSelectors from '@stores/dapp/dapp.selectors';
// new
import * as fromRecentUsersSelectors from '@stores/recent-users/recent-users.selectors';


import { skipWhile, first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { BalanceStoreModule } from '@stores/balance/balance.module';
import { MnemonicStoreModule } from '@stores/mnemonic/mnemonic.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { devToolsConfig } from '@config/devtools.config';
import { TxActivityStoreModule } from '@stores/tx-activity/tx-activity.module';
import { DevicesStoreModule } from '@stores/devices/devices.module';
import { PurchasesStoreModule } from '@stores/purchases/purchases.module';
import { RecentUsersStoreModule } from '@stores/recent-users/recent-users.module';

export function onAppInit(store: Store<any>): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise<any>((resolve, reject) => {

      const appInit$ = store.select(fromAppSelectors.getApplicationData).pipe(skipWhile((value) => {
        return !value;
      }), first());

      const mnemonicInit$ = store.select(fromMnemonicSelectors.selectAllMnemonics).pipe(skipWhile((value) => {
        return !value;
      }), first());

      const dappsInit$ = store.select(fromDappSelectors.selectAllDapp).pipe(skipWhile((value) => {
        return !value;
      }), first());
      forkJoin([appInit$, mnemonicInit$, dappsInit$]).subscribe(() => {
        resolve();
      });
      store.dispatch(new fromAppActions.InitAppData());
      store.dispatch(new fromMnemonicActions.InitMnemonic());
      store.dispatch(new fromDappActions.InitDapps());
    });
  };
}

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', {
      enabled: environment.production
    }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule,
    SharedModule,
    ShellModule,
    HomeModule,
    FlexLayoutModule,
    NetworkStatusAlertModule,

    // Stores
    ApplicationDataStoreModule,
    DappStoreModule,
    BalanceStoreModule,
    MnemonicStoreModule,
    DevicesStoreModule,
    PurchasesStoreModule,
    TxActivityStoreModule,
    StoreDevtoolsModule.instrument(devToolsConfig),
    RecentUsersStoreModule,

    // Routing
    AppRoutingModule // must be imported as the last module as it contains the fallback route
  ],

  declarations: [AppComponent],
  providers: [

    // Ionic native
    BarcodeScanner,
    StatusBar,
    SplashScreen,
    Network,
    SocialSharing,

    // Initial data charge
    {
      provide: APP_INITIALIZER,
      useFactory: onAppInit,
      multi: true,
      deps: [Store]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
