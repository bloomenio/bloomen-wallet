import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationDataStateModel } from '@core/models/application-data-state.model';
import { Router, CanActivate } from '@angular/router';

import * as fromSelectors from '@stores/application-data/application-data.selectors';

import * as fromActions from '@stores/application-data/application-data.actions';
import { ApplicationDataDatabaseService } from '@db/application-data-database.service';
import { APPLICATION_DATA_CONSTANTS } from '@core/constants/application-data.constants';
import { TranslateService } from '@ngx-translate/core';


@Injectable({ providedIn: 'root' })
export class HomeGuardRouteService implements CanActivate {

    private isFirstRun;
    private language;

    constructor(
        private store: Store<ApplicationDataStateModel>,
        private router: Router,
        private applicationDataDatabase: ApplicationDataDatabaseService,
    ) {
        this.store.select(fromSelectors.getIsFirstRun).subscribe((isFirstRun) => {
            this.isFirstRun = isFirstRun;
        });

        this.store.select(fromSelectors.getLanguage).subscribe((language) => {
            this.language = language;
        });
    }

    public async canActivate() {
        if (!this.isFirstRun) {
            const currentDappAddress = await this.applicationDataDatabase.get(APPLICATION_DATA_CONSTANTS.CURRENT_DAPP).toPromise();
            if (currentDappAddress) {
                this.router.navigate([`/dapp/${currentDappAddress}`]);
                return false;
            } else {
                return true;
            }
        } else {
            if (!this.language) {
                this.router.navigate(['language-selector']);
                return false;
            } else {
                this.store.dispatch(new fromActions.ChangeFirstRun({ isFirstRun: false }));
                return true;
            }
        }
    }
}

