// Basic
import { Component, OnInit, OnDestroy, Input, Output, AfterViewChecked } from '@angular/core';

import { Dapp } from '@core/models/dapp.model.js';

import { Logger } from '@services/logger/logger.service.js';

import { MatSnackBar, MatDialog } from '@angular/material';

import { Store } from '@ngrx/store';

import * as fromTxActivitySelectors from '@stores/tx-activity/tx-activity.selectors';
import * as fromTxActivityActions from '@stores/tx-activity/tx-activity.actions';

import { Subscription, Observable } from 'rxjs';
import { TxActivityModel } from '@core/models/tx-activity.model';
import { BarCodeScannerService } from '@services/barcode-scanner/barcode-scanner.service';
import { QR_VALIDATOR} from '@core/constants/qr-validator.constants';
import { AssetsContract, DevicesContract } from '@core/core.module';
import { TranslateService } from '@ngx-translate/core';
import { DappGeneralDialogComponent } from '@components/dapp-general-dialog/dapp-general-dialog.component';

import { DappInputDialogComponent } from '@components/dapp-input-dialog/dapp-input-dialog.component';
import { pipe } from '@angular/core/src/render3';
import { skip } from 'rxjs/operators';
import {AllowAndBuy, AllowObject, BuyObject} from "@models/operations.model";
import { InitRecentUsersSuccess } from './../../providers/stores/recent-users/recent-users.actions';
import { element } from 'protractor';

const log = new Logger('dapp-home.component');

/**
 * Dapp-home component
 */
@Component({
  selector: 'blo-dapp-home',
  templateUrl: 'dapp-home.component.html',
  styleUrls: ['dapp-home.component.scss']
})
export class DappHomeComponent implements OnInit, OnDestroy, AfterViewChecked {

  public dapp$: Subscription;

  public currentPage: number;

  public txActivity$: Subscription;

  public txActivityArray: TxActivityModel[];

  public buyObject: any;

  public isLoading$: Observable<boolean>;

  @Input() public dapp: Dapp;
  @Output() public isLoadingCamera: boolean = false;
  
  
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

    public onResize() {
      if(document.getElementById('recentActivity') !== null) {
        document.getElementById('recentActivity').style.marginTop = document.getElementById('newContent').offsetHeight+"px";
      }
    }
    public ngAfterViewChecked() {
      this.onResize();
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
    this.isLoadingCamera = true;
    if (window['cordova']) {
      try {
        const scannedValue = await this.barCodeScannerService.scan();
        if ((scannedValue) && (!scannedValue.cancelled)) {
          this.isLoadingCamera = false;
          this.doOperation(scannedValue.text);
        } else {
          log.error('KO', 'Scan cancelled');
        }
      } catch {
        log.error('Error scanning the QR');
      }
    } else {
      this.isLoadingCamera = true;
      setTimeout(() =>{
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

      }, 3000);
      
    }
  }

  private doOperation(inputValue: string) {
    if (inputValue !== null) {
      const valueCut = inputValue.indexOf('//') + 2;
      let operation = inputValue.slice(0, valueCut);
      let params = inputValue.slice(valueCut, ).split('#');

      switch (operation) {
        case QR_VALIDATOR.BUY:
          const buyObject: BuyObject = {
            assetId: parseInt(params[0], 10),
            schemaId: parseInt(params[1], 10),
            amount: parseInt(params[2], 10),
            dappId: params[3],
            description: decodeURI(params[4])
          };
          console.log('Purchase', buyObject);
          this.buyObject = buyObject;
          this.generatePurchase();
          break;
        case QR_VALIDATOR.ALLOW:
          const allowObject: AllowObject = {
            deviceHash: decodeURI(params[0]),
            assetId: parseInt(params[1], 10),
            schemaId: parseInt(params[2], 10),
            dappId: params[3]
          };
          console.log('Allow', allowObject);
          this.generteAllow(allowObject);
          break;
        case QR_VALIDATOR.ALLOW_BUY:
          const allowBuyObject: AllowAndBuy ={
            dappId: params[3],
            assetId: parseInt(params[0], 10),
            schemaId: parseInt(params[1], 10),
            amount:  parseInt(params[2], 10),
            description: decodeURI(params[4]),
            deviceHash: decodeURI(params[5])
          };
          console.log('Allow and Buy', allowBuyObject);
          this.generteAllow(allowBuyObject);
          break;
        default:
          log.error('KO', 'Bad QR prefix');
          this.snackBar.open(this.translate.instant('common.qr_invalid'), null, {
            duration: 2000,
          });
          break;
      }
    } else {
      log.error('KO', 'Eny QR prefix');
      this.snackBar.open(this.translate.instant('common.qr_invalid'), null, {
        duration: 2000,
      });
    }
  }


  private generatePurchase() {
    const dialogRef = this.dialog.open(DappGeneralDialogComponent, {
      width: '250px',
      height: '200px',
      data: {
        title: this.translate.instant('dapp.notifications.dialog_buy.title'),
        description: this.translate.instant('dapp.notifications.dialog_buy.description', {
          id: this.buyObject.assetId,
          title: this.buyObject.description,
          price: this.buyObject.amount
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
    console.log(this.buyObject);
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

  private generteAllow(allowObject: any) {
    this.devices.handshake(allowObject.deviceHash, allowObject.assetId, allowObject.schemaId, allowObject.dappId)
        .then((result: any) => {
          log.debug('OK', result);
          this.snackBar.open(this.translate.instant('common.transaction_success'), null, {
            duration: 2000,
          });
        }, (error: any) => {
          if (allowObject.amount) {
            console.log('Try to buy asset');
            this.buyObject = allowObject;
            this.doBuyTranscation();
          } else {
            log.debug('KO', error);
            this.snackBar.open(this.translate.instant('common.transaction_error'), null, {
              duration: 2000,
            });
          }
        });
    }

}
