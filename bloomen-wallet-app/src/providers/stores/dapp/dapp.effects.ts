import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { union } from 'lodash';

// Store
import { Store } from '@ngrx/store';

// Constants
import { map } from 'rxjs/operators';

// Actions
import * as fromActions from './dapp.actions';
import * as fromAppActions from '@stores/application-data/application-data.actions';
import * as fromfromMnemonicActions from '@stores/mnemonic/mnemonic.actions';
import { Logger } from '@services/logger/logger.service';


import { BloomenContract, DappContract } from '@services/web3/contracts';
import { Web3Service } from '@services/web3/web3.service';
import { TransactionService } from '@services/web3/transactions/transaction.service';
import { Dapp, DappCache } from '@core/models/dapp.model';
import { DappDatabaseService } from '@db/dapp-database.service';
import { Update } from '@ngrx/entity';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DappGeneralDialogComponent } from '@components/dapp-general-dialog/dapp-general-dialog.component';

const log = new Logger('contracts.effects');

@Injectable()
export class DappEffects {

    private updateDappDialog: any;
    private dappCache = {};

    constructor(
        private actions$: Actions<fromActions.DappActions>,
        private bloomen: BloomenContract,
        private web3Service: Web3Service,
        private transactionService: TransactionService,
        private dappDatabaseService: DappDatabaseService,
        private store: Store<Dapp>,
        private translate: TranslateService,
        private dialog: MatDialog
    ) { }

    @Effect({ dispatch: false }) public getCachedFirstDapps = this.actions$.pipe(
        ofType(fromActions.DappActionTypes.INIT_DAPPS),
        map(() => {
            // Si no hay nada entonces pedir al server (first run, o bien nunca llegó a cargar)
            this.dappDatabaseService.getAll().toPromise().then(dapps => {
                if (!dapps.length) {
                    this.store.dispatch(new fromActions.RefreshDapps());
                } else {
                    dapps.forEach(dapp => {
                        this.loadDappAssets(dapp);
                        this.store.dispatch(new fromActions.AddDappSuccess(dapp));
                    });
                }
            });
        })
    );

    @Effect({ dispatch: false }) public getDapps = this.actions$.pipe(
        ofType(
            fromActions.DappActionTypes.REFRESH_DAPPS
        ),
        map(() => {
            this.web3Service.ready(() => {
                Promise.all([
                    this.dappDatabaseService.getAllAddresses().toPromise(),
                    this.bloomen.getDapps()
                ]).then(([cachedAddresses, serverAddresses]) => {
                    const addresses = union(cachedAddresses, serverAddresses);
                    addresses.forEach(address => {
                        /**
                         * Removable when in local storage but not in server:
                         * - Manually added (QR)
                         * - Previously from server but removed once cached
                         */
                        const fromService = serverAddresses.indexOf(address) !== -1;
                        this.loadDapp(address, fromService, true)
                            .then((dapp: DappCache) => {
                                console.log(`**** loadingDapp DappCache: ${JSON.stringify(dapp)}`);
                                this.loadDappAssets(dapp);
                                this.store.dispatch(new fromActions.AddDappSuccess(dapp));
                            });
                    });
                });
            });
        })
    );

    @Effect({ dispatch: false }) public updateDapp = this.actions$.pipe(
        ofType(
            fromActions.DappActionTypes.REFRESH_DAPP,
            fromActions.DappActionTypes.REFRESH_DAPP_SILENT
        ),
        map((action) => {
            this.web3Service.ready(() => {
                const address = action.payload.address;
                const isSilent = action.type === fromActions.DappActionTypes.REFRESH_DAPP_SILENT;
                this.loadDapp(address, undefined , false, isSilent).then((dapp: DappCache) => {
                    const updatedDapp: Update<DappCache> = {
                        id: dapp.address,
                        changes: dapp
                    };
                    this.loadDappAssets(dapp);
                    this.store.dispatch(new fromActions.RefreshDappSuccess(updatedDapp));
                    setTimeout(() => {
                        this.store.dispatch(new fromAppActions.ChangeTheme({ theme: dapp.laf.theme }));
                    });
                });
            });
        })
    );

