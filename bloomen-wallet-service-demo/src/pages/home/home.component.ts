// Basic
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromAppSelectors from '@stores/application-data/application-data.selectors';

import * as fromAppActions from '@stores/application-data/application-data.actions';

import { THEMES } from '@core/constants/themes.constants.js';

import { Subscription } from 'rxjs';
import { skipWhile, first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Logger } from '@services/logger/logger.service';
import { Router } from '@angular/router';

const log = new Logger('home.component');


/**
 * Home page
 */
@Component({
  selector: 'blo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private theme$: Subscription;

  constructor(
    private store: Store<any>,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  public ngOnInit() {
    this.theme$ = this.store.select(fromAppSelectors.getTheme).pipe(
      skipWhile((theme) => theme === undefined),
      first()
    ).subscribe((theme) => {
      if (theme && theme !== THEMES['DEMO-DAPP']) {
        this.store.dispatch(new fromAppActions.ChangeTheme({ theme: THEMES['DEMO-DAPP'] }));
      }
    });
  }

  public ngOnDestroy() {
    this.theme$.unsubscribe();
  }


}
