// Basic
import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Dapp } from '@core/models/dapp.model.js';


import { Store } from '@ngrx/store';
import * as fromDappSelectors from '@stores/dapp/dapp.selectors';
import * as fromMnemonicSelectors from '@stores/mnemonic/mnemonic.selectors';
import * as fromMnemonicActions from '@stores/mnemonic/mnemonic.actions';

import * as fromDappActions from '@stores/dapp/dapp.actions';
import * as fromDevicesActions from '@stores/devices/devices.actions';
import * as fromPurchasesActions from '@stores/purchases/purchases.actions';

import * as fromApplicationDataActions from '@stores/application-data/application-data.actions';
import * as fromApplicationDataSelectors from '@stores/application-data/application-data.selectors';

import { Subscription, interval } from 'rxjs';
import { Logger } from '@services/logger/logger.service';
import { MnemonicModel } from '@core/models/mnemonic.model';
import { WEB3_CONSTANTS } from '@core/constants/web3.constants';
import { filter, take } from 'rxjs/operators';



const log = new Logger('dapp-sections.component');

/**
 * Dapp-sections page
 */
@Component({
  selector: 'blo-dapp-sections',
  templateUrl: './dapp-sections.component.html',
  styleUrls: ['./dapp-sections.component.scss']
})
export class DappSectionsComponent implements OnInit, OnDestroy {

  public dapp: Dapp;

  public mnemonic: MnemonicModel;

  private mnemonics$: Subscription;

  public dapps$: Subscription;
  public interval$: Subscription;
  public currentDapp$: Subscription;
 
  public currentTabIndex: string;

  constructor(
    private store: Store<any>,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  public ngOnInit() {
    const address = this.activatedRoute.snapshot.paramMap.get('address');

    this.currentTabIndex = this.activatedRoute.snapshot.queryParamMap.get('tabIndex') || '0';
    this.onTabClick({ index: parseInt(this.currentTabIndex, 10) }, false);

    setTimeout( () => {
      this.store.dispatch(new fromApplicationDataActions.ChangeInitialDapp({ currentDappAddress: address }));
    });

    this.currentDapp$ = this.store.select(fromApplicationDataSelectors.getCurrentDappAddress)
    .pipe(
      filter( newAddress => newAddress === address),
      take(1)
    ).subscribe( () => {
      log.debug('dapp starting...');
      this.dapps$ = this.store.select(fromDappSelectors.selectAllDapp).subscribe((dapps) => {
        this.dapp = dapps.find(dapp => dapp.address === address);
        if (this.dapp && !this.interval$) {
          this.interval$ = interval(WEB3_CONSTANTS.REFRESH_DAPP_INTERVAL).subscribe(() => {
            log.debug('refreshing...');
            this.store.dispatch(new fromDappActions.RefreshDappSilent({ address }));
          });
        }
      });

      this.mnemonics$ = this.store.select(fromMnemonicSelectors.selectAllMnemonics).subscribe((mnemonics) => {
        this.mnemonic = mnemonics.find(mnemonicItem => mnemonicItem.address === address);
        if (this.mnemonic) {
          const dappId = this.dapp ? this.dapp.dappId : undefined;
          this.store.dispatch(new fromMnemonicActions.ChangeWallet({ randomSeed: this.mnemonic.randomSeed, dappId: dappId }));
        }
      });
      }
    );
  }

  public ngOnDestroy() {
    this.mnemonics$.unsubscribe();
    this.dapps$.unsubscribe();
    this.interval$.unsubscribe();
    this.currentDapp$.unsubscribe();
  }

  public onTabClick(event: any, refreshData = true) {
    this.router.navigate([], {
      queryParams: {
        tabIndex: event.index
      },
      queryParamsHandling: 'merge'
    });
    if (refreshData) {
      this.updateShoppingListData(event.index);
    }
  }

  private updateShoppingListData(index) {
    if (index === 3) {
      // Refresh data required to ensure that Purchase/Allow action did actually update the blockchain
      // Because of reverse ordering refresh all data to load first/last page ignoring other previous loaded pages
      this.store.dispatch(new fromDevicesActions.InitDevices({ dappId: this.dapp.dappId }));
      this.store.dispatch(new fromPurchasesActions.InitPurchases({ dappId: this.dapp.dappId }));
    }
  }
}
