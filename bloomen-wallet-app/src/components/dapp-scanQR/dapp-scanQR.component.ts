// Basic
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { BarCodeScannerService } from '@services/barcode-scanner/barcode-scanner.service';
import { Logger } from '@services/logger/logger.service';
import { Dapp } from '@core/models/dapp.model';
import { PrepaidCardManagerContract } from '@core/core.module';
import { MatSnackBar } from '@angular/material';
import { QR_VALIDATOR } from '@core/constants/qr-validator.constants';
import { TranslateService } from '@ngx-translate/core';

import { DappInputDialogComponent } from '@components/dapp-input-dialog/dapp-input-dialog.component';

const log = new Logger('dapp-scanQR.component');


@Component({
  selector: 'blo-dapp-scanqr',
  templateUrl: 'dapp-scanQR.component.html',
  styleUrls: ['dapp-scanQR.component.scss']
})
export class DappScanQRComponent {

  constructor(
    public dialogRef: MatDialogRef<DappScanQRComponent>,
    private barCodeScannerService: BarCodeScannerService,
    @Inject(MAT_DIALOG_DATA) public data: Dapp,
    private prepaidCardManager: PrepaidCardManagerContract,
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private dialog: MatDialog,
  ) {
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public async scanQR() {
    if (window['cordova']) {
      try {
        const scannedValue = await this.barCodeScannerService.scan();
        if ((scannedValue) && (!scannedValue.cancelled)) {
          this.generatePrepaidCard(scannedValue.text);
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
          title: this.translate.instant('Prepaid card code'),
          description: this.translate.instant('Put the card code into the input field'),
          buttonAccept: this.translate.instant('Ok'),
          buttonCancel: this.translate.instant('Cancel')
        }
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result) {
          this.generatePrepaidCard(result);
        }

      });
    }
  }

  private generatePrepaidCard(inputValue: string) {
    if (inputValue.includes(QR_VALIDATOR.CARD, 0)) {
      this.prepaidCardManager.validateCard(inputValue).catch((error: any) => {
        this.snackBar.open(this.translate.instant('common.transaction_error'), null, {
          duration: 2000,
        });
        log.error('KO', error);
      });
      this.dialogRef.close();
    } else {
      log.error('KO', 'Bad QR prefix');
      this.snackBar.open(this.translate.instant('common.qr_invalid'), null, {
        duration: 2000,
      });
    }
  }
}
