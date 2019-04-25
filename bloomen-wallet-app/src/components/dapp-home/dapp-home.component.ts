// Basic
import { Component, OnInit, OnDestroy, Input, ElementRef, Renderer2, ViewChild, AfterViewChecked } from '@angular/core';

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
import { AssetsContract, DevicesContract, ERC223Contract } from '@core/core.module';
import { TranslateService } from '@ngx-translate/core';
import { DappGeneralDialogComponent } from '@components/dapp-general-dialog/dapp-general-dialog.component';

import { AllowAndBuy, AllowObject, BuyObject } from '@models/operations.model';
import { resolve } from 'q';

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


  private static headerOffsetHeight: number;

  public dapp$: Subscription;

  public currentPage: number;

  public txActivity$: Subscription;

  public txActivityArray: TxActivityModel[];

  public buyObject: any;

  public isLoading$: Observable<boolean>;


  @Input() public dapp: Dapp;

  @ViewChild('recentActivity', { read: ElementRef }) public recentActivity: ElementRef;
  @ViewChild('newContent', { read: ElementRef }) public newContent: ElementRef;



  /**
   * Constructor to declare all the necesary to initialize the component.
   */
  constructor(
    public snackBar: MatSnackBar,
    private store: Store<any>,
    private assets: AssetsContract,
    private erc223: ERC223Contract,
    private devices: DevicesContract,
    private barCodeScannerService: BarCodeScannerService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private render: Renderer2
  ) {
  }

  public onResize() {
    if (this.recentActivity != null) {

      if (!DappHomeComponent.headerOffsetHeight) {
        DappHomeComponent.headerOffsetHeight = this.newContent.nativeElement.offsetHeight;
      }

      this.render.setStyle(
        this.recentActivity.nativeElement, 'margin-top', DappHomeComponent.headerOffsetHeight + 'px'
      );
    }
  }

  public ngOnInit() {
    this.txActivity$ = this.store.select(fromTxActivitySelectors.selectAllTxActivity).subscribe((txActivityArray) => {
      this.txActivityArray = txActivityArray.sort((a, b) => b.epoch - a.epoch);
      this.currentPage = Math.ceil(txActivityArray.length / 10);
      this.onResize();
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

  public async buyOrAllow() {
    this.barCodeScannerService.scan().then(result => {
      console.log(result);
      this.doOperation(result);
    });
  }

  private doOperation(inputValue: string) {
    if (inputValue !== null) {
      const valueCut = inputValue.indexOf('//') + 2;
      const operation = inputValue.slice(0, valueCut);
      const params = inputValue.slice(valueCut).split('#');

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
          this.Allow(allowObject);
          break;
        case QR_VALIDATOR.ALLOW_BUY:
          const allowBuyObject: AllowAndBuy = {
            dappId: params[3],
            assetId: parseInt(params[0], 10),
            schemaId: parseInt(params[1], 10),
            amount: parseInt(params[2], 10),
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

  public doBuyTranscation(): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      this.erc223.buy(this.buyObject.assetId, this.buyObject.schemaId, this.buyObject.amount, this.buyObject.dappId, this.buyObject.description)
        .then((result: any) => {
          log.debug('OK', result);
          this.snackBar.open(this.translate.instant('common.transaction_success'), null, {
            duration: 2000,
          });
          res();
        }, (error: any) => {
          log.debug('KO', error);
          this.snackBar.open(this.translate.instant('common.transaction_error'), null, {
            duration: 2000,
          });
          rej();
        });
    });
  }

  private Allow(allowObject: any): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      this.devices.handshake(allowObject.deviceHash, allowObject.assetId, allowObject.schemaId, allowObject.dappId)
        .then((result: any) => {
          log.debug('FOUNDED', result);
          this.snackBar.open(this.translate.instant('common.itemfounded'), null, {
            duration: 2000,
          });
          res();
        }, (error: any) => {
          log.debug('NO-FOUND_THEN-BUY', error);
          this.snackBar.open(this.translate.instant('common.noitemfound_nowbuy'), null, {
            duration: 2000,
          });
          rej();
        });
    });
  }

  private generteAllow(allowObject: any) {
    this.Allow(allowObject).catch(() => {
      this.buyObject = allowObject;
      this.doBuyTranscation().then(() => {
        this.Allow(allowObject);
      }, () => {
        log.debug(`you can't buy it =>`);
      });
    });
  }

}
