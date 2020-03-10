// Basic
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RpcDialogComponent } from '@components/rpc-dialog/rpc-dialog.component';
import {DappsMnmonicsComponent} from '@components/dapps-mnmonics/dapps-mnmonics';
import * as fromMnemonicActions from '@stores/mnemonic/mnemonic.actions';
import * as fromDappSelectors from '@stores/dapp/dapp.selectors';
import * as fromMnemonic from '@stores/mnemonic/mnemonic.selectors';

import { Store } from '@ngrx/store';
import { MnemonicModel } from '@core/models/mnemonic.model';
import { RpcSubprovider } from '@services/web3/rpc-subprovider';
import { SocialSharingService } from '@services/social-sharing/social-sharing.service';
import { ClipboardService } from 'ngx-clipboard';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dapp } from '@core/models/dapp.model';

@Component({
  selector: 'blo-network-status-alert',
  templateUrl: 'network-status-alert.component.html',
  styleUrls: ['network-status-alert.component.scss']
})
export class NetworkStatusAlertComponent implements OnInit, OnDestroy {

  public address: string;
  private dapps$: Subscription;
  private mnemonics$: Subscription;
  private dappsWithMnemonics: Array<any>;

  public dapp: Dapp;

  private _dialogRef: MatDialogRef<RpcDialogComponent>;
  private _dialogMnemonic: MatDialogRef<DappsMnmonicsComponent>;

  constructor( private dialog: MatDialog,
    private store: Store<MnemonicModel>,
    private rpcSubprovider: RpcSubprovider,
    private socialSharing: SocialSharingService,
    private clipboardService: ClipboardService,
    private translate: TranslateService,
    public snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute) {}


  public ngOnInit() {
    this.address = this.activatedRoute.snapshot.paramMap.get('address');

    this.dapps$ = this.store.select(fromDappSelectors.selectAllDapp).subscribe((dapps) => {
      this.dapp = dapps.find(dapp => dapp.address === this.address);
      this.mnemonics$ = this.store.select(fromMnemonic.selectAllMnemonics).subscribe((mnemonics: any) => {
        this.dappsWithMnemonics = dapps.map(dapp =>
            ({...mnemonics.find(mnemonic => mnemonic.address === dapp.address), ...dapp}))
            .filter(value => value.randomSeed);
      });
    });
  }

  public ngOnDestroy() {
    this.dapps$.unsubscribe();
    this.mnemonics$.unsubscribe();
  }

  public changeRpcDialog() {
    if (! this._dialogRef ) {
      this._dialogRef = this.dialog.open(RpcDialogComponent, {
        width: '250px'
      });
      this._dialogRef.afterClosed().subscribe(result => {
        this._dialogRef = undefined;
      });
    }

  }

  public resumeWallet() {
    this.rpcSubprovider.setErrorState(false);
    this.store.dispatch(new fromMnemonicActions.RefreshWallet());
  }

  public exportMnemonicDialog() {
    if ( !this._dialogMnemonic && this.dappsWithMnemonics.length > 0) {
        this._dialogMnemonic = this.dialog.open(DappsMnmonicsComponent, {
          width: '300px',
          restoreFocus: false,
          data: {dappsWithMnemonics: this.dappsWithMnemonics }
        });

        this._dialogMnemonic.afterClosed().subscribe(value => {
          this._dialogMnemonic = undefined;
          if (value) {
            this.share(value.randomSeed);
          }
        });
    } else {
      this.snackBar.open(this.translate.instant('dapp.restore_account.no_mnemonics'), null, {
        duration: 2000,
      });
    }
  }

  private share( mnemonic: string) {
    if (window['cordova']) {
      this.socialSharing.share(mnemonic);
    } else {
      this.clipboardService.copyFromContent(mnemonic);
    }
  }

}
