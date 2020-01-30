// Basic
import { Component, OnInit, OnDestroy, Input, ElementRef, Renderer2, ViewChild, AfterViewChecked } from '@angular/core';

import { Dapp } from '@core/models/dapp.model.js';

import { Logger } from '@services/logger/logger.service.js';

import { MatSnackBar, MatDialog, MatIconRegistry } from '@angular/material';

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

import { AllowAndBuy } from '@models/operations.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Crypt, RSA } from 'hybrid-crypto-js';

const log = new Logger('dapp-home.component');

enum QR_ACTION {
  BUY ,
  ALLOW,
  RAW ,
  ALLOW_BUY
}

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

  public isLoading$: Observable<boolean>;

  public loadingMovementsConfig: any;

  private _dapp: any;

  private crypt: Crypt;


  @Input() public set dapp(value: any) {
    this._dapp = value;
  }

  @ViewChild('recentActivity', { read: ElementRef, static: true }) public recentActivity: ElementRef;
  @ViewChild('newContent', { read: ElementRef, static: true }) public newContent: ElementRef;

  constructor(
    public snackBar: MatSnackBar,
    private store: Store<any>,
    private assets: AssetsContract,
    private erc223: ERC223Contract,
    private devices: DevicesContract,
    private barCodeScannerService: BarCodeScannerService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private render: Renderer2,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    // Basic initialization
    this.crypt = new Crypt({ md: 'sha512' });

    this.loadingMovementsConfig = {
      path: 'assets/animation/animationMovements.json',
      renderer: 'svg',
      autoplay: true,
      loop: true
    };

    this.iconRegistry.addSvgIcon(
      'movements-no-data',
      this.sanitizer.bypassSecurityTrustResourceUrl('/../assets/icons/baseline-image_search-24px.svg'));
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

  public get dapp() {
    return this._dapp;
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
      log.debug(result);
      if (this.validSignature(result, (this._dapp.secure === 'true') ? this._dapp.publicKey : undefined)) {
        this.doOperation(result);
      } else {
        log.error('KO', 'Bad QR signature');
        this.snackBar.open(this.translate.instant('common.qr_invalid'), null, {
          duration: 2000,
        });
      }

    });
  }

  private validSignature(signedData, publicKey): boolean {
    if (publicKey) {
      const valueCut = signedData.indexOf('##');
      if (valueCut > 0) {
        const signature = signedData.slice(valueCut + 2);
        try {
          return this.crypt.verify(
            publicKey,
            JSON.stringify({signature, md: 'sha512'}),
            signedData.slice(0, valueCut)
          );
        } catch (error) {
          log.error(error);
          return false;
        }

      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  private doOperation(inputValue: string) {
    if (inputValue !== null) {

      const valueCut = inputValue.indexOf('//') + 2;
      const operation = inputValue.slice(0, valueCut);
      const params = inputValue.slice(valueCut).split('#');

      switch (operation) {
        case QR_VALIDATOR.RAW:
          const rawBuyObject: AllowAndBuy = {
            to:  params[0],
            amount: parseInt(params[1], 10),
            description: decodeURI(params[2]),
            params: params.slice(3).map((item) => decodeURI(item)),
          };
          this.processRequest(QR_ACTION.RAW, rawBuyObject);
          break;
        case QR_VALIDATOR.BUY:
          const buyObject: AllowAndBuy = {
            assetId: parseInt(params[0], 10),
            schemaId: parseInt(params[1], 10),
            amount: parseInt(params[2], 10),
            dappId: params[3],
            description: decodeURI(params[4])
          };
          this.processRequest(QR_ACTION.BUY, buyObject);
          break;
        case QR_VALIDATOR.ALLOW:
          const allowObject: AllowAndBuy = {
            deviceHash: decodeURI(params[0]),
            assetId: parseInt(params[1], 10),
            schemaId: parseInt(params[2], 10),
            dappId: params[3]
          };
          this.processRequest(QR_ACTION.ALLOW, allowObject);
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
          this.processRequest(QR_ACTION.ALLOW_BUY, allowBuyObject);
          break;
        default:
          log.error('KO', 'Bad QR prefix');
          this.snackBar.open(this.translate.instant('common.qr_invalid'), null, {
            duration: 2000,
          });
          break;
      }
    } else {
      log.error('KO', 'Bad QR prefix');
      this.snackBar.open(this.translate.instant('common.qr_invalid'), null, {
        duration: 2000,
      });
    }
  }

  private async processRequest(action: QR_ACTION, request: AllowAndBuy) {

    // TODO: adaptar a RAW sin DAPP
    if (action === QR_ACTION.RAW) {
      await this.generatePurchase(request);
    } else if ((request.dappId) && (this.dapp.dappId === request.dappId)) {
      const isowner = await this.assets.checkOwnership(request.assetId, request.schemaId, request.dappId);
      switch (action) {
        case QR_ACTION.ALLOW:
          if (isowner || request.assetId === 0) {
            await this.generateAllow(request);
          } else {
            this.snackBar.open(this.translate.instant('common.noitemfound_nowbuy'), null, {
              duration: 2000,
            });
          }
          break;
        case QR_ACTION.BUY:
          if (!isowner) {
            await this.generatePurchase(request);
          } else {
            this.snackBar.open(this.translate.instant('common.itemfounded'), null, {
              duration: 2000,
            });
          }
          break;
        case QR_ACTION.ALLOW_BUY:
          if (!isowner) {
            // ask for buy
            const purchased = await this.generatePurchase(request);
            if ( purchased ) {
              this.generateAllow(request);
            }
          } else {
            this.generateAllow(request);
          }
          break;
      }
    } else {
        // not same dapp
        this.snackBar.open(this.translate.instant('common.qr_invalid'), null, {
          duration: 2000,
        });
      }
  }

  private  generatePurchase( buyObject: AllowAndBuy ): Promise<boolean> {

    const dialogRef = this.dialog.open(DappGeneralDialogComponent, {
      width: '250px',
      height: '200px',
      data: {
        title: this.translate.instant('dapp.notifications.dialog_buy.title'),
        description: this.translate.instant('dapp.notifications.dialog_buy.description', {
          // id: buyObject.assetId,
          title: buyObject.description,
          price: buyObject.amount
        }),
        buttonAccept: this.translate.instant('common.accept'),
        buttonCancel: this.translate.instant('common.cancel')
      }
    });

    return new Promise<boolean>((resolve, reject) => {
      dialogRef.afterClosed().subscribe(value => {
        if (value) {
          this.erc223.buy(buyObject)
          .then((result: any) => {
            log.debug('OK', result);
            this.snackBar.open(this.translate.instant('common.transaction_success'), null, {
              duration: 2000,
            });
            resolve(true);
          }, (error: any) => {
            log.debug('KO', error);
            this.snackBar.open(this.translate.instant('common.transaction_error'), null, {
              duration: 2000,
            });
            resolve(false);
          });
        } else {
          // user cancel purchase
          resolve(false);
        }
      });
    });
  }

  private generateAllow(allowObject: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.devices.handshake(allowObject.deviceHash, allowObject.assetId, allowObject.schemaId, allowObject.dappId)
        .then((result: any) => {
          this.snackBar.open(this.translate.instant('common.transaction_success'), null, {
            duration: 2000,
          });
          resolve(true);
        }, (error: any) => {
          this.snackBar.open(this.translate.instant('common.transaction_error'), null, {
            duration: 2000,
          });
          reject(false);
        });
    });
  }

}

