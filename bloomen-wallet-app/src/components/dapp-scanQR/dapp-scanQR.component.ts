// Basic
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BarCodeScannerService } from '@services/barcode-scanner/barcode-scanner.service';
import { Logger } from '@services/logger/logger.service';
import { Dapp } from '@core/models/dapp.model';
import { PrepaidCardManagerContract } from '@core/core.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QR_VALIDATOR } from '@core/constants/qr-validator.constants';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService
    ) {
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public async scanQR() {
    this.dialogRef.close();
    this.barCodeScannerService.scan().then(result => {
      this.generatePrepaidCard(result);
    });
  }

  private generatePrepaidCard(inputValue: string) {
    if (inputValue.includes(QR_VALIDATOR.CARD, 0)) {
      this.prepaidCardManager.validateCard(inputValue).then((result: any) => {
        this.snackBar.open(this.translate.instant('common.transaction_success'), null, {
          duration: 2000,
        });
      }, (error: any) => {
        log.error('KO', error);
        this.snackBar.open(this.translate.instant('common.transaction_error'), null, {
          duration: 2000,
        });
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
