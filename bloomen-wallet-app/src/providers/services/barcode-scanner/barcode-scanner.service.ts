// Basic
import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material';
import { DappInputDialogComponent } from '@components/dapp-input-dialog/dapp-input-dialog.component';
import { TranslateService } from '@ngx-translate/core';

import { Observable, Subject } from 'rxjs';

// Ionic Native
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner';

// Config
import { barcodeScannerOptions } from '@config/barcode-scanner.config';

import { environment } from './../../../environments/environment';


/**
 * Service to create an abstract class with the barcode plugin and the application.
 */
@Injectable({ providedIn: 'root' })
export class BarCodeScannerService {

  private loader: Subject<boolean>;

  /**
   * Initialize all needed from the barcode service.
   * @param barcodeScanner Instance of the barcode plugin
   */
  constructor(private barcodeScanner: BarcodeScanner,
    private dialog: MatDialog,
    private translate: TranslateService) {
    this.loader = new Subject<boolean>();

  }

  public isLoading(): Observable<boolean> {
    return this.loader.asObservable();
  }
  /**
   * scan the QR code from the camera
   */

  public scan(): Promise<string> {
    this.loader.next(true);


    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (window['cordova']) {
            this.barcodeScanner.scan(barcodeScannerOptions).then(
              scanResult => {
                this.loader.next(false);
                resolve(scanResult.text);
              },
              error => reject(error));
        } else {
          this.loader.next(false);
          const dialogRef = this.dialog.open(DappInputDialogComponent, {
            width: '250px',
            data: {
              title: this.translate.instant('dapp.home.buy_content'),
              description: this.translate.instant('dapp.home.data'),
              buttonAccept: this.translate.instant('common.accept'),
              buttonCancel: this.translate.instant('common.cancel')
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              resolve(result);
            }
          });
        }
      }, environment.loaderTime);
    });
  }
}
