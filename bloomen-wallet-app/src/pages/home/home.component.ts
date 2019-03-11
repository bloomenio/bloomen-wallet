// Basic
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dapp } from '@core/models/dapp.model';

import { Store } from '@ngrx/store';
import * as fromAppSelectors from '@stores/application-data/application-data.selectors';

import * as fromDappSelectors from '@stores/dapp/dapp.selectors';

import * as fromAppActions from '@stores/application-data/application-data.actions';
import * as fromDappActions from '@stores/dapp/dapp.actions';
import * as fromMnemonicActions from '@stores/mnemonic/mnemonic.actions';
import * as fromTxActivityActions from '@stores/tx-activity/tx-activity.actions';
import { THEMES } from '@core/constants/themes.constants.js';

import { Subscription } from 'rxjs';
import { skipWhile, first } from 'rxjs/operators';
import { MatSnackBar, MatDialog } from '@angular/material';
import { environment } from '@env/environment';
import { BarCodeScannerService } from '@services/barcode-scanner/barcode-scanner.service';
import { Logger } from '@services/logger/logger.service';
import { QR_VALIDATOR } from '@core/constants/qr-validator.constants';
import { TranslateService } from '@ngx-translate/core';

import { DappInputDialogComponent } from '@components/dapp-input-dialog/dapp-input-dialog.component';

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
  public dapps: Dapp[];

  private theme$: Subscription;

  private dapps$: Subscription;

  constructor(
    private store: Store<any>,
    public snackBar: MatSnackBar,
    private barCodeScannerService: BarCodeScannerService,
    private translate: TranslateService,
    private dialog: MatDialog,
  ) { }

  public ngOnInit() {
    this.dapps$ = this.store.select(fromDappSelectors.selectAllDapp).subscribe((dapps) => {
      this.dapps = dapps.sort((dapp1, dapp2) => dapp1.address.localeCompare(dapp2.address));

    });

    this.store.dispatch(new fromMnemonicActions.ChangeWallet({ randomSeed: environment.eth.generalSeed }));

    this.theme$ = this.store.select(fromAppSelectors.getTheme).pipe(
      skipWhile((theme) => theme === undefined),
      first()
    ).subscribe((theme) => {
      if (theme && theme !== THEMES.BLOOMEN) {
        this.store.dispatch(new fromAppActions.ChangeTheme({ theme: THEMES.BLOOMEN }));
      }
    });
  }

  public ngOnDestroy() {
    this.store.dispatch(new fromTxActivityActions.RemoveTxActivity());
    this.theme$.unsubscribe();
    this.dapps$.unsubscribe();
  }

  public dappTrackByFn(index: any, item: Dapp) {
    return item.address;
  }

  public async clickAddDapp() {
    this.barCodeScannerService.scan().then(result => {
      this.generateAddDapp(result);
    });
  }

  private generateAddDapp(inputValue: string) {
    if (inputValue.includes(QR_VALIDATOR.DAPP, 0)) {
      const address = inputValue.replace(QR_VALIDATOR.DAPP, '');
      this.store.dispatch(new fromDappActions.AddDapp({ address: address }));
    } else {
      log.error('KO', 'Bad QR prefix');
      this.snackBar.open(this.translate.instant('common.qr_invalid'), null, {
        duration: 2000,
      });
    }
  }


}