    @Effect({ dispatch: false }) public addDapp = this.actions$.pipe(
        ofType(fromActions.DappActionTypes.ADD_DAPP),
        map((action) => {
            this.web3Service.ready(() => {
                this.loadDapp(action.payload.address, false).then((dapp: DappCache) => {
                    this.loadDappAssets(dapp);
                    this.store.dispatch(new fromActions.AddDappSuccess(dapp));
                });
            });
        })
    );

    @Effect({ dispatch: false }) public removeDapp = this.actions$.pipe(
        ofType(fromActions.DappActionTypes.REMOVE_DAPP),
        map((action) => {
            this.dappDatabaseService.remove(action.payload.address);
            this.store.dispatch(new fromActions.RemoveDappSuccess({ address: action.payload.address }));
            this.store.dispatch(new fromfromMnemonicActions.RemoveMnemonic({ address: action.payload.address }));
        })
    );

    private async loadDapp(address: string, fromService?: boolean, isGeneral?: boolean, silent?: boolean): Promise<DappCache> {
        const dbDappPromise = this.dappDatabaseService.get(address).toPromise();

        if (!this.dappCache[address]) {
            const dappContract = new DappContract(address, this.web3Service, this.transactionService);
            this.dappCache[address] = dappContract;
        }

        const bloomenDappPromise =  this.dappCache[address].getData(silent) as Promise<Dapp>;
        const [cachedDapp, serverDapp] = await Promise.all([dbDappPromise, bloomenDappPromise]);

        if (cachedDapp) { this.initializeFeaturesDapp(cachedDapp); }
        if (serverDapp) { this.initializeFeaturesDapp(serverDapp); }

        // console.log(`**** cacheDapp loaaded: ${JSON.stringify(cachedDapp)}`);
        // console.log(`**** serverDapp loaaded: ${JSON.stringify(serverDapp)}`);

        return this.storeDapp(address, serverDapp, cachedDapp, fromService, isGeneral);
    }

    private initializeFeaturesDapp(dapp: Dapp) {
        console.log(`**** dapp loaaded before initialize: ${JSON.stringify(dapp)}`);
        if ( !dapp.features ) {
            console.log(`**** dapp without features, updating: ${JSON.stringify(dapp)}`);
            dapp.features = {
                decimals: 2,
                burn: true,
                addTokens: true,
                storeTab: true,
                devicesTab: true,
                allow: true,
                buy: true,
                transfer: true,
                raw: true,
                token: 'BLO'
            };
        } else {
            const burn: string = String(dapp.features.burn);
            const addTokens: string = String(dapp.features.addTokens);
            const storeTab:  string = String(dapp.features.storeTab);
            const devicesTab:  string = String(dapp.features.devicesTab);
            const allow:  string = String(dapp.features.allow);
            const buy:  string = String(dapp.features.buy);
            const transfer:  string = String(dapp.features.transfer);
            const raw:  string = String(dapp.features.raw);

            dapp.features = {
                decimals: +dapp.features.decimals,
                burn: (burn.toLowerCase() === 'true'),
                addTokens: (addTokens.toLowerCase() === 'true'),
                storeTab: (storeTab.toLowerCase() === 'true'),
                devicesTab: (devicesTab.toLowerCase() === 'true'),
                allow: (allow.toLowerCase() === 'true'),
                buy: (buy.toLowerCase() === 'true'),
                transfer: (transfer.toLowerCase() === 'true'),
                raw: (raw.toLowerCase() === 'true'),
                token: dapp.features.token
            };
        }
        console.log(`**** dapp loaaded after initialize: ${JSON.stringify(dapp)}`);    }

