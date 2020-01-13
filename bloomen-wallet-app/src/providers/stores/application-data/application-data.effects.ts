import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of, merge } from 'rxjs';

// Store
import { Store, select } from '@ngrx/store';
import * as fromSelectors from '@stores/application-data/application-data.selectors';

// Constants
import { withLatestFrom, tap, map, switchMap, catchError } from 'rxjs/operators';

// Actions
import * as fromActions from './application-data.actions';
import * as fromMnemonicsActions from '@stores/mnemonic/mnemonic.actions';

import { Logger } from '@services/logger/logger.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ApplicationDataStateModel } from '@core/models/application-data-state.model';
import { ApplicationDataDatabaseService } from '@db/application-data-database.service';
import { APPLICATION_DATA_CONSTANTS } from '@core/constants/application-data.constants';
import { THEMES } from '@core/constants/themes.constants';

import { StatusBar } from '@ionic-native/status-bar';

import { PreloadImages } from '@services/preload-images/preload-images.service';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';

const log = new Logger('application-data.effects');

@Injectable()
export class ApplicationDataEffects {

    constructor(
        private actions$: Actions<fromActions.ApplicationDataActions>,
        private overlayContainer: OverlayContainer,
        private store: Store<ApplicationDataStateModel>,
        private applicationDataDatabase: ApplicationDataDatabaseService,
        private statusBar: StatusBar,
        private preloadImages: PreloadImages,
        private translateService: TranslateService,
    ) { }

    @Effect({ dispatch: false }) public preloadImage = this.actions$.pipe(
        ofType(fromActions.ApplicationDataActionTypes.PRELOAD_IMAGE)
    ).pipe(
        map((img) => {
            this.preloadImages.preload(img.imagePath);
        })
    );

    @Effect({ dispatch: false }) public persistFirstRun = this.actions$.pipe(
        ofType(fromActions.ApplicationDataActionTypes.CHANGE_FIRST_RUN),
        withLatestFrom(this.store.pipe(select(fromSelectors.getIsFirstRun))),
        tap(([action, isFirstRun]) => {
            this.applicationDataDatabase.set(APPLICATION_DATA_CONSTANTS.FIRST_RUN, isFirstRun);
        })
    );

    @Effect({ dispatch: false }) public persistTheme = this.actions$.pipe(
        ofType(fromActions.ApplicationDataActionTypes.CHANGE_THEME),
        withLatestFrom(this.store.pipe(select(fromSelectors.getTheme))),
        tap(([action, theme]) => {
            this.applicationDataDatabase.set(APPLICATION_DATA_CONSTANTS.THEME, theme);
        })
    );

    @Effect({ dispatch: false }) public persistRpc = this.actions$.pipe(
        ofType(fromActions.ApplicationDataActionTypes.CHANGE_RPC)
    ).pipe(
        map((action) => {
            this.applicationDataDatabase.set(APPLICATION_DATA_CONSTANTS.RPC, action.payload.rpc);
        })
    );

    @Effect({ dispatch: false }) public persistLanguage = this.actions$.pipe(
        ofType(fromActions.ApplicationDataActionTypes.CHANGE_LANGUAGE),
        withLatestFrom(this.store.pipe(select(fromSelectors.getLanguage))),
        tap(([action, language]) => {
            this.translateService.use(language);
            this.applicationDataDatabase.set(APPLICATION_DATA_CONSTANTS.LANGUAGE, language);
        })
    );

    @Effect({ dispatch: false }) public persistCurrentDappAddress = this.actions$.pipe(
        ofType(fromActions.ApplicationDataActionTypes.CHANGE_INITIAL_DAPP),
        withLatestFrom(this.store.pipe(select(fromSelectors.getCurrentDappAddress))),
        tap(([action, currentDappAddress]) => {
            this.applicationDataDatabase.set(APPLICATION_DATA_CONSTANTS.CURRENT_DAPP, currentDappAddress);
        })
    );

