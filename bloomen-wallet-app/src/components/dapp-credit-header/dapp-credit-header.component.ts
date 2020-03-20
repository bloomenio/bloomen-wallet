// Basic
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DappScanQRComponent } from '@components/dapp-scanQR/dapp-scanQR.component';

import { Dapp } from '@core/models/dapp.model';

import { Store } from '@ngrx/store';
import * as fromSelectors from '@stores/balance/balance.selectors';
import { BalanceModel } from '@core/models/balance.model';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';


/**
 * Dapp-credit-header component
 */
@Component({
  selector: 'blo-dapp-credit-header',
  templateUrl: 'dapp-credit-header.component.html',
  styleUrls: ['dapp-credit-header.component.scss']
})
export class DappCreditHeaderComponent implements OnInit, OnDestroy {
  @Input() public dapp: Dapp;
  @Input() public hideAddCash: boolean;

  public balance: string;

  public balance$: Subscription;

  public isLoading: boolean;

  /**
   * Constructor to declare all the necesary to initialize the component.
   */
  constructor(
    public dialog: MatDialog,
    private store: Store<BalanceModel>
  ) {
    this.balance = '0';
    this.isLoading = true;
    console.log(`******* constructor cabecera hide add cash value: ${this.hideAddCash}`);
  }

  public ngOnInit() {
    this.balance$ = this.store.select(fromSelectors.getBalance).pipe().subscribe((balance) => {
      this.balance = balance;
      if (balance !== '-1') {
        this.isLoading = false;
      } else {
        this.isLoading = true;
      }
    });
    console.log(`******* oninit cabecera add cash hide value: ${this.hideAddCash}`);
    console.log(`******* dapp de la cabecera: ${JSON.stringify(this.dapp)}`);
  }

  public ngOnDestroy() {
    this.balance$.unsubscribe();
  }

  public addCreditScan() {
    this.dialog.open(DappScanQRComponent, {
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