    private storeDapp(address: string,
        serverDapp: Dapp, cachedDapp?: any,
        fromService = cachedDapp ? cachedDapp.fromService : true, isGeneral?: boolean) {
        return new Promise<DappCache>((resolve, reject) => {
            if (!isGeneral && cachedDapp && !this.isDappEqual(cachedDapp, serverDapp)) {
                if (!this.updateDappDialog) {
                    this.updateDappDialog = this.dialog.open(DappGeneralDialogComponent, {
                        width: '250px',
                        height: '200px',
                        data: {
                            title: this.translate.instant('dapp.dialog_refresh_dapp.title',
                                {
                                    dappTitle: this.translate.instant(cachedDapp.address + '.home.title')
                                }),
                            description: this.translate.instant('dapp.dialog_refresh_dapp.description'),
                            buttonAccept: this.translate.instant('common.accept'),
                            buttonCancel: this.translate.instant('common.cancel')
                        }
                    });

                    this.updateDappDialog.afterClosed().subscribe(result => {
                        this.updateDappDialog = undefined;
                        if (result) {
                            const dapp: DappCache = {
                                ... {},
                                ...serverDapp,
                                address,
                                fromService,
                                lastUpdated: new Date()
                            };

                            this.dappDatabaseService.set(address, dapp);
                            resolve(dapp);
                        } else {
                            resolve(cachedDapp);
                        }
                    });
                }
            } else {
                const dapp: DappCache = {
                    ...{},
                    ...serverDapp,
                    address,
                    fromService,
                    lastUpdated: new Date()
                };

                this.dappDatabaseService.set(address, dapp);
                resolve(dapp);
            }
        });
    }

    private isDappEqual(cachedDapp, serverDapp): boolean {

        const cachedDappLocal = JSON.parse(JSON.stringify(cachedDapp));

        delete cachedDappLocal['address'];
        delete cachedDappLocal['lastUpdated'];
        delete cachedDappLocal['fromService'];


        return JSON.stringify(cachedDappLocal) === JSON.stringify(serverDapp);
    }

    private loadDappAssets(dapp: DappCache): void {
        this.preloadDappImages(dapp);
        this.setTranslationIntoLanguage(dapp);
    }

    private setTranslationIntoLanguage(dapp: Dapp) {
        Object.keys(dapp.i18n).forEach(lang => {
            const transObj = {};
            const translation: Dapp.I18nDapp.Translation = dapp.i18n[lang];
            transObj[`${dapp.address}.home.title`] = translation.home.title;
            transObj[`${dapp.address}.home.subtitle`] = translation.home.subtitle;
            transObj[`${dapp.address}.login.title`] = translation.login.title;

            this.translate.setTranslation(lang, transObj, true);
        });
        if (dapp.news) {
            dapp.news.forEach((news, index) => {
                Object.keys(news.i18n).forEach(lang => {
                    const transObj = {};
                    const translation: Dapp.News.I18nNews.Translation = news.i18n[lang];
                    transObj[`${dapp.address}.news.${index}.title`] = translation.title;
                    transObj[`${dapp.address}.news.${index}.description`] = translation.description;

                    this.translate.setTranslation(lang, transObj, true);
                });
            });
        }
    }

    private preloadDappImages(dapp: Dapp) {
        this.store.dispatch(new fromAppActions.PreloadImage(dapp.logo));
        this.store.dispatch(new fromAppActions.PreloadImage(dapp.background));

        this.store.dispatch(new fromAppActions.PreloadImage(dapp.laf.homeImage));
        this.store.dispatch(new fromAppActions.PreloadImage(dapp.laf.prepaidCardImage));

        this.store.dispatch(new fromAppActions.PreloadImage(dapp.laf.landingImage));

        if (dapp.news) {
            dapp.news.forEach(notification => {
                this.store.dispatch(new fromAppActions.PreloadImage(notification.img));
            });
        }
    }

}





