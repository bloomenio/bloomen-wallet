// Basic
import { Injectable } from '@angular/core';

// Ionic Native
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner';

// Config
import { barcodeScannerOptions } from '@config/barcode-scanner.config';

/**
 * Service to create an abstract class with the barcode plugin and the application.
 */
@Injectable({ providedIn: 'root' })
export class BarCodeScannerService {

  /**
   * Initialize all needed from the barcode service.
   * @param barcodeScanner Instance of the barcode plugin
   */
  constructor(private barcodeScanner: BarcodeScanner) { }

  /**
   * scan the QR code from the camera
   */
  public scan(): Promise<BarcodeScanResult> {
    return new Promise<BarcodeScanResult>((resolve, reject) => {
      this.barcodeScanner.scan(barcodeScannerOptions).then(
        scanResult => resolve(scanResult),
        error => reject(error)
      );
    });
  }
}