    @Effect() public updateApplicationData = this.actions$.pipe(
        ofType(fromActions.ApplicationDataActionTypes.INIT_APP_DATA)
    ).pipe(
        switchMap(() => {
            const firstRun$ = this.applicationDataDatabase.get(APPLICATION_DATA_CONSTANTS.FIRST_RUN).pipe(
                map((value) => {
                    return {
                        type: APPLICATION_DATA_CONSTANTS.FIRST_RUN,
                        value
                    };
                })
            );
            const theme$ = this.applicationDataDatabase.get(APPLICATION_DATA_CONSTANTS.THEME).pipe(
                map((value) => {
                    return {
                        type: APPLICATION_DATA_CONSTANTS.THEME,
                        value
                    };
                })
            );
            const currentDapp$ = this.applicationDataDatabase.get(APPLICATION_DATA_CONSTANTS.CURRENT_DAPP).pipe(
                map((value) => {
                    return {
                        type: APPLICATION_DATA_CONSTANTS.CURRENT_DAPP,
                        value
                    };
                })
            );

            const currentLanguage$ = this.applicationDataDatabase.get(APPLICATION_DATA_CONSTANTS.LANGUAGE).pipe(
                map((value) => {
                    return {
                        type: APPLICATION_DATA_CONSTANTS.LANGUAGE,
                        value
                    };
                })
            );


            const currentRpc$ = this.applicationDataDatabase.get(APPLICATION_DATA_CONSTANTS.RPC).pipe(
                map((value) => {
                    return {
                        type: APPLICATION_DATA_CONSTANTS.RPC,
                        value
                    };
                })
            );

            return merge(firstRun$, theme$, currentDapp$, currentLanguage$, currentRpc$).pipe(
                map((element) => {
                    switch (element.type) {
                        case APPLICATION_DATA_CONSTANTS.FIRST_RUN: {
                            const isFirstRun = element.value || element.value === undefined;
                            return new fromActions.ChangeFirstRun({ isFirstRun });
                        }
                        case APPLICATION_DATA_CONSTANTS.THEME: {
                            const theme = element.value ? element.value : THEMES.BLOOMEN;
                            return new fromActions.ChangeTheme({ theme });
                        }
                        case APPLICATION_DATA_CONSTANTS.CURRENT_DAPP: {
                            return new fromActions.ChangeInitialDapp({ currentDappAddress: element.value });
                        }
                        case APPLICATION_DATA_CONSTANTS.LANGUAGE: {
                            const language = element.value;
                            return new fromActions.ChangeLanguage({ language });
                        }
                        case APPLICATION_DATA_CONSTANTS.RPC: {
                            const rpc = element.value || environment.eth.ethRpcUrl ;
                            return new fromActions.ChangeRpc({ rpc });
                        }
                    }
                }),
                catchError((err) => {
                    log.error(`Error: ${err}`);
                    return of('ERROR');
                })
            );
        })
    );

    @Effect({ dispatch: false }) public updateTheme = merge(
        this.actions$.pipe(ofType(fromActions.ApplicationDataActionTypes.CHANGE_THEME))
    ).pipe(
        withLatestFrom(this.store.select(fromSelectors.getTheme)),
        tap(([action, effectiveTheme]) => {
            if (window['cordova']) {
                this.changeStatusBar(effectiveTheme);
            }
            const classList = this.overlayContainer.getContainerElement().classList;
            const toRemove = Array.from(classList).filter((item: string) =>
                item.includes('-theme')
            );
            if (toRemove.length) {
                classList.remove(...toRemove);
            }
            classList.add(effectiveTheme);

        })
    );

    private changeStatusBar(theme: string) {
        this.statusBar.overlaysWebView(false);
        if (theme.endsWith('theme-dark')) {
            this.statusBar.backgroundColorByHexString('#212121');
            this.statusBar.styleLightContent();
        } else {
            this.statusBar.backgroundColorByHexString('#f5f5f5');
            this.statusBar.styleDefault();

        }

    }
}





