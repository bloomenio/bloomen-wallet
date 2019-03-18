// Basic
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';

import * as fromDappActions from '@stores/dapp/dapp.actions';
import * as fromDappSelectors from '@stores/dapp/dapp.selectors';
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

  constructor(
    private router: Router,
    private store: Store<Dapp>,
    private activatedRoute: ActivatedRoute
  ) {

  }

  public ngOnInit() {
    this.address = this.activatedRoute.firstChild.snapshot.paramMap.get('address');
    this.version = environment.version;
    this.dapps$ = this.store.select(fromDappSelectors.selectAllDapp).subscribe((dapps) => {
      this.dapp = dapps.find(dapp => dapp.address === this.address);
    });
  }

  public ngOnDestroy() {
    if (this.dapps$) {
      this.dapps$.unsubscribe();
    }
  }

  public goToHome() {
    this.router.navigate(['home'], { replaceUrl: true });
  }

  public refreshDapp() {
    this.store.dispatch(new fromDappActions.RefreshDapp({ address: this.address }));
  }

}
