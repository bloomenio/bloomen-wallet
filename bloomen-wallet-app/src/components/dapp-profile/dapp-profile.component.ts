// Basic
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Logger } from '@services/logger/logger.service.js';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import {Observable, Subscription} from 'rxjs';
import { Web3Service } from '@services/web3/web3.service';

import { QR_VALIDATOR } from '@constants/qr-validator.constants';
import { Router } from '@angular/router';
import { SocialSharingService } from '@services/social-sharing/social-sharing.service';

import {select, Store} from '@ngrx/store';
import * as fromSelectors from '@stores/balance/balance.selectors';
import { BalanceModel } from '@core/models/balance.model';

import { MnemonicModel } from '@core/models/mnemonic.model';
import { Dapp } from '@core/models/dapp.model';
import {UserAlias} from '@models/recent-user.model';

import * as fromAddressSelector from '@stores/recent-users/recent-users.selectors';
import * as fromUserActions from '@stores/recent-users/recent-users.actions';
import {filter, find, map} from 'rxjs/operators';

import { MatDialog } from '@angular/material';
import { ChangeRecentUserComponent } from './change-recent-user/change-recent-user.component';

import { ClipboardService } from 'ngx-clipboard';
import {DappGeneralDialogComponent} from '@components/dapp-general-dialog/dapp-general-dialog.component';
import * as fromDevicesActions from '@stores/devices/devices.actions';


const log = new Logger('dapp-profile.component');

/**
 * Dapp-profile component
 */
@Component({
  selector: 'blo-dapp-profile',
  templateUrl: 'dapp-profile.component.html',
  styleUrls: ['dapp-profile.component.scss']
})
export class DappProfileComponent implements OnInit, OnDestroy {
  public userAddress: string;
  public prefixDapp: string;
  public outOfCash = true;
  public balance$: Subscription;
  public idDapp: string;

  public address$: Subscription;

  @Input() public dapp: Dapp;

  @Input() public mnemonic: MnemonicModel;
  private addressList$: Observable<UserAlias[]>;

  /**
   * Constructor to declare all the necesary to initialize the component.
   */
  constructor(
    public snackBar: MatSnackBar,
    private translate: TranslateService,
    private web3Service: Web3Service,
    private router: Router,
    private socialSharing: SocialSharingService,
    private store: Store<BalanceModel | UserAlias>,
    public dialog: MatDialog,
    private clipboardService: ClipboardService
  ) {
    this.prefixDapp = QR_VALIDATOR.ID;
  }

  public ngOnInit() {

    this.store.dispatch(new fromUserActions.InitRecentUsers());

    this.address$ = this.web3Service.getAddress().subscribe((address: string) => {
      this.userAddress = address;
    });
    this.balance$ = this.store.select(fromSelectors.getBalance).subscribe((balance) => {
      this.outOfCash = !parseInt(balance, 10);
    });

    this.addressList$ = this.store.select(fromAddressSelector.selectAllAddress).pipe(
        map(users =>
            users.filter(user => user.idDapp === this.dapp.address)
        )
    );
  }

  public ngOnDestroy() {
    this.address$.unsubscribe();
    this.balance$.unsubscribe();
  }

  public stringCodeCopy() {
    this.snackBar.open(this.translate.instant('dapp.profile.code_copied'), null, {
      duration: 2000,
    });
  }

  public goToSendCash() {
    this.store.dispatch(new fromUserActions.CleanUser());
    this.router.navigate([`dapp/${this.dapp.address}/send-cash`]);
  }

  public share() {
    if (window['cordova']) {
      this.socialSharing.share(this.mnemonic.randomSeed);
    } else {
      this.clipboardService.copyFromContent(this.mnemonic.randomSeed);
    }
  }

  public sendCashToUser(address: UserAlias) {
    this.store.dispatch(new fromUserActions.SetCurrentAlias(address));
    this.router.navigate([`dapp/${this.dapp.address}/send-cash`]);
  }

  public onDelete(address: string): void {
    const dialogRef = this.dialog.open(DappGeneralDialogComponent, {
      width: '250px',
      height: '200px',
      data: {
        title: this.translate.instant('address_popup.delete_alias.title'),
        description: this.translate.instant('address_popup.delete_alias.message'),
        buttonAccept: this.translate.instant('common.remove'),
        buttonCancel: this.translate.instant('common.cancel')
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new fromUserActions.DeleteAlias({id : address}));
      }
    });
  }

  public openDialog(user: UserAlias): Observable<any> {
    const dialogRef = this.dialog.open(ChangeRecentUserComponent, {
      width: '250px',
      data: {user: user}
    });

    return dialogRef.afterClosed();
  }

}
