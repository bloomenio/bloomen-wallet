import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationDataStateModel } from '@core/models/application-data-state.model';
import { Router, CanActivate } from '@angular/router';

import * as fromSelectors from '@stores/application-data/application-data.selectors';
import { I18nService } from '@services/i18n/i18n.service';

import * as fromActions from '@stores/application-data/application-data.actions';


@Injectable({ providedIn: 'root' })
export class HomeGuardRouteService implements CanActivate {
    constructor(
        private store: Store<ApplicationDataStateModel>,
        private router: Router,
        private i18nService: I18nService
    ) { }

    public canActivate() {
        return new Promise<boolean>((resolve, reject) => {
            this.store.select(fromSelectors.getIsFirstRun).subscribe(isFirstRun => {
                resolve(true);
            }, err => {
                reject(err);
            });
        });
    }
}
