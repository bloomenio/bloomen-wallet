// Basic
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';

import * as fromDappActions from '@stores/dapp/dapp.actions';
import * as fromUserActions from '@stores/recent-users/recent-users.actions';

import * as fromDappSelectors from '@stores/dapp/dapp.selectors';

import * as fromBalanceSelectors from '@stores/balance/balance.selectors';

import * as fromApplicationDataActions from '@stores/application-data/application-data.actions';

import { Store } from '@ngrx/store';
import { Dapp, DappCache } from '@core/models/dapp.model';
import { Subscription } from 'rxjs';

/**
 * Dapp-options-shell component
 */
@Component({
  selector: 'blo-dapp-options-shell',
  templateUrl: 'dapp-options-shell.component.html',
  styleUrls: ['dapp-options-shell.component.scss']
})
export class DappOptionsShellComponent implements OnInit, OnDestroy {

  public version: string;
  public address: string;
  public dapp: DappCache;
  public dapps$: Subscription;
  public balance$: Subscription;
  public outOfCash: boolean;

  constructor(
    private router: Router,
    private store: Store<Dapp>,
    private activatedRoute: ActivatedRoute
  ) { }

  public ngOnInit() {
    this.address = this.activatedRoute.firstChild.snapshot.paramMap.get('address');
    this.version = environment.version;

    this.dapps$ = this.store.select(fromDappSelectors.selectAllDapp).subscribe((dapps) => {
      this.dapp = dapps.find(dapp => dapp.address === this.address);
    });

    this.balance$ = this.store.select(fromBalanceSelectors.getBalance).subscribe((balance) => {
      this.outOfCash = !parseInt(balance, 10);
    });
  }

  public ngOnDestroy() {
    if (this.dapps$) {
      this.dapps$.unsubscribe();
    }
    if (this.balance$) {
      this.balance$.unsubscribe();
    }
  }

  public goToHome() {
    this.store.dispatch(new fromApplicationDataActions.ChangeInitialDapp({ currentDappAddress: undefined }));
    this.router.navigate(['home'], { replaceUrl: true });
  }

  public refreshDapp() {
    this.store.dispatch(new fromDappActions.RefreshDapp({ address: this.address }));
  }

  public goToBurnCash() {
    this.store.dispatch(new fromUserActions.CleanUser());
    this.router.navigate([`dapp/${this.dapp.address}/burn-cash`]);
  }

}
