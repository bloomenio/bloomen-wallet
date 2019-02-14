// Basic
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Dapp } from '@core/models/dapp.model.js';

import { Logger } from '@services/logger/logger.service.js';

import { MatSnackBar, MatDialog } from '@angular/material';

import { Store } from '@ngrx/store';

import * as fromTxActivitySelectors from '@stores/tx-activity/tx-activity.selectors';
import * as fromTxActivityActions from '@stores/tx-activity/tx-activity.actions';

import { Subscription } from 'rxjs';
import { TxActivityModel } from '@core/models/tx-activity.model';
import { BarCodeScannerService } from '@services/barcode-scanner/barcode-scanner.service';
import { QR_VALIDATOR } from '@core/constants/qr-validator.constants';
import { AssetsContract, DevicesContract } from '@core/core.module';
import { TranslateService } from '@ngx-translate/core';
import { DappGeneralDialogComponent } from '@components/dapp-general-dialog/dapp-general-dialog.component';

import { DappInputDialogComponent } from '@components/dapp-input-dialog/dapp-input-dialog.component';

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
  }

  public ngOnDestroy() {
    this.txActivity$.unsubscribe();
    this.store.dispatch(new fromTxActivityActions.RemoveTxActivity());
  }

  public clickMoreActivity() {
    this.store.dispatch(new fromTxActivityActions.MoreTxActivity({ page: ++this.currentPage }));
  }

  private buyContentDialog(buyObject) {
    this.buyObject = buyObject;
    const dialogRef = this.dialog.open(DappGeneralDialogComponent, {
      width: '250px',
      height: '200px',
      data: {
        title: this.translate.instant('dapp.notifications.dialog_buy.title'),
        description: this.translate.instant('dapp.notifications.dialog_buy.description', {
          id: buyObject.assetId,
          title: buyObject.description,
          price: buyObject.amount
        }),
        buttonAccept: this.translate.instant('common.accept'),
        buttonCancel: this.translate.instant('common.cancel')
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.doBuyTranscation();
      }
    });
  }

  public doBuyTranscation() {
    this.assets.buy(this.buyObject.assetId, this.buyObject.schemaId, this.buyObject.amount, this.buyObject.dappId, this.buyObject.description)
      .then((result: any) => {
        log.debug('OK', result);
        this.snackBar.open(this.translate.instant('common.transaction_success'), null, {
          duration: 2000,
        });
      }, (error: any) => {
        log.debug('KO', error);
        this.snackBar.open(this.translate.instant('common.transaction_error'), null, {
          duration: 2000,
        });
      });
  }

  public async buyContent() {
    if (window['cordova']) {
      try {
        const scannedValue = await this.barCodeScannerService.scan();
        if ((scannedValue) && (!scannedValue.cancelled)) {
          this.generatePurchase(scannedValue.text);
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
          title: this.translate.instant('Buy'),
          description: this.translate.instant('Put the date into the input field'),
          buttonAccept: this.translate.instant('Ok'),
          buttonCancel: this.translate.instant('Cancel')
        }
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result) {
          this.generatePurchase(result);
        }
      });
    }
  }

  private generatePurchase(inputValue: string) {
    if (inputValue.includes(QR_VALIDATOR.BUY, 0)) {
      const buyParams = inputValue.replace(QR_VALIDATOR.BUY, '').split('#');
      const buyObject = {
        assetId: parseInt(buyParams[0], 10),
        schemaId: parseInt(buyParams[1], 10),
        amount: parseInt(buyParams[2], 10),
        dappId: buyParams[3],
        description: decodeURI(buyParams[4])
      };
      this.buyContentDialog(buyObject);
    } else {
      log.error('KO', 'Bad QR prefix');
      this.snackBar.open(this.translate.instant('common.qr_invalid'), null, {
        duration: 2000,
      });
    }
  }

  public async allowAccess() {
    if (window['cordova']) {
      try {
        const scannedValue = await this.barCodeScannerService.scan();
        if ((scannedValue) && (!scannedValue.cancelled)) {
          this.generteAllow(scannedValue.text);
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
          title: this.translate.instant('Allow'),
          description: this.translate.instant('Put the date into the input field'),
          buttonAccept: this.translate.instant('Ok'),
          buttonCancel: this.translate.instant('Cancel')
        }
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result) {
          this.generteAllow(result);
        }
      });
    }
  }

  private generteAllow(inputValue: string) {
    if (inputValue.includes(QR_VALIDATOR.ALLOW, 0)) {
      const allowParams = inputValue.replace(QR_VALIDATOR.ALLOW, '').split('#');
      const allowObject = {
        deviceHash: decodeURI(allowParams[0]),
        assetId: parseInt(allowParams[1], 10),
        schemaId: parseInt(allowParams[2], 10),
        dappId: allowParams[3]
      };
      this.devices.handshake(allowObject.deviceHash, allowObject.assetId, allowObject.schemaId, allowObject.dappId)
        .then((result: any) => {
          log.debug('OK', result);
          this.snackBar.open(this.translate.instant('common.transaction_success'), null, {
            duration: 2000,
          });
        }, (error: any) => {
          log.debug('KO', error);
          this.snackBar.open(this.translate.instant('common.transaction_error'), null, {
            duration: 2000,
          });
        });
    } else {
      log.error('KO', 'Bad QR prefix');
      this.snackBar.open(this.translate.instant('common.qr_invalid'), null, {
        duration: 2000,
      });
    }
  }
}
