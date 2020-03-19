// Basic
import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { DappInputDialogComponent } from '@components/dapp-input-dialog/dapp-input-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { Logger } from '@services/logger/logger.service.js';
import { Observable, Subject } from 'rxjs';

// Ionic Native
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { DappGeneralDialogComponent } from '@components/dapp-general-dialog/dapp-general-dialog.component';
// Config
import { barcodeScannerOptions } from '@config/barcode-scanner.config';

import { environment } from './../../../environments/environment';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { StatusBar } from '@ionic-native/status-bar';

import { Image, getImageData } from '@canvas/image';
import jsQR from 'jsqr';
import { Crypt } from 'hybrid-crypto-js';

const log = new Logger('dapp-home.component');

/**
 * Service to create an abstract class with the barcode plugin and the application.
 */
@Injectable({ providedIn: 'root' })
export class BarCodeScannerService {

  private loader: Subject<boolean>;
  private crypt: Crypt;

  /**
   * Initialize all needed from the barcode service.
   * @param barcodeScanner Instance of the barcode plugin
   */
  constructor(
    private camera: Camera,
    private barcodeScanner: BarcodeScanner,
    private dialog: MatDialog,
    private statusBar: StatusBar,
    private translate: TranslateService) {
    this.loader = new Subject<boolean>();
    // Basic initialization
    this.crypt = new Crypt({ md: 'sha512' });

  }

  public isLoading(): Observable<boolean> {
    return this.loader.asObservable();
  }
  /**
   * scan the QR code from the camera
   */

  private tryCameraRoll(): Promise<string> {

    return new Promise((resolve, reject) => {

      const dialogRef = this.dialog.open(DappGeneralDialogComponent, {
        width: '250px',
        height: '200px',
        data: {
          title: this.translate.instant('dapp.scanQR.album.title'),
          description: this.translate.instant('dapp.scanQR.album.description'),
          buttonAccept: this.translate.instant('common.accept'),
          buttonCancel: this.translate.instant('common.cancel')
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
          };

          this.camera.getPicture(options).then((imageData) => {
            this.statusBar.overlaysWebView(true);
            this.statusBar.overlaysWebView(false);
            // imageData is either a base64 encoded string or a file URI
            const base64Image  = 'data:image/jpeg;base64,' + imageData;
            const img = new Image();
            img.src = base64Image;
            img.onload = () => {
              const code = jsQR(getImageData(img).data, img.width, img.height);
              if (code) {
                resolve(code.data);
              } else {
                resolve('');
              }
            };
          }, (err) => {
            this.statusBar.overlaysWebView(true);
            this.statusBar.overlaysWebView(false);
            reject(err);
          });
        } else {
          resolve();
        }
      });
    });
  }


  private validSignature(signedData: string, publicKey: string): boolean {
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

  public scan(publicKey?: string): Promise<string> {
    this.loader.next(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (window['cordova']) {
            this.barcodeScanner.scan(barcodeScannerOptions).then(
              scanResult => {
                if ( scanResult.cancelled) {
                  this.tryCameraRoll().then(
                    (qrData) => {
                      this.loader.next(false);
                      resolve(this.validSignature(qrData, publicKey) ? qrData : '' );
                    },
                    (error) => {
                      this.loader.next(false);
                      reject(error);
                    });
                } else {
                  this.loader.next(false);
                  resolve(this.validSignature(scanResult.text, publicKey) ? scanResult.text : '' );
                }
              },
              error => {
                this.loader.next(false);
                reject(error);
              });
        } else {
          this.loader.next(false);
          const dialogRef = this.dialog.open(DappInputDialogComponent, {
            width: '250px',
            data: {
              title: this.translate.instant('dapp.home.qr_title'),
              description: this.translate.instant('dapp.home.qr_data'),
              buttonAccept: this.translate.instant('common.accept'),
              buttonCancel: this.translate.instant('common.cancel')
            }
          });
          dialogRef.afterClosed().subscribe(result => {
              resolve(this.validSignature(result, publicKey) ? result : '');
          });
        }
      }, environment.loaderTime);
    });
  }
}
