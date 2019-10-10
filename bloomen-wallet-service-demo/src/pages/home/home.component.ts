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
        qrData: 'dapp://0xCd23049d5190bc8a635671D3f857BEC1FDf923E8'
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
        qrData: 'dapp://0xFbCE6D21fe5C3c62a0Bd1aBAd7A10685C509aA86'
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
        qrData: 'dapp://0xa8eb63b28607c5d3D1F4F873f54aBA524778E233'
      }
    });
  }

}
