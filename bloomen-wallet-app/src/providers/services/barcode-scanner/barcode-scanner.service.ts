// Basic
import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material';
import { DappInputDialogComponent } from '@components/dapp-input-dialog/dapp-input-dialog.component';
import { TranslateService } from '@ngx-translate/core';

import { Observable, Subject } from 'rxjs';

// Ionic Native
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { DappGeneralDialogComponent } from '@components/dapp-general-dialog/dapp-general-dialog.component';
// Config
import { barcodeScannerOptions } from '@config/barcode-scanner.config';

import { environment } from './../../../environments/environment';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { Image, getImageData } from '@canvas/image';
import jsQR from 'jsqr';

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
  constructor(
    private camera: Camera,
    private barcodeScanner: BarcodeScanner,
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
            reject(err);
          });
        } else {
          resolve();
        }
      });
    });
  }

  public scan(): Promise<string> {
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
                      resolve(qrData);
                    },
                    (error) => {
                      this.loader.next(false);
                      reject(error);
                    });
                } else {
                  this.loader.next(false);
                  resolve(scanResult.text);
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
