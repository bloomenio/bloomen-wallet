import { Component, OnInit, OnDestroy } from '@angular/core';
import { Logger } from '@services/logger/logger.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { Web3Service } from '@services/web3/web3.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import * as fromDappSelectors from '@stores/dapp/dapp.selectors';


import { Store } from '@ngrx/store';
import * as fromMnemonicActions from '@stores/mnemonic/mnemonic.actions';
import { Dapp } from '@core/models/dapp.model';


const log = new Logger('restore-account.component');


@Component({
  selector: 'blo-restore-account',
  templateUrl: './restore-account.component.html',
  styleUrls: ['./restore-account.component.scss']
})
export class RestoreAccountComponent implements OnInit, OnDestroy {

  public restoreAccountForm: FormGroup;

  public address: string;

  private dapps$: Subscription;

  public dapp: Dapp;

  public isCordova: boolean;

  constructor(
    private store: Store<any>,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    public snackBar: MatSnackBar,
    private location: Location,
    private web3Service: Web3Service,
    private router: Router
  ) { }

  public ngOnInit() {
    this.address = this.activatedRoute.snapshot.paramMap.get('address');
    this.dapps$ = this.store.select(fromDappSelectors.selectAllDapp).subscribe((dapps) => {
      this.dapp = dapps.find(dapp => dapp.address === this.address);
    });

    this.isCordova = !!window['cordova'];

    this.restoreAccountForm = new FormGroup({
      mnemonic: new FormControl('', Validators.required),
    });
  }

  public ngOnDestroy() {
    this.dapps$.unsubscribe();
  }

  public doBack() {
    this.location.back();
  }

  public onSubmit() {
    const randomSeed = this.restoreAccountForm.get('mnemonic').value;
    if (this.web3Service.validateMnemonic(randomSeed)) {
      this.store.dispatch(new fromMnemonicActions.AddMnemonic({ address: this.address, randomSeed }));
      this.router.navigate([`/dapp/${this.address}`]);
    } else {
      this.snackBar.open(this.translate.instant('common.invalid_mnemonic'), null, {
        duration: 2000,
      });
    }
  }

  public paste() {
    if (window['cordova']) {
      const clipboard = window['cordova']['plugins']['clipboard'];
      clipboard.paste((value) => {
        this.restoreAccountForm.get('mnemonic').setValue(value);
      });
    }
  }

  public hideKeyboard(event: Event) {
    if (window['cordova']) {
      event.stopPropagation();
    }
  }

}
