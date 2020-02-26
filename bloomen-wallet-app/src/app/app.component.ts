import { Component, OnInit, NgZone } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { environment } from '@env/environment';
import { Logger } from '@services/logger/logger.service';
import { NetworkStatus } from '@services/network-status/network-status.service';
import {RpcSubprovider} from '@services/web3/rpc-subprovider';

import { Store, select } from '@ngrx/store';

import * as fromSelectors from '@stores/application-data/application-data.selectors';
import * as fromActions from '@stores/application-data/application-data.actions';
import * as fromMnemonicActions from '@stores/mnemonic/mnemonic.actions';

import { ApplicationDataStateModel } from '@core/models/application-data-state.model';

import { NetworkStatusAlertComponent } from '@components/network-status-alert/network-status-alert.component';
import { en, el } from '@i18n/locales';

const log = new Logger('App');

@Component({
  selector: 'blo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public theme$: Observable<string>;
  private _dialogRef: MatDialogRef<NetworkStatusAlertComponent>;
  private _rpcOnline = true;
  private _online = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translateService: TranslateService,
    private zone: NgZone,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private networkStatus: NetworkStatus,
    private rpcSubprovider: RpcSubprovider,
    private store: Store<ApplicationDataStateModel>,
    private dialog: MatDialog
  ) { }

  public ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    this.theme$ = this.store.pipe(select(fromSelectors.getTheme));

    const onNavigationEnd = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );

    // Publish the languages and set default en just for the translateService.
    this.translateService.setTranslation('en', en);
    this.translateService.setTranslation('el', el);
    this.translateService.setDefaultLang('en');

    // Change page title on navigation or language change, based on route data
    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(this.translateService.instant(title));
        }
      });

    // Precache images
    this.store.dispatch(new fromActions.PreloadImage('assets/tutorial/0.png'));
    this.store.dispatch(new fromActions.PreloadImage('assets/tutorial/1.png'));
    this.store.dispatch(new fromActions.PreloadImage('assets/tutorial/2.png'));
    this.store.dispatch(new fromActions.PreloadImage('assets/tutorial/3.png'));

    this.store.dispatch(new fromActions.PreloadImage('assets/img_no_connection.png'));
    this.store.dispatch(new fromActions.PreloadImage('assets/logo_bloomen_black.png'));
    this.store.dispatch(new fromActions.PreloadImage('assets/logo_bloomen_white.png'));

    // Cordova platform and plugins initialization
    document.addEventListener(
      'deviceready',
      () => {
        this.zone.run(() => this._onCordovaReady());
      },
      false
    );

    this.rpcSubprovider.errorStateObserver().subscribe(isOffline => {
      this._rpcOnline = ! isOffline;
      this.checkOnline();
    });
  }

  private _onCordovaReady() {
    if (window['cordova']) {
      window['Keyboard'].hideFormAccessoryBar(true);
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#f5f5f5');
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Register the event listener
      document.addEventListener('backbutton', () => {
        log.debug('backbutton pressed');
      }, false);
    }
    this.networkStatus.onlineObserver().subscribe(isOnline => {
      this._online = isOnline;
      this.checkOnline();
    });

  }

  private checkOnline() {
     (this._online && this._rpcOnline) ? this._showOnline() : this._showOffline();
  }

  private _showOnline() {
    if (this._dialogRef) {
      this._dialogRef.close();
      this._dialogRef = null;
      this.store.dispatch(new fromMnemonicActions.RefreshWallet());
    }
  }

  private _showOffline() {
    if ((!this._online || !this._rpcOnline) && !this._dialogRef) {
      this._dialogRef = this.dialog.open(NetworkStatusAlertComponent, {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        panelClass: 'fullscreen-dialog',
        disableClose: true,
        hasBackdrop: false,
        autoFocus: false
      });
    }
  }

}
