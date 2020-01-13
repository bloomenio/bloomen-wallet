// Basic
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

import * as fromDappActions from '@stores/dapp/dapp.actions';
import { Store } from '@ngrx/store';
import { Dapp } from '@core/models/dapp.model';
import { MatDialog } from '@angular/material';
import { RpcDialogComponent } from '@components/rpc-dialog/rpc-dialog.component';

/**
 * Home-options-shell component
 */
@Component({
  selector: 'blo-home-options-shell',
  templateUrl: 'home-options-shell.component.html',
  styleUrls: ['home-options-shell.component.scss']
})
export class HomeOptionsShellComponent {

  public version: string;

  constructor(
    private router: Router,
    private store: Store<Dapp>,
    private dialog: MatDialog,
  ) {
    this.version = environment.version;
  }

  public goToTutorial() {
    this.router.navigate(['tutorial'], { replaceUrl: true });
  }

  public refreshDapps() {
    this.store.dispatch(new fromDappActions.RefreshDapps());
  }

  public changeLanguage() {
    this.router.navigate(['language-selector'], { replaceUrl: true });
  }


  public changeRpc () {
    const dialogRef = this.dialog.open(RpcDialogComponent, {
      width: '250px'
    });

    return dialogRef.afterClosed();
  }


}
