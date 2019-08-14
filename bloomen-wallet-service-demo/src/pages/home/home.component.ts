// Basic
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromAppSelectors from '@stores/application-data/application-data.selectors';

import * as fromAppActions from '@stores/application-data/application-data.actions';

import { THEMES } from '@core/constants/themes.constants.js';

import { DappQRDialogComponent } from '@components/dapp-qr-dialog/dapp-qr-dialog.component';

import { Subscription } from 'rxjs';
import { skipWhile, first } from 'rxjs/operators';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Logger } from '@services/logger/logger.service';
import { Router } from '@angular/router';

const log = new Logger('home.component');


/**
 * Home page
 */
@Component({
  selector: 'blo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private theme$: Subscription;

  constructor(
    private store: Store<any>,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) { }

  public ngOnInit() {
    this.theme$ = this.store.select(fromAppSelectors.getTheme).pipe(
      skipWhile((theme) => theme === undefined),
      first()
    ).subscribe((theme) => {
      if (theme && theme !== THEMES['DEMO-DAPP']) {
        this.store.dispatch(new fromAppActions.ChangeTheme({ theme: THEMES['DEMO-DAPP'] }));
      }
    });
  }

  public ngOnDestroy() {
    this.theme$.unsubscribe();
  }

  public videosQRClick(): void {
    console.log('videosQRClick');
    this.dialog.open(DappQRDialogComponent, {
      data: {
        videoId: 1,
        title: 'Video',
        description: 'Add Video Dapp scanning the QR code.',
        qrData: 'dapp://0x59dDd952d8fb16313943d69E8535F354Eef049ec'
      }
    });
  }

  public mobilityQRClick(): void {
    console.log('mobilityQRClick');
    this.dialog.open(DappQRDialogComponent, {
      data: {
        videoId: 1,
        title: 'Mobility',
        description: 'Add Mobility Dapp scanning the QR code.',
        qrData: 'dapp://0x7F68C65545C81fa980D670FbB45C4B2BDcEba3af'
      }
    });
  }

  public smartOfficeQRClick(): void {
    console.log('smartOfficeQRClick');
    this.dialog.open(DappQRDialogComponent, {
      data: {
        videoId: 1,
        title: 'Smart Office',
        description: 'Add Smart Office Dapp scanning the QR code.',
        qrData: 'dapp://0xB044AACCA54ff4eeE2Def4e197213Aa809f8d813'
      }
    });
  }

}
