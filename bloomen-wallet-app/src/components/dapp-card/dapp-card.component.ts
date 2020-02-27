// Basic
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DappLoginComponent } from '@components/dapp-login/dapp-login.component';
import { DappGeneralDialogComponent } from '@components/dapp-general-dialog/dapp-general-dialog.component';
import { DappCache } from '@core/models/dapp.model';

import { Store } from '@ngrx/store';

import * as fromMnemonicSelect from '@stores/mnemonic/mnemonic.selectors';
import * as fromAppActions from '@stores/application-data/application-data.actions';
import * as fromDappActions from '@stores/dapp/dapp.actions';
import * as fromMnemonicActions from '@stores/mnemonic/mnemonic.actions';
import { Router } from '@angular/router';
import { MnemonicModel } from '@core/models/mnemonic.model';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

/**
 * Dapp-card component
 */
@Component({
  selector: 'blo-dapp-card',
  templateUrl: 'dapp-card.component.html',
  styleUrls: ['dapp-card.component.scss']
})
export class DappCardComponent implements OnInit, OnDestroy {
  @Input() public dapp: DappCache;

  public mnemonic: MnemonicModel;

  public mnemonic$: Subscription;

  /**
   * Constructor to declare all the necesary to initialize the component.
   */
  constructor(
    public dialog: MatDialog,
    public store: Store<MnemonicModel>,
    public router: Router,
    public translate: TranslateService,
  ) { }

  public ngOnInit() {
    this.mnemonic$ = this.store.select(fromMnemonicSelect.selectAllMnemonics).subscribe((mnemonics) => {
      this.mnemonic = mnemonics.find(mnemonic => mnemonic.address === this.dapp.address);
    });
  }

  public ngOnDestroy() {
    this.mnemonic$.unsubscribe();
  }

  public openLoginDialog() {
    if (this.mnemonic) {
      this.router.navigate([`/dapp/${this.dapp.address}`]);
      setTimeout(() => {
        this.store.dispatch(new fromAppActions.ChangeTheme({ theme: this.dapp.laf.theme }));
      });
    } else {
      this.dialog.open(DappLoginComponent, {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        panelClass: 'fullscreen-dialog',
        disableClose: true,
        autoFocus: false,
        hasBackdrop: false,
        data: this.dapp
      });
    }
  }

  public cleanData() {
    const dialogRef = this.dialog.open(DappGeneralDialogComponent, {
      width: '250px',
      height: '200px',
      data: {
        title: this.translate.instant('dapp.clean_data.title'),
        description: this.translate.instant('dapp.clean_data.description'),
        buttonAccept: this.translate.instant('common.remove'),
        buttonCancel: this.translate.instant('common.cancel')
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new fromMnemonicActions.RemoveMnemonic({ address: this.dapp.address }));
      }
    });
  }

  public removeDapp() {
    const dialogRef = this.dialog.open(DappGeneralDialogComponent, {
      width: '250px',
      height: '200px',
      data: {
        title: this.translate.instant('dapp.remove_dapp.title'),
        description: this.translate.instant('dapp.remove_dapp.description'),
        buttonAccept: this.translate.instant('common.remove'),
        buttonCancel: this.translate.instant('common.cancel')
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new fromDappActions.RemoveDapp({ address: this.dapp.address }));
      }
    });
  }
}
