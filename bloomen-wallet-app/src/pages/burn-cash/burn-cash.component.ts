import { Component, OnInit, OnDestroy } from '@angular/core';
import { Logger } from '@services/logger/logger.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ERC223Contract } from '@core/core.module';
import { MatDialog } from '@angular/material/dialog';
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

import * as fromBurnsSelectors from '@stores/burns/burns.selectors';
import * as fromBurnsActions from '@stores/burns/burns.actions';
import { BurnModel } from '@core/models/burn.model';


const log = new Logger('burn-cash.component');


@Component({
  selector: 'blo-burn-cash',
  templateUrl: './burn-cash.component.html',
  styleUrls: ['./burn-cash.component.scss']
})
export class BurnCashComponent implements OnInit, OnDestroy {

  public dapp: Dapp;
  public burnCashForm: FormGroup;
  public address: string;

  private mnemonics$: Subscription;

  public dapps$: Subscription;
  private currentUser$: Subscription;

  private burns$: Subscription;
  public burnsArray: BurnModel[];
  private burnsPageCount$: Subscription;
  private burnsPageCount: number;
  public currentPageBurns: number;


  constructor(
    private store: Store<any>,
    private erc223: ERC223Contract,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    public snackBar: MatSnackBar,
    private web3Service: Web3Service,
    public dialfromBurnsSelectorsfromBurnsSelectorsog: MatDialog
  ) { }

  public ngOnInit() {
    const address = this.activatedRoute.snapshot.paramMap.get('address');

    this.dapps$ = this.store.select(fromDappSelectors.selectAllDapp).subscribe((dapps) => {
      this.dapp = dapps.find(dapp => dapp.address === address);
    });

    this.mnemonics$ = this.store.select(fromMnemonicSelectors.selectAllMnemonics).subscribe((mnemonics) => {
      const mnemonic = mnemonics.find(mnemonicItem => mnemonicItem.address === address);
      if (mnemonic) {
        this.store.dispatch(new fromMnemonicActions.ChangeWallet({ randomSeed: mnemonic.randomSeed, dappId: this.dapp.dappId }));
      }
    });

    this.burnCashForm = new FormGroup({
      amount: new FormControl('', Validators.required),
    });

    this.currentUser$ = this.store.pipe(
        select(fromRecentUser.selectCurrentUser)
    ).subscribe(
      recentUser => {
        if (recentUser) { this.burnCashForm.setValue({ address: recentUser.address, amount: null }); }
      }
    );

    this.burnsPageCount$ = this.store.select(fromBurnsSelectors.getPageCount).subscribe(pageCount => {
      this.burnsPageCount = pageCount;
    });
    this.burns$ = this.store.select(fromBurnsSelectors.selectAllBurns).subscribe((burnsArray) => {
      this.burnsArray = burnsArray;
      this.currentPageBurns = this.burnsPageCount + fromBurnsActions.FIRST_PAGE_INDEX
        - Math.ceil(burnsArray.length / fromBurnsActions.PAGE_SIZE);
    });

  }

  public ngOnDestroy() {
    this.mnemonics$.unsubscribe();
    this.currentUser$.unsubscribe();
    this.burns$.unsubscribe();
    this.burnsPageCount$.unsubscribe();
  }

  public burnTransaction() {
    const values = this.burnCashForm.value;
    this.web3Service.ready(() => {
      this.erc223.burn(values.amount).then((result: any) => {
        this.snackBar.open(this.translate.instant('common.transaction_success'), null, {
          duration: 2000,
        });
        this.store.dispatch(new fromBurnsActions.InitBurns());
      }, (error: any) => {
        console.error('KO', error);
        this.snackBar.open(this.translate.instant('common.transaction_error'), null, {
          duration: 2000,
        });
      });
    });
  }

  public onSubmit() {
    this.burnTransaction();
  }

  public moreBurns() {
    this.store.dispatch(new fromBurnsActions.UpdateBurns({
      page: Math.max(fromBurnsActions.FIRST_PAGE_INDEX, --this.currentPageBurns)}));
  }

  public hideKeyboard(event: Event) {
    if (window['cordova']) {
      event.stopPropagation();
    }
  }


}

