// Basic
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dapp } from '@core/models/dapp.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromAppActions from '@stores/application-data/application-data.actions';
import * as fromMnemonicActions from '@stores/mnemonic/mnemonic.actions';
import { ApplicationDataStateModel } from '@core/models/application-data-state.model';
import { THEMES } from '@core/constants/themes.constants';

@Component({
  selector: 'blo-dapp-login',
  templateUrl: 'dapp-login.component.html',
  styleUrls: ['dapp-login.component.scss']
})
export class DappLoginComponent {

  constructor(
    private router: Router,
    private store: Store<ApplicationDataStateModel>,
    public dialogRef: MatDialogRef<DappLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Dapp
  ) {
    setTimeout(() => {
      this.store.dispatch(new fromAppActions.ChangeTheme({ theme: this.data.laf.theme }));
    });
  }

  public closeDialog() {
    this.dialogRef.close();
    setTimeout(() => {
      this.store.dispatch(new fromAppActions.ChangeTheme({ theme: THEMES.BLOOMEN }));
    });
  }

  public createMnemonic() {
    this.store.dispatch(new fromMnemonicActions.AddMnemonic({ address: this.data.address }));
    this.dialogRef.close();
    this.router.navigate([`/dapp/${this.data.address}`]);
  }

  public restoreMnemonic() {
    this.router.navigate([`/restore-account/${this.data.address}`]);
    this.dialogRef.close();
  }
}
