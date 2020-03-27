import { Component, OnInit, OnDestroy } from '@angular/core';
import { Logger } from '@services/logger/logger.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ERC223Contract } from '@core/core.module';
import {  MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { Web3Service } from '@services/web3/web3.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Dapp } from '@core/models/dapp.model.js';


import { Store, select } from '@ngrx/store';
import * as fromDappSelectors from '@stores/dapp/dapp.selectors';
import * as fromMnemonicSelectors from '@stores/mnemonic/mnemonic.selectors';
import * as fromMnemonicActions from '@stores/mnemonic/mnemonic.actions';
import * as fromRecentUser from '@stores/recent-users/recent-users.selectors';
import { BarCodeScannerService } from '@services/barcode-scanner/barcode-scanner.service';
import { QR_VALIDATOR } from '@core/constants/qr-validator.constants';

import { RecentUsersComponent } from '@components/recent-users/recent-users.component';
import { UserAlias } from '@models/recent-user.model';


const log = new Logger('send-cash.component');


@Component({
  selector: 'blo-send-cash',
  templateUrl: './send-cash.component.html',
  styleUrls: ['./send-cash.component.scss']
})
export class SendCashComponent implements OnInit, OnDestroy {

  public dapp: Dapp;
  public sendCashForm: FormGroup;
  public address: string;
  public destinationAddress: string;
  public pattern: string;

  private mnemonics$: Subscription;

  public dapps$: Subscription;
  private currentUser$: Subscription;
  private listOfAddress: UserAlias[];


  constructor(
    private store: Store<any>,
    private erc223: ERC223Contract,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    public snackBar: MatSnackBar,
    private location: Location,
    private web3Service: Web3Service,
    private barCodeScannerService: BarCodeScannerService,
    public dialog: MatDialog
  ) {
  }

  public ngOnInit() {
    const address = this.activatedRoute.snapshot.paramMap.get('address');
    this.destinationAddress = this.activatedRoute.snapshot.queryParamMap.get('address');

    this.dapps$ = this.store.select(fromDappSelectors.selectAllDapp).subscribe((dapps) => {
      this.dapp = dapps.find(dapp => dapp.address === address);
      if (this.dapp.features.decimals > 0) {
        this.pattern='[0-9]*\\.?[0-9]*';
      } else {
        this.pattern='[0-9]*';
      }
    });

    this.mnemonics$ = this.store.select(fromMnemonicSelectors.selectAllMnemonics).subscribe((mnemonics) => {
      const mnemonic = mnemonics.find(mnemonicItem => mnemonicItem.address === address);
      if (mnemonic) {
        this.store.dispatch(new fromMnemonicActions.ChangeWallet({ randomSeed: mnemonic.randomSeed, dappId: this.dapp.dappId }));
      }
    });

    this.sendCashForm = new FormGroup({
      address: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
    });

    if (this.destinationAddress) {
      this.sendCashForm.get('address').setValue(this.destinationAddress);
    }

    this.currentUser$ = this.store.pipe(
      select(fromRecentUser.selectCurrentUser)
    ).subscribe(
      recentUser => {
        if (recentUser) { this.sendCashForm.setValue({ address: recentUser.address, amount: null }); }
      }
    );

    this.store.pipe(
      select(fromRecentUser.selectAllAddress)
    ).subscribe(value => this.listOfAddress = value);
  }

  public ngOnDestroy() {
    this.mnemonics$.unsubscribe();
    this.currentUser$.unsubscribe();
  }

  public async openQR(event: Event) {
    this.barCodeScannerService.scan().then(result => {
      this.recoverAddress(result);
    });
  }


  public sendTransaction() {
    const values = this.sendCashForm.value;
    this.web3Service.ready(() => {
      let amount: number = values.amount;

      if (this.dapp.features.decimals) {
        amount = amount * (10 ** this.dapp.features.decimals);
      }

      this.erc223.transfer(values.address, Math.trunc(amount)).then((result: any) => {
        this.snackBar.open(this.translate.instant('common.transaction_success'), null, {
          duration: 2000,
        });
        this.location.back();
      }, (error: any) => {
        console.error('KO', error);
        this.snackBar.open(this.translate.instant('common.transaction_error'), null, {
          duration: 2000,
        });
      });
    });
  }

  public onSubmit() {
    const exist = this.listOfAddress.find(value => value.address === this.sendCashForm.get('address').value);
    if (exist) { this.sendTransaction(); } else {
      this.openDialog().subscribe(
        (result: boolean) => {
          if (result) {
            this.sendTransaction();
          }
        }
      );
    }
  }

  private recoverAddress(inputValue: string) {
    if (inputValue.includes(QR_VALIDATOR.ID, 0)) {
      this.sendCashForm.get('address').setValue(inputValue.replace(QR_VALIDATOR.ID, ''));
    } else {
      log.error('KO', 'Bad QR prefix');
      this.snackBar.open(this.translate.instant('common.qr_invalid'), null, {
        duration: 2000,
      });
    }
  }

  public hideKeyboard(event: Event) {
    if (window['cordova']) {
      event.stopPropagation();
    }
  }

  public openDialog(): Observable<any> {
    const dialogRef = this.dialog.open(RecentUsersComponent, {
      width: '250px',
      data: {
        address: this.sendCashForm.get('address').value,
        idDapp: this.dapp.address
      }
    });
    return dialogRef.afterClosed();
  }
}

