import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationDataStateModel } from '@core/models/application-data-state.model';
import { Router, CanActivate } from '@angular/router';

import * as fromSelectors from '@stores/application-data/application-data.selectors';
import { I18nService } from '@services/i18n/i18n.service';

import * as fromActions from '@stores/application-data/application-data.actions';
import { ApplicationDataDatabaseService } from '@db/application-data-database.service';
import { APPLICATION_DATA_CONSTANTS } from '@core/constants/application-data.constants';


@Injectable({ providedIn: 'root' })
export class HomeGuardRouteService implements CanActivate {
    constructor(
        private store: Store<ApplicationDataStateModel>,
        private router: Router,
        private i18nService: I18nService,
        private applicationDataDatabase: ApplicationDataDatabaseService
    ) { }

    public canActivate() {
        return new Promise<boolean>((resolve, reject) => {
            this.store.select(fromSelectors.getIsFirstRun).subscribe(isFirstRun => {
                if (!isFirstRun) {
                    this.applicationDataDatabase.get(APPLICATION_DATA_CONSTANTS.CURRENT_DAPP).toPromise().then((currentDappAddress) => {
                        if (currentDappAddress) {
                            this.router.navigate([`/dapp/${currentDappAddress}`]);
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    }, () => {
                        resolve(true);
                    });
                } else {
                    if (!this.i18nService.getStoredLang()) {
                        this.router.navigate(['language-selector']);
                        resolve(false);
                    } else {
                        this.store.dispatch(new fromActions.ChangeFirstRun({ isFirstRun: false }));
                        resolve(true);
                    }
                }
            }, err => {
                reject(err);
            });
        });
    }
}
