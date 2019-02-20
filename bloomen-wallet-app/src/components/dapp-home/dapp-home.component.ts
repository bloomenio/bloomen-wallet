// Basic
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Dapp } from '@core/models/dapp.model.js';

import { Logger } from '@services/logger/logger.service.js';

import { MatSnackBar, MatDialog } from '@angular/material';

import { Store } from '@ngrx/store';

import * as fromTxActivitySelectors from '@stores/tx-activity/tx-activity.selectors';
import * as fromTxActivityActions from '@stores/tx-activity/tx-activity.actions';

import { Subscription, Observable } from 'rxjs';
import { TxActivityModel } from '@core/models/tx-activity.model';
import { BarCodeScannerService } from '@services/barcode-scanner/barcode-scanner.service';
import { QR_VALIDATOR } from '@core/constants/qr-validator.constants';
import { AssetsContract, DevicesContract } from '@core/core.module';
import { TranslateService } from '@ngx-translate/core';
import { DappGeneralDialogComponent } from '@components/dapp-general-dialog/dapp-general-dialog.component';

import { DappInputDialogComponent } from '@components/dapp-input-dialog/dapp-input-dialog.component';
import { pipe } from '@angular/core/src/render3';
import { skip } from 'rxjs/operators';

const log = new Logger('dapp-home.component');

/**
 * Dapp-home component
 */
@Component({
  selector: 'blo-dapp-home',
  templateUrl: 'dapp-home.component.html',
  styleUrls: ['dapp-home.component.scss']
})
export class DappHomeComponent implements OnInit, OnDestroy {

  public dapp$: Subscription;

  public currentPage: number;

  public txActivity$: Subscription;

  public txActivityArray: TxActivityModel[];

  public buyObject: any;

  public isLoading$: Observable<boolean>;

  @Input() public dapp: Dapp;

  /**
   * Constructor to declare all the necesary to initialize the component.
   */
  constructor(
    public snackBar: MatSnackBar,
    private store: Store<any>,
    private assets: AssetsContract,
    private devices: DevicesContract,
    private barCodeScannerService: BarCodeScannerService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {
  }

  public ngOnInit() {
    this.txActivity$ = this.store.select(fromTxActivitySelectors.selectAllTxActivity).subscribe((txActivityArray) => {
      this.txActivityArray = txActivityArray.sort((a, b) => b.epoch - a.epoch);
      this.currentPage = Math.ceil(txActivityArray.length / 10);
    });
    this.isLoading$ = this.store.select(fromTxActivitySelectors.getIsLoading);
  }

  public ngOnDestroy() {
    this.txActivity$.unsubscribe();
    this.store.dispatch(new fromTxActivityActions.RemoveTxActivity());
  }

  public clickMoreActivity() {
    this.store.dispatch(new fromTxActivityActions.MoreTxActivity({ page: ++this.currentPage }));
  }

  public async buyOrAllow(){
    if (window['cordova']) {
      try {
        const scannedValue = await this.barCodeScannerService.scan();
        if ((scannedValue) && (!scannedValue.cancelled)) {
          this.doOperation(scannedValue.text);
        } else {
          log.error('KO', 'Scan cancelled');
        }
      } catch {
        log.error('Error scanning the QR');
      }
    } else {
      const dialogRef = this.dialog.open(DappInputDialogComponent, {
        width: '250px',
        data: {
          // Juan aqui no mires, jordi me ha dicho que no lo traduzca, lo dejo con el instant para que si algun dia lo tenemos que traducir
          // lo hagamos :(
          title: this.translate.instant('Buy or Allow'),
          description: this.translate.instant('Put the date into the input field'),
          buttonAccept: this.translate.instant('Ok'),
          buttonCancel: this.translate.instant('Cancel')
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.doOperation(result);
        }
      });
    }
  }


  private doOperation(result: any) {

  }
}
